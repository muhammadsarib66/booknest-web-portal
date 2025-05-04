import { baseUrl } from "../redux/slices/Slicer";

export const Sign_Up_Api =  `${baseUrl}booknest/users/register`  // DONE
export const Send_Ver_Email_Api =  `${baseUrl}booknest/users/sendvarification`  // DONE
export const Login_Api =  `${baseUrl}booknest/users/login`  // DONE
export const send_Otp =  `${baseUrl}booknest/users/sendotp`  // DONE
export const verify_Otp =  `${baseUrl}booknest/users/verifyotp`  // DONE
export const reset_Password =  `${baseUrl}booknest/users/resetpassword`  // DONE
export const User_Profile_Detail = `${baseUrl}booknest/users/getuser` // DONE
export const Update_User_Profile = `${baseUrl}booknest/users/update-profile` // DONE
export const Change_Pass_Api = `${baseUrl}booknest/users/change-password` // DONE
export const Upload_User_Profile = `${baseUrl}booknest/users/update-profile` // DONE

// Book Routes
export const Add_Wishlist_Book = `${baseUrl}booknest/books/addwishlist` // REMAINING SLicer Ready
export const Get_Wishlist_Books = `${baseUrl}booknest/books/getwishlist` // REMAINING SLicer Ready
export const Post_Book = `${baseUrl}booknest/books/addbook/` // DONE
export const Update_Book = `${baseUrl}booknest/books/updatebook` // DONE
export const Get_My_Books = `${baseUrl}booknest/books/getmybooks` // DONE
export const Get_All_Books = `${baseUrl}booknest/books/getbooks` // DONE
export const Get_Search_Books = `${baseUrl}booknest/books/searchbook` // DONE
export const Get_Selected_Book = `${baseUrl}booknest/books/selectedBook` // DONE
export const Get_Requested_Book = `${baseUrl}booknest/books/getrequests` // DONE
export const Requested_Book_Action = `${baseUrl}booknest/books/handlerequest` // DONE

export const Book_Status_Sold = `${baseUrl}booknest/books/markassold` // DONE
export const Book_Status_Active_Pause = `${baseUrl}booknest/books/toggleactive` // DONE
export const Delete_My_Book = `${baseUrl}booknest/books/deletebook` // Remaining
export const Send_Book_Request = `${baseUrl}booknest/books/requestbid` // Remaining
export const Notifications_Api = `${baseUrl}booknest/books/notifications/` // Remaining

// export const Create_Wallet_Api = `${baseUrl}booknest/wallet/createwallet` // REMAINING SLicer Ready