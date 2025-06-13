import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

// export const baseUrl = "http://192.168.100.110:3000/";
export const baseUrl = "https://booknestbackend-production.up.railway.app/";
// export const baseUrl = "http://192.168.100.19:3000/";
// export const baseUrl = "https://awake-smile-production.up.railway.app/";
// export const baseUrl = "https://book-nest-backend-mu.vercel.app/";

// uservu@yopmail.com user 
// pass : Sarib123@
export const socket =  io(baseUrl)

export const getConfig = () => ({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("NBUserToken")}`,
  },
});

export const  getConfigFormData = () => ({
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("NBUserToken")}`,
  },
});

// admin@dbweb.com pass : 263122
const initialState = {
  isLoading: false,
  isError: false,
  isRole : "user"
 
};

const Slicer = createSlice({
  name: "slicer",

  initialState,
  reducers: {
   
  },
});
// export const {} = Slicer.actions;
export default Slicer.reducer;
