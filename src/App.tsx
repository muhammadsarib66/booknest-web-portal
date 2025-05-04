import SignUpForm from './screen/auth/SignUpForm'
import { Route, Routes } from 'react-router-dom';
import Login from './screen/auth/Login';
import ResetPass from './screen/auth/ResetPass';
import VerifyOtp from './screen/auth/VerifyOtp';
import SetNewPassword from './screen/auth/SetNewPassword';
import Home from './screen/Home/Home';
import ScrollToTop from './components/ScrollToTop';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserDetailApi } from './redux/slices/GetUserDetailSlice';
import { socket } from './redux/slices/Slicer';
import notificationsound from "./assets/notificationsound.mp3";
import toast from 'react-hot-toast';
import { GetNotificationsApi } from './redux/slices/NotificationSlice';

const App = () => {
  // const {isRole} = useSelector((state:any) => state.Slicer);
  const dispatch = useDispatch();
  const token = localStorage.getItem("NBUserToken");
  const {  userDetail } = useSelector((state: any) => state.GetUserDetailSlice);
const notiSound = new Audio(notificationsound);
  // console.log(token,isRole,"-------------",userDetail);

  useEffect(()=>{
    if(token) {
      dispatch(getUserDetailApi() as any)
      dispatch(GetNotificationsApi() as any)
    }
  },[dispatch])

  useEffect(()=>{
      if(token){
        socket.emit('join_room',{userId: userDetail?._id})
      }

      socket.on('receive_notification', (data: any) => {
        console.log(data, "notification data");
          notiSound.play();
          let userName = (data?.sender?._id == userDetail?._id) ? data?.receiver?.firstname : data?.sender?.firstname;
        console.log(userName, "userName");
          toast.success(`${data?.message} from ${userName         }`, )
        
      }
      );
      return()=>{
        socket.off('receive_notification');
      }
  },[userDetail])
  return (
    <>
      <ScrollToTop />
    
    <Routes>
      {/* Public Routes */}
      {!token && (
        <>
          <Route path="*" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/reset-password" element={<ResetPass />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
        </>
      )}
      {token && (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Home />} />
        </>
      )}
    </Routes>
    </>

  )
}

export default App