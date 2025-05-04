/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "./Slicer";
import { User_Profile_Detail } from "../../utils/api";
import { handleApiError } from "../../utils/errorHandler";



// Create the async thunk for fetching user details
export const getUserDetailApi = createAsyncThunk(
  "user/getDetail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        User_Profile_Detail,
        getConfig()

      );
      localStorage.setItem('BNuserDetail', JSON.stringify(response.data));
      return response.data?.data;
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);



const initialState = {
  isLoading: false,
  isError: false,
  userDetail: null,
  errorMessage: "",

};

// Create the slice
const GetUserDetailSlice = createSlice({
  name: "getUserDetail",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetailApi.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getUserDetailApi.fulfilled, (state, action) => {
        state.isLoading = false;
        
        state.userDetail = action.payload;
        state.isError = false;
      })
      .addCase(getUserDetailApi.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Failed to fetch user details";
      });
  },
});

export const {  } = GetUserDetailSlice.actions;
export default GetUserDetailSlice.reducer;