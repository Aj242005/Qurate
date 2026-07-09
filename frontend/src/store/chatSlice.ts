import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiPrompt, apiChatHistory, apiClearHistory, clearTokens } from '@/lib/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'table' | 'graph';
  response: unknown;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

let messageIdCounter = 0;
function nextId() {
  return `msg_${Date.now()}_${messageIdCounter++}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringify(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return JSON.stringify(value);
}

/**
 * Attempts to parse a string as JSON. Returns the parsed value if it's
 * a record or array; returns null otherwise.
 */
function tryParseJSON(str: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(str);
    if (isRecord(parsed)) return parsed;
  } catch {
    // not valid JSON
  }
  return null;
}

/**
 * Resolves the "typed response" payload from a history entry's response field.
 *
 * The backend stores the response object as:
 *   { type: "text"|"table"|"graph", response: <actual payload> }
 *
 * But in some cases `response.response` is a STRINGIFIED JSON of the real payload
 * (backend bug), or the outer `type` is wrong (says "text" when it's actually "table").
 *
 * This function normalizes all those cases and returns:
 *   { type, payload } where payload is the final unwrapped value.
 */
function resolveTypedResponse(raw: unknown): { type: 'text' | 'table' | 'graph'; payload: unknown } {
  if (!isRecord(raw)) {
    // If raw is a string, try to parse it as JSON (backend sometimes stringifies the whole thing)
    if (typeof raw === 'string') {
      const parsed = tryParseJSON(raw);
      if (parsed) return resolveTypedResponse(parsed);
    }
    return { type: 'text', payload: raw };
  }

  // If it's a { type, response } wrapper from the backend
  if ('type' in raw && 'response' in raw) {
    const declaredType = raw.type;
    let innerPayload = raw.response;

    // If the inner payload is a string, try to parse it
    if (typeof innerPayload === 'string') {
      const parsed = tryParseJSON(innerPayload);
      if (parsed) innerPayload = parsed;
    }

    // If the inner payload is itself a { type, response } wrapper, recurse
    if (isRecord(innerPayload) && 'type' in innerPayload && 'response' in innerPayload) {
      return resolveTypedResponse(innerPayload);
    }

    // Detect actual type from the payload shape (override backend's declared type if wrong)
    const actualType = detectType(innerPayload, declaredType);
    return { type: actualType, payload: innerPayload };
  }

  // If it looks like table data directly
  if ('columns' in raw && 'rows' in raw) {
    return { type: 'table', payload: raw };
  }

  // If it looks like graph data directly
  if ('x' in raw && 'y' in raw) {
    return { type: 'graph', payload: raw };
  }

  // If it has a 'data' wrapper (from the prompt2query response envelope)
  if ('data' in raw && isRecord(raw.data)) {
    return resolveTypedResponse(raw.data);
  }

  return { type: 'text', payload: raw };
}

/**
 * Detect the actual type from the payload shape, overriding the declared type
 * if the data clearly contradicts it.
 */
function detectType(
  payload: unknown,
  declaredType: unknown
): 'text' | 'table' | 'graph' {
  if (isRecord(payload)) {
    if ('columns' in payload && 'rows' in payload) return 'table';
    if ('x' in payload && 'y' in payload) return 'graph';
  }

  if (declaredType === 'table' || declaredType === 'graph' || declaredType === 'text') {
    return declaredType as 'text' | 'table' | 'graph';
  }

  return 'text';
}

/**
 * Normalize a single MongoDB history entry into a ChatMessage.
 */
function historyEntryToChatMessage(entry: Record<string, unknown>): ChatMessage {
  const role: 'user' | 'assistant' =
    entry.role === 'user' ? 'user' :
    entry.role === 'assistant' ? 'assistant' :
    (entry.sender === 'user' ? 'user' : 'assistant');

  const timestamp = stringify(entry.timestamp || entry.created_at || new Date().toISOString());

  if (role === 'user') {
    // For user messages, content is the prompt text
    const text = stringify(entry.content ?? entry.message ?? entry.prompt ?? entry.query ?? '');
    return {
      id: String(entry.id || nextId()),
      role: 'user',
      content: text,
      type: 'text',
      response: text,
      timestamp,
    };
  }

  // For assistant messages, resolve the typed response from the response field
  const rawResponse = entry.response;
  const { type, payload } = resolveTypedResponse(rawResponse);

  // For the display content string:
  // - For text type: use the payload directly if it's a string, otherwise the content field
  // - For table/graph: use the content field (human-readable summary) if available
  let content: string;
  if (type === 'text') {
    content = typeof payload === 'string' ? payload : stringify(entry.content ?? payload);
  } else {
    // For table/graph, prefer the content field as a human-readable label
    content = typeof entry.content === 'string' && entry.content
      ? entry.content
      : `${type} result`;
  }

  return {
    id: String(entry.id || nextId()),
    role: 'assistant',
    content,
    type,
    response: payload,
    timestamp,
  };
}

/**
 * Extract the history items array from the API response.
 * The backend wraps it as { status, message, anotherValid: [...] }
 */
function extractHistoryItems(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return [];

  for (const key of ['anotherValid', 'data', 'messages', 'history', 'chat_history', 'chats']) {
    const candidate = data[key];
    if (Array.isArray(candidate)) return candidate;
    if (isRecord(candidate)) {
      const nested = extractHistoryItems(candidate);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

/**
 * Normalize the full API response into an array of ChatMessages.
 */
function normalizeHistory(data: unknown): ChatMessage[] {
  return extractHistoryItems(data).flatMap((item) => {
    if (!isRecord(item)) return [];
    return [historyEntryToChatMessage(item)];
  });
}

export const sendPrompt = createAsyncThunk(
  'chat/sendPrompt',
  async (prompt: string, { dispatch, rejectWithValue }) => {
    // Add user message immediately
    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: prompt,
      type: 'text',
      response: prompt,
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(userMsg));

    try {
      const res = await apiPrompt(prompt);

      // Handle auth failures returned as HTTP 200 with error status in body
      if (res.data.status === 404 || res.data.status === 401 || res.data.status === 410) {
        clearTokens();
        window.location.href = '/login';
        return rejectWithValue('Session expired. Please log in again.');
      }

      if (res.data && res.data.data) {
        const { type, payload } = resolveTypedResponse(res.data.data);
        const assistantMsg: ChatMessage = {
          id: nextId(),
          role: 'assistant',
          content: typeof payload === 'string' ? payload : stringify(payload),
          type,
          response: payload,
          timestamp: new Date().toISOString(),
        };
        return assistantMsg;
      }
      return rejectWithValue(res.data?.message || 'Failed to get response');
    } catch {
      return rejectWithValue('Network error');
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiChatHistory();

      // Backend auth failure is returned as HTTP 200 with status 404 in body
      if (res.data.status === 404 || res.data.status === 401 || res.data.status === 410) {
        clearTokens();
        window.location.href = '/login';
        return rejectWithValue(res.data.message);
      }

      return normalizeHistory(res.data);
    } catch {
      return rejectWithValue('Failed to fetch history');
    }
  }
);

export const clearChatHistory = createAsyncThunk(
  'chat/clearHistory',
  async (_, { rejectWithValue }) => {
    try {
      await apiClearHistory();
      return true;
    } catch {
      return rejectWithValue('Failed to clear history');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPrompt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPrompt.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendPrompt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Show the error as a chat message so the user sees feedback
        state.messages.push({
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: (action.payload as string) || 'Something went wrong. Please try again.',
          type: 'text',
          response: (action.payload as string) || 'Something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(clearChatHistory.fulfilled, (state) => {
        state.messages = [];
      });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
