import { configureStore } from "@reduxjs/toolkit";
import Slicer from "./slices/Slicer";
import AuthSlice from "./slices/AuthSlice"
import GetUserDetailSlice from "./slices/GetUserDetailSlice"
import UpdateProfileSlice from "./slices/UpdateProfileSlice"
import BookSlicer from "./slices/BookSlice/BookSlicer"
import WishListSlice from "./slices/WishListSlice";
import NotificationSlice from "./slices/NotificationSlice";
export const store = configureStore({
    reducer: {
        Slicer,
        AuthSlice,
        GetUserDetailSlice,
        UpdateProfileSlice,
        BookSlicer,
        WishListSlice,
        NotificationSlice
    }
});
