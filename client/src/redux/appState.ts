import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "appState",
  initialState: {
    showSidebar: true,

  },
  reducers: {
    toggleSidebar(state) {
      state.showSidebar = !state.showSidebar;
    },

  },
});

export const {
  toggleSidebar,

} = appSlice.actions;
export default appSlice.reducer;
