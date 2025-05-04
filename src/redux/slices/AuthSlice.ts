/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/errorHandler";
import { Login_Api, Send_Ver_Email_Api, Sign_Up_Api, reset_Password, send_Otp, verify_Otp } from "../../utils/api";

// SignUp Profile Function
export const SignUpProfileApi: any = createAsyncThunk(
  "user/signUpProfile",
  async (userData: any, {dispatch,  rejectWithValue }) => {
    try {
      const response = await axios.post(Sign_Up_Api,userData);
        toast.success(response?.data?.message || "");
        console.log(response, "coming from Api Response");
        dispatch(SendVerEmailApi(response?.data?.data.email));
      return { responseData: response.data, userData }; // Return both the response and formData
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// Send Verification Email to User
export const SendVerEmailApi: any = createAsyncThunk(
  "user/sendemailtouser",
  async (userMail: any, {  rejectWithValue }) => {
    console.log(userMail, "coming from email Api");
    try {
      const response = await axios.post(Send_Ver_Email_Api, {email:userMail});
        toast.success(response?.data?.message || "");
        console.log(response, "coming from  email Api Response");
      return  response.data; // Return both the response and formData
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);



// Login Function 
export const LoginApi: any = createAsyncThunk(
    "user/signin",
    async (formData: any, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${Login_Api}`, formData);

            console.log(response, "coming from Login Api Response");
        localStorage.setItem('NBUserToken', response?.data?.token);
        localStorage.setItem('NBUserBasicDetail', response?.data?.existingUser);
  
        return {
          responseData: response?.data,
        };
      } catch (err: any) {
        return rejectWithValue(handleApiError(err));
      }
    }
  );

  // Reset Password API Thunk
export const sendOtpApi = createAsyncThunk(
  'otp/sendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${send_Otp}`, { email });
      return response.data;
    } catch (err:any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

// Verify OTP API
export const verifyOtpApi = createAsyncThunk(
  'otp/verifyOtp',
  async ({ email, otp }: { email: string | null; otp: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${verify_Otp}`, { email, otp });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

// reset password API
export const resetPasswordApi = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, newPassword }: { email: string | null; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${reset_Password}`, { email, newPassword });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);


const initialState = {
  isLoading: false,
  isError: false,
  userBasicDetail : '',
  signUpProfileData: {}, // Initialize with an empty object to hold formData
};

const AuthSlice = createSlice({
  name: "signUpProfile",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(SignUpProfileApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(SignUpProfileApi.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action.payload, "coming from payload");
      state.signUpProfileData = action.payload.formData; // Save the formData to ReqAccData
    });
    builder.addCase(SignUpProfileApi.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    // send Verification Email to User 
    builder.addCase(SendVerEmailApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(SendVerEmailApi.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action.payload, "coming from payload");
    });
    builder.addCase(SendVerEmailApi.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    // Login APi Function 
    builder.addCase(LoginApi.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(LoginApi.fulfilled, (state) => {
        state.isLoading = false;
      });
      builder.addCase(LoginApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

      // send otp
      builder.addCase(sendOtpApi.pending, (state) => {
        state.isLoading = true;
      })
      builder.addCase(sendOtpApi.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      builder.addCase(sendOtpApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
      // verify otp
      builder.addCase(verifyOtpApi.pending, (state) => {
        state.isLoading = true;
      })
      builder.addCase(verifyOtpApi.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      builder.addCase(verifyOtpApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
      // reset password api
      builder.addCase(resetPasswordApi.pending, (state) => {
        state.isLoading = true;
      })
      builder.addCase(resetPasswordApi.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      builder.addCase(resetPasswordApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default AuthSlice.reducer;
