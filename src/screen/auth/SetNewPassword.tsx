import { useState } from "react";
import TitleScreen from "./TitleScreen";
import PrimaryInput from "../../components/PrimaryInput";
import MyButton from "../../components/MyButton";
import ConfirmPassModal from "../../components/ConfirmPassModal";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordApi } from "../../redux/slices/AuthSlice";
import toast from "react-hot-toast";


interface PasswordsState {
  password: string;
  confirmPassword: string;
}
const SetNewPassword = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const dispatch = useDispatch()
  const { isLoading } = useSelector((state: any) => state.AuthSlice);

  const email =  localStorage.getItem('otpEmail');

  const [passwords, setPasswords] = useState<PasswordsState>({ password: "", confirmPassword: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = async () => {
    if (passwords.password !== passwords.confirmPassword) {
      // alert("Passwords do match");
      console.log('password Not match')
      toast.error('password Not match');
      return;
    }
    try {
      const response = await dispatch(resetPasswordApi({ email, newPassword: passwords.confirmPassword }) as any);
    
      if (response?.payload?.message === 'Password reset successfully') {
        localStorage.removeItem('otpEmail');
        setOpenDialog(true)
      } else {
      }
    } catch (err: any) {
      console.error('Error resetting password:', err);
    }
  };

  return (
    <div className="flex flex-col  md:flex-row h-screen md:overflow-hidden">
      {/* Left Image Section */}
      <span className="hidden md:contents">
        <TitleScreen />
      </span>

      {/* Right Form Section */}
      <div className=" flex-1 relative flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-[90%]  flex flex-col container mx-auto md:w-[65%] bg-white ">
       
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold ">Set New Password</h2>
            <p className="text-gray-400 text-lg font-semibold mb-6">
              Create a strong password
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
           
          <PrimaryInput
  isRequired={true}
                label="Password"
type="password"
                placeholder={"Enter password"}
                icon="fa-lock"
                name="password"
                value={passwords.password}
                onChange={handleChange}
              />


              <PrimaryInput
  isRequired={true}
                label="Confirm Password"
                type="password"
                placeholder={"Enter password"}
                icon="fa-lock"
                name="confirmPassword"
                value={passwords.confirmPassword}
        onChange={handleChange}
              />

            <div className="space-y-3">
              <MyButton
              onClick={handleResetPassword}
                btnText="Change Password"
                style="bg-bgPrimary py-3  text-lg capitalize"
                loading={isLoading}
              />
            </div>
          </div>
        </div>
        <ConfirmPassModal open={openDialog} onClose={() => setOpenDialog(false)} />
      
      </div>
    </div>
  );
};

export default SetNewPassword;
