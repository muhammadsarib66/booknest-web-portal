import axios from "axios";
import { Notifications_Api } from "../../utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError } from "../../utils/errorHandler";
import { getConfig } from "./Slicer";

export const GetNotificationsApi = createAsyncThunk(
  "booknest/notifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(Notifications_Api, getConfig());
      console.log(response?.data, "My Notificaitons");
      return response?.data?.notifications
      ;
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

const initialState = {
  isLoading: false,
  isError: false,
  getAllNotifications: [],
};

const NotificationSlice = createSlice({
  name: "NotificationSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetNotificationsApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetNotificationsApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getAllNotifications = action.payload;
      })
      .addCase(GetNotificationsApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default NotificationSlice.reducer;
