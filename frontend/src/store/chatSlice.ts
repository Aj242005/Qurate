import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiPrompt, apiChatHistory, apiClearHistory } from '@/lib/api';

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
      if (res.data.anotherValid && Array.isArray(res.data.anotherValid)) {
        return res.data.anotherValid.map((item) => ({
          id: nextId(),
          role: item.role,
          content: item.content,
          type: item.response?.type || 'text',
          response: item.response?.response || item.content,
          timestamp: item.timestamp,
        })) as ChatMessage[];
      }
      return [];
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
