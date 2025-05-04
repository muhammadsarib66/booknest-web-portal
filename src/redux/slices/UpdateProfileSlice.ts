/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import { Change_Pass_Api, Update_User_Profile } from "../../utils/api";
import { getUserDetailApi } from "./GetUserDetailSlice";
import { getConfig, getConfigFormData } from "./Slicer";

export const updateUserProfileApi = createAsyncThunk(
  "user/updateProfile",
  async (UpdateUserData: any, {dispatch, rejectWithValue }) => {
    console.log(UpdateUserData, "UpdateUserData")
    try {
      const response = await axios.put(
        Update_User_Profile,
        UpdateUserData,
        getConfigFormData()
      );
      toast.success(response?.data?.message || "Profile updated successfully");
      dispatch(getUserDetailApi())
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
export const ChangePassApi = createAsyncThunk(
  "user/changePass",
  async (passwords: any, {dispatch, rejectWithValue }) => {
    console.log(passwords, "passwords")
    try {
      const response = await axios.post(
        Change_Pass_Api,
        passwords,
        getConfig()
      );
      toast.success(response?.data?.message || "Password Changed successfully");
      dispatch(getUserDetailApi())
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);


const initialState = {
  isLoading: false,
  isError: false,
  // updateProfileData: {},
};

const UpdateProfileSlice = createSlice({
  name: "updateProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfileApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfileApi.fulfilled, (state) => {
        state.isLoading = false;
        // state.updateProfileData = action.payload;
      })
      .addCase(updateUserProfileApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // change password
      .addCase(ChangePassApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ChangePassApi.fulfilled, (state) => {
        state.isLoading = false;
        // state.updateProfileData = action.payload;
      })
      .addCase(ChangePassApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
  },
});

export default UpdateProfileSlice.reducer; 