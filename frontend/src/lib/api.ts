
const BASE_URL = import.meta.env.VITE_BASE_URL || (import.meta.env.PROD 
  ? 'http://34.131.253.6:1008' 
  : 'http://localhost:1008');

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  isFormData?: boolean;
};

function getTokens() {
  return {
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  };
}

function setTokens(access: string, refresh: string) {
  if (access) localStorage.setItem('accessToken', access);
  if (refresh) localStorage.setItem('refreshToken', refresh);
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

async function tryRefresh(): Promise<boolean> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        refreshtoken: refreshToken,
      },
    });

    let newAccess = '';
    let newRefresh = '';

    try {
      const data = await res.clone().json() as ApiResponse;
      if (data && data.anotherValid && typeof data.anotherValid === 'object') {
        const tokens = data.anotherValid as Record<string, string>;
        newAccess = tokens.accessToken || tokens.accesstoken || '';
        newRefresh = tokens.refreshToken || tokens.refreshtoken || '';
      }
    } catch {
      // ignore JSON parse/structure errors
    }

    if (!newAccess || !newRefresh) {
      newAccess = res.headers.get('accesstoken') || '';
      newRefresh = res.headers.get('refreshtoken') || '';
    }

    if (res.ok && newAccess && newRefresh) {
      setTokens(newAccess, newRefresh);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<{ ok: boolean; status: number; data: T; headers: Headers }> {
  const { accessToken } = getTokens();

  const headers: Record<string, string> = {
    ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (accessToken) {
    headers['accesstoken'] = accessToken;
  }

  const fetchOpts: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    fetchOpts.body = options.isFormData
      ? (options.body as FormData)
      : JSON.stringify(options.body);
  }

  let res = await fetch(`${BASE_URL}${path}`, fetchOpts);

  // Handle expired access token — try refresh
  if (res.status === 410) {
    if (!isRefreshing) {
      isRefreshing = true;
      tryRefresh().then((refreshed) => {
        isRefreshing = false;
        if (refreshed) {
          const { accessToken: newToken } = getTokens();
          onRefreshed(newToken);
        } else {
          clearTokens();
          window.location.href = '/login';
        }
      });
    }

    const retryOriginalRequest = new Promise<Response>((resolve) => {
      subscribeTokenRefresh((token) => {
        headers['accesstoken'] = token;
        fetchOpts.headers = headers;
        resolve(fetch(`${BASE_URL}${path}`, fetchOpts));
      });
    });

    res = await retryOriginalRequest;
  }

  // Handle tampered/invalid token
  if (res.status === 401 && path !== '/login') {
    clearTokens();
    window.location.href = '/login';
    return { ok: false, status: 401, data: {} as T, headers: res.headers };
  }

  let data: T;
  try {
    data = await res.json();
  } catch {
    data = {} as T;
  }

  return { ok: res.ok, status: res.status, data, headers: res.headers };
}

// ── Typed API Functions ──

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  phone_number: number;
  gender: string;
  purpose?: string;
}

export interface ApiResponse {
  status: number;
  message: string;
  anotherValid?: unknown;
}

export interface PromptResponse {
  status: number;
  message: string;
  data: {
    type: 'text' | 'table' | 'graph';
    response: unknown;
  };
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
  response: {
    type: 'text' | 'table' | 'graph';
    response: unknown;
  };
  timestamp: string;
}

export async function apiLogin(payload: LoginPayload) {
  const res = await apiFetch<ApiResponse>('/login', {
    method: 'POST',
    body: payload,
  });

  // Extract tokens from body, fallback to headers
  let accessToken = '';
  let refreshToken = '';

  const data = res.data;
  if (data && data.anotherValid && typeof data.anotherValid === 'object') {
    const tokens = data.anotherValid as Record<string, string>;
    accessToken = tokens.accessToken || tokens.accesstoken || '';
    refreshToken = tokens.refreshToken || tokens.refreshtoken || '';
  }

  if (!accessToken || !refreshToken) {
    accessToken = res.headers.get('accesstoken') || '';
    refreshToken = res.headers.get('refreshtoken') || '';
  }

  if (accessToken && refreshToken) {
    setTokens(accessToken, refreshToken);
  }

  return res;
}

export async function apiSignUp(payload: SignUpPayload) {
  return apiFetch<ApiResponse>('/sign-up', {
    method: 'POST',
    body: payload,
  });
}

export async function apiPrompt(prompt: string) {
  return apiFetch<PromptResponse>('/prompt2query', {
    method: 'POST',
    body: { prompt },
  });
}

export async function apiChatHistory() {
  return apiFetch<{ status: number; message: string; anotherValid: ChatHistoryItem[] }>(
    '/chat-history'
  );
}

export async function apiClearHistory() {
  return apiFetch<ApiResponse>('/chat-history', { method: 'DELETE' });
}

export async function apiUploadExcel(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return apiFetch<ApiResponse>('/upload-excel', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}
