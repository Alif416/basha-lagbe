import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  error: null,
  isLoading: false,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminSignInRequest(state) {
      state.isLoading = true;
    },
    adminSignInSuccess(state, action) {
      state.isLoading = false;
      state.admin = action.payload;
      state.error = null;
    },
    adminSignInFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    adminSignOutSuccess(state) {
      state.admin = null;
    },
    signOutAdminSuccess(state) {
      state.admin = null;
    },
  },
});

export const {
  adminSignInRequest,
  adminSignInSuccess,
  adminSignInFailure,
  adminSignOutSuccess,
  signOutAdminSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;