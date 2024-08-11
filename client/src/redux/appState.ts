import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "appState",
  initialState: {
    showSidebar: true,
    isAuthenticated:false
  },
  reducers: {
    toggleSidebar(state) {
      state.showSidebar = !state.showSidebar;
    },
    setisAuthenticated(state,action) {
      state.showSidebar = action.payload.isAuthenticated;
    },
  },
});

export const {
  toggleSidebar,
  setisAuthenticated
} = appSlice.actions;
export default appSlice.reducer;
