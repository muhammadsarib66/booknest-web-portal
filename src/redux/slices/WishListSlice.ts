/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig } from "./Slicer";
import { Add_Wishlist_Book, Get_Wishlist_Books } from "../../utils/api";
import { handleApiError } from "../../utils/errorHandler";
import toast from "react-hot-toast";

// Create the async thunk for fetching user details
export const getUserWishlistApi = createAsyncThunk(
  "user/wishList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(Get_Wishlist_Books, getConfig());
      console.log(response.data, "response.data wishlist");
      return response.data?.wishlistBooks
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
export const AddBookWishlistApi = createAsyncThunk(
  "user/updateProfile",
  async (BookId: any, {dispatch, rejectWithValue }) => {
    console.log(BookId, "BookId")
    try {
      const response = await axios.put(
        `${Add_Wishlist_Book}/${BookId}`,
      {}    ,
        getConfig()
      );
      toast.success(response?.data?.message );
      dispatch(getUserWishlistApi())
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
const initialState = {
  isLoading: false,
  isError: false,
  myWishListBooks: null,
};

// Create the slice
const WishListSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserWishlistApi.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getUserWishlistApi.fulfilled, (state, action) => {
        state.isLoading = false;

        state.myWishListBooks = action.payload;
        state.isError = false;
      })
      .addCase(getUserWishlistApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // Add Book wishlist APi
      .addCase(AddBookWishlistApi.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(AddBookWishlistApi.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(AddBookWishlistApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const {} = WishListSlice.actions;
export default WishListSlice.reducer;
