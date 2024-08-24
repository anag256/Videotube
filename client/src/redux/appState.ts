import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "appState",
  initialState: {
    showSidebar: true,
    user: {
      userId: "",
      username:"",
      avatar:"",
      isAuthenticated: false,
    },
    showLoader: false,
    toast: {
      isVisible: false,
      status: "",
      message: "",
    },
  },
  reducers: {
    toggleSidebar(state) {
      state.showSidebar = !state.showSidebar;
    },
    setCurrentUser(state, action) {
      state.user = action.payload;
    },
    setToastData(state, action) {
      state.toast = action.payload.toast;
    },
    setShowLoader(state, action) {
      state.showLoader = action.payload.showLoader;
    },
  },
});

export const {
  toggleSidebar,
  setCurrentUser,
  setToastData,
  setShowLoader
} = appSlice.actions;
export default appSlice.reducer;
