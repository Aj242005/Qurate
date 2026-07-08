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

type ApiMessageRole = 'user' | 'assistant';

type HistoryResponsePayload = {
  type?: 'text' | 'table' | 'graph';
  response?: unknown;
  data?: unknown;
  content?: unknown;
};

type HistoryEntry = {
  id?: string | number;
  role?: ApiMessageRole;
  sender?: ApiMessageRole;
  content?: unknown;
  message?: unknown;
  prompt?: unknown;
  query?: unknown;
  question?: unknown;
  answer?: unknown;
  response?: HistoryResponsePayload | string | unknown;
  type?: 'text' | 'table' | 'graph';
  timestamp?: string;
  created_at?: string;
};

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
  return typeof value === 'object' && value !== null;
}

function messageContent(value: unknown) {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return JSON.stringify(value);
}

function responseType(value: unknown): ChatMessage['type'] {
  if (isRecord(value) && (value.type === 'table' || value.type === 'graph' || value.type === 'text')) {
    return value.type;
  }
  return 'text';
}

function responsePayload(value: unknown) {
  if (isRecord(value)) {
    if ('response' in value) return value.response;
    if ('data' in value) return value.data;
    if ('content' in value) return value.content;
  }
  return value;
}

function toChatMessage(entry: HistoryEntry, fallbackRole?: ApiMessageRole): ChatMessage {
  const role = entry.role || entry.sender || fallbackRole || 'assistant';
  const rawResponse = entry.response ?? entry.answer;
  const normalizedResponse = role === 'assistant'
    ? responsePayload(rawResponse ?? entry.content ?? entry.message)
    : (entry.content ?? entry.message ?? entry.prompt ?? entry.query ?? entry.question);
  const type = role === 'assistant' ? responseType(rawResponse ?? entry) : 'text';
  const content = messageContent(
    entry.content ??
    entry.message ??
    (role === 'user' ? (entry.prompt ?? entry.query ?? entry.question) : normalizedResponse)
  );

  return {
    id: String(entry.id || nextId()),
    role,
    content,
    type,
    response: normalizedResponse,
    timestamp: entry.timestamp || entry.created_at || new Date().toISOString(),
  };
}

function extractHistoryItems(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return [];

  const candidates = [
    data.anotherValid,
    data.data,
    data.messages,
    data.history,
    data.chat_history,
    data.chats,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (isRecord(candidate)) {
      const nested = extractHistoryItems(candidate);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function normalizeHistory(data: unknown): ChatMessage[] {
  return extractHistoryItems(data).flatMap((item) => {
    if (!isRecord(item)) return [];
    const entry = item as HistoryEntry;

    if ((entry.prompt || entry.query || entry.question) && (entry.response || entry.answer)) {
      return [
        toChatMessage(
          {
            id: `${entry.id || nextId()}_user`,
            role: 'user',
            content: entry.prompt ?? entry.query ?? entry.question,
            timestamp: entry.timestamp,
            created_at: entry.created_at,
          },
          'user'
        ),
        toChatMessage(
          {
            id: `${entry.id || nextId()}_assistant`,
            role: 'assistant',
            content: entry.answer,
            response: entry.response ?? entry.answer,
            type: entry.type,
            timestamp: entry.timestamp,
            created_at: entry.created_at,
          },
          'assistant'
        ),
      ];
    }

    return [toChatMessage(entry)];
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
        const assistantMsg: ChatMessage = {
          id: nextId(),
          role: 'assistant',
          content: typeof res.data.data.response === 'string'
            ? res.data.data.response
            : JSON.stringify(res.data.data.response),
          type: res.data.data.type,
          response: res.data.data.response,
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
