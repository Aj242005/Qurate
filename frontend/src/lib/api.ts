
const BASE_URL = "http://34.131.229.124:1008";

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

    const newAccess = res.headers.get('accesstoken');
    const newRefresh = res.headers.get('refreshtoken');

    if (res.ok && newAccess && newRefresh) {
      setTokens(newAccess, newRefresh);
      return true;
    }
    return false;
  } catch {
    return false;
  }
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
    const refreshed = await tryRefresh();
    if (refreshed) {
      const { accessToken: newToken } = getTokens();
      headers['accesstoken'] = newToken;
      fetchOpts.headers = headers;
      res = await fetch(`${BASE_URL}${path}`, fetchOpts);
    } else {
      clearTokens();
      window.location.href = '/login';
      return { ok: false, status: 401, data: {} as T, headers: res.headers };
    }
  }

  // Handle tampered/invalid token
  if (res.status === 401) {
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

  // Extract tokens from headers
  const accessToken = res.headers.get('accesstoken');
  const refreshToken = res.headers.get('refreshtoken');
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
