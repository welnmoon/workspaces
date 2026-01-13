import { createSlice } from '@reduxjs/toolkit';

const savedTheme = localStorage.getItem('theme');

export interface ThemeState {
  mode: 'light' | 'dark' | 'system';
}

const initialState: ThemeState = {
  mode: (savedTheme as ThemeState['mode']) || 'system',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state: ThemeState) => {
      switch (state.mode) {
        case 'light':
          state.mode = 'dark';
          break;
        case 'dark':
          state.mode = 'system';
          break;
        case 'system':
          state.mode = 'light';
          break;
      }

      localStorage.setItem('theme', state.mode);
    },
  },
});
export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
