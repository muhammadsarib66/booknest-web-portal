/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getConfig, getConfigFormData } from "../Slicer";
import toast from "react-hot-toast";
import {
  Book_Status_Active_Pause,
  Book_Status_Sold,
  Delete_My_Book,
  Get_All_Books,
  Get_My_Books,
  Get_Requested_Book,
  Get_Search_Books,
  Get_Selected_Book,
  Post_Book,
  Requested_Book_Action,
  Send_Book_Request,
  Update_Book,
} from "../../../utils/api";
import { handleApiError } from "../../../utils/errorHandler";

export const GetMyBooksApi = createAsyncThunk(
  "books/getmybooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(Get_My_Books, getConfig());
      console.log(response?.data, "My Books");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// geting My books //
export const GetAllBooksApi = createAsyncThunk(
  "books/getallbooks",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Get_All_Books}?page=${page}`, getConfig());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// geting All books //
export const AddBookApi = createAsyncThunk(
  "books/addBook",
  async (bookData: any, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", bookData?.bookName);
      formData.append("author", bookData?.author);
      formData.append("description", bookData?.description);
      formData.append("year", bookData?.publishedYear);
      formData.append("genre", bookData?.genre);
      formData.append("condition", bookData?.condition);
      bookData.images.forEach((image: any) => {
        if (image) {
          formData.append("images", image);
        }
      });
      formData.append("websiteUrl", bookData?.websiteUrl);
      formData.append("price", bookData?.price);
      const response = await axios.post(
        Post_Book,
        formData,
        getConfigFormData()
      );
      toast.success(response?.data?.message || "Profile updated successfully");
      dispatch(GetMyBooksApi());
      console.log(response?.data);
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// update Book //
export const UpdateBookApi = createAsyncThunk(
  "books/updateBook",
  async (bookData: any, { dispatch, rejectWithValue }) => {
    console.log(bookData, "bookData api mai arha");
    try {
      const formData = new FormData();
      formData.append("title", bookData?.title);
      formData.append("author", bookData?.author);
      formData.append("description", bookData?.description);
      formData.append("year", bookData?.year);
      formData.append("genre", bookData?.genre);
      formData.append("condition", bookData?.condition);
      bookData.images.forEach((image: any) => {
        if (image) {
          formData.append("images", image);
        }
      });
      formData.append("websiteUrl", bookData?.websiteUrl);
      formData.append("price", bookData?.price);
      const response = await axios.put(
        `${Update_Book}/${bookData?.id}`,
        formData,
        getConfigFormData()
      );
      toast.success(response?.data?.message || "Book updated successfully");
      dispatch(GetMyBooksApi());
      console.log(response?.data);
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// update Book Status active pause //
export const TogglePauseActiveBookApi = createAsyncThunk(
  "books/togglePauseActiveBook",
  async (updatedBookStatus: any, { dispatch, rejectWithValue }) => {
    console.log(updatedBookStatus, "updatedBookStatus api mai arha");
    try {
      const response = await axios.put(
        `${Book_Status_Active_Pause}/${updatedBookStatus?.id}`,
        { isActive: updatedBookStatus?.status },
        getConfig()
      );
      toast.success(response?.data?.message || "Book updated successfully");
      dispatch(GetMyBooksApi());
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// geting selected book //
export const getSelectedBookApi = createAsyncThunk(
  "books/selectedBook",
  async (BookId: any, { rejectWithValue }) => {
    console.log(BookId, "BookId api mai arha");
    try {
      const response = await axios.get(
        `${Get_Selected_Book}/${BookId}`,
        getConfig()
      );
      console.log(response?.data, "selected book data");
      return response?.data;
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// mark book sold api //
export const MarkBookSoldApi = createAsyncThunk(
  "books/markBookSold",
  async (bookId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${Book_Status_Sold}/${bookId}`,
        {},
        getConfig()
      );
      toast.success(
        response?.data?.message || "Book marked as sold successfully"
      );
      dispatch(GetMyBooksApi());
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// delete book api //
export const DeleteBookApi = createAsyncThunk(
  "books/DeleteBook",
  async (bookId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${Delete_My_Book}/${bookId}`,
        getConfig()
      );
      toast.success(response?.data?.message || "Book Delete successfully");
      dispatch(GetMyBooksApi());
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// search book api //
export const GetSearchedBookApi = createAsyncThunk(
  "books/getsearchbooks",
  async (param: { title: string; genre: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${Get_Search_Books}?title=${param.title}&genre=${param.genre}`,
        getConfig()
      );
      return response.data || []; // Ensure we return the books array
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// send book request api //
export const sendBookRequestApi = createAsyncThunk(
  "books/sendBookRequest",
  async (requestData: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Send_Book_Request}/${requestData?.bookId}`,
        { amount: requestData?.amount },
        getConfig()
      );
      toast.success(
        response?.data?.message || "Book request sent successfully"
      );
      dispatch(getSelectedBookApi(requestData?.bookId) as any);
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// geting request book api //
export const GetRequestBooksApi = createAsyncThunk(
  "books/getReqbooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(Get_Requested_Book, getConfig());
      console.log(response?.data, "Requests Books");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
// handle Book Request 

export const HandleBookRequestApi = createAsyncThunk(
  "books/bookrequest",
  async (bookRequestData: any, { dispatch, rejectWithValue }) => {
    console.log(bookRequestData, "bookRequestData api mai arha");
    try {
      const response = await axios.post(
        Requested_Book_Action,
        bookRequestData,
        getConfig()
      );
      toast.success(response?.data?.message );
      dispatch(GetRequestBooksApi());
      return { responseData: response?.data };
    } catch (err: any) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
const initialState = {
  isLoading: false,
  isError: false,
  getMyBooksList: [],
  getAllBooksList: [],
  getWishListedBooks: [],
  searchBooks: [],
  searchLoading: false,
  RequestBooksList: [],
  selectedBook: {},
  SelectedMoreBooks: [],
  sellerID :''
};

const BookSlicer = createSlice({
  name: "bookSlice",
  initialState,
  reducers: {
    setSellerId: (state, action) => {
      state.sellerID = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddBookApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddBookApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(AddBookApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // Get my books
      .addCase(GetMyBooksApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetMyBooksApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getMyBooksList = action.payload;
      })
      .addCase(GetMyBooksApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // update Book //
      .addCase(UpdateBookApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UpdateBookApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(UpdateBookApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // update Book Status active pause
      .addCase(TogglePauseActiveBookApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(TogglePauseActiveBookApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(TogglePauseActiveBookApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // sold api status
      .addCase(MarkBookSoldApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(MarkBookSoldApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(MarkBookSoldApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // delete book api
      .addCase(DeleteBookApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DeleteBookApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(DeleteBookApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // search bBook api
      .addCase(GetSearchedBookApi.pending, (state) => {
        state.searchLoading = true;
        state.searchBooks = [];
      })
      .addCase(GetSearchedBookApi.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchBooks = action.payload;
      })
      .addCase(GetSearchedBookApi.rejected, (state) => {
        state.searchLoading = false;
        state.searchBooks = [];
      })
      // Request Book Api
      .addCase(GetRequestBooksApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetRequestBooksApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.RequestBooksList = action.payload;
      })
      .addCase(GetRequestBooksApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // get selected book
      .addCase(getSelectedBookApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSelectedBookApi.fulfilled, (state, action) => {
        state.isLoading = false;
        const { moreBooks, selected } = action?.payload;
        // console.log(action?.payload, 'selected book data')
        state.selectedBook = selected;
        state.SelectedMoreBooks = moreBooks;
      })
      .addCase(getSelectedBookApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // send book request
      .addCase(sendBookRequestApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendBookRequestApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendBookRequestApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // get all books
      .addCase(GetAllBooksApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAllBooksApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getAllBooksList = action.payload;
      })
      .addCase(GetAllBooksApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // handle book request
      .addCase(HandleBookRequestApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(HandleBookRequestApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(HandleBookRequestApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export const { setSellerId } = BookSlicer.actions;
export default BookSlicer.reducer;
