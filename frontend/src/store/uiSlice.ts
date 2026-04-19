import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Theme = 'dark' | 'light';

interface UiState {
  sidebarOpen: boolean;
  theme: Theme;
  voiceLanguage: string;
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('qurate_theme') as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

const initialState: UiState = {
  sidebarOpen: true,
  theme: getInitialTheme(),
  voiceLanguage: 'en-US',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('qurate_theme', state.theme);
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem('qurate_theme', state.theme);
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    },
    setVoiceLanguage(state, action: PayloadAction<string>) {
      state.voiceLanguage = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setTheme, setVoiceLanguage } = uiSlice.actions;
export default uiSlice.reducer;
