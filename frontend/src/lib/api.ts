
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
  console.log('[tryRefresh] Initialized. Refresh token available:', !!refreshToken);
  if (!refreshToken) return false;

  try {
    console.log('[tryRefresh] Sending POST request to /refresh...');
    const res = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        refreshtoken: refreshToken,
      },
    });
    console.log('[tryRefresh] Response status:', res.status);

    let newAccess = '';
    let newRefresh = '';

    try {
      const data = await res.clone().json() as ApiResponse;
      console.log('[tryRefresh] JSON body response:', data);
      if (data && data.anotherValid && typeof data.anotherValid === 'object') {
        const tokens = data.anotherValid as Record<string, string>;
        newAccess = tokens.accessToken || tokens.accesstoken || '';
        newRefresh = tokens.refreshToken || tokens.refreshtoken || '';
      }
    } catch (e) {
      console.warn('[tryRefresh] JSON parsing failed or struct mismatched:', e);
    }

    if (!newAccess || !newRefresh) {
      newAccess = res.headers.get('accesstoken') || '';
      newRefresh = res.headers.get('refreshtoken') || '';
      console.log('[tryRefresh] Fallback to response headers. Access:', !!newAccess, 'Refresh:', !!newRefresh);
    }

    if (res.ok && newAccess && newRefresh) {
      console.log('[tryRefresh] Success. Storing new tokens.');
      setTokens(newAccess, newRefresh);
      return true;
    }
    console.warn('[tryRefresh] Failed. Response not OK or tokens missing.');
    return false;
  } catch (err) {
    console.error('[tryRefresh] Exception during fetch:', err);
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

  console.log(`[apiFetch] Request starting for path: ${path}, method: ${options.method || 'GET'}`);
  let res = await fetch(`${BASE_URL}${path}`, fetchOpts);
  console.log(`[apiFetch] Response status for ${path}:`, res.status);

  // Handle expired access token — try refresh
  if (res.status === 410) {
    console.warn(`[apiFetch] Path ${path} returned 410 (Expired token).`);
    if (!isRefreshing) {
      console.log('[apiFetch] Triggering tryRefresh...');
      isRefreshing = true;
      tryRefresh().then((refreshed) => {
        isRefreshing = false;
        console.log('[apiFetch] tryRefresh finished. Result:', refreshed);
        if (refreshed) {
          const { accessToken: newToken } = getTokens();
          onRefreshed(newToken);
        } else {
          console.warn('[apiFetch] Token refresh failed. Clearing tokens and redirecting.');
          onRefreshed(''); // Unblock pending subscribers
          clearTokens();
          window.location.href = '/login';
        }
      }).catch((e) => {
        isRefreshing = false;
        console.error('[apiFetch] tryRefresh promise uncaught error:', e);
        onRefreshed(''); // Unblock pending subscribers
        clearTokens();
        window.location.href = '/login';
      });
    }

    console.log(`[apiFetch] Queueing request for ${path} until refresh finishes...`);
    const retryOriginalRequest = new Promise<Response>((resolve) => {
      subscribeTokenRefresh((token) => {
        if (!token) {
          console.warn(`[apiFetch] Retrying queued request for ${path} with empty token (refresh failed)`);
        } else {
          console.log(`[apiFetch] Retrying queued request for ${path} with new token`);
        }
        headers['accesstoken'] = token;
        fetchOpts.headers = headers;
        resolve(fetch(`${BASE_URL}${path}`, fetchOpts));
      });
    });

    res = await retryOriginalRequest;
    console.log(`[apiFetch] Retried request for ${path} finished. Status:`, res.status);
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
