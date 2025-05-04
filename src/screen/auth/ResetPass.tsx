import TitleScreen from "./TitleScreen";
import PrimaryInput from "../../components/PrimaryInput";
import MyButton from "../../components/MyButton";
import { useNavigate } from "react-router-dom";
import { backIcon } from "../../assets/icons";
import React, { useState } from "react";
import { sendOtpApi } from "../../redux/slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(/@/, { message: "Email must contain @" }),
});

const ResetPass: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { isLoading } = useSelector((state: any) => state.AuthSlice);

  const handleSendOtp = async () => {
    try {
      // Validate email before sending OTP
      emailSchema.parse({ email });
      
      const response = await dispatch(sendOtpApi(email) as any);
      if (response?.payload?.message === 'OTP sent successfully') { 
        localStorage.setItem('otpEmail', email);
        navigate('/verify-otp');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        console.log(error);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(''); // Clear error when input changes
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
          <div className="">
            <button
              onClick={() => navigate(-1)} // 👈 Go back to previous page
              className=" rounded-full border-2 hover:bg-gray-200 transition"
            >
              <img src={backIcon} alt="Back" className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold ">Forgot Password</h2>
            <p className="text-gray-400 text-lg font-semibold mb-6">
              Enter your Email to reset Password
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
          <PrimaryInput
    label="Email"
    isRequired={true}
    type="email"
    placeholder={"Enter your phone email"}
    icon="fa-envelope"
    value={email}
    onChange={handleEmailChange}
    error={error}
  />

            <div className="space-y-3">
              <MyButton
              loading={isLoading}
                disabled={isLoading || email == ''}
                onClick={handleSendOtp}
                btnText="Send OTP"
                style="bg-bgPrimary py-3  text-lg capitalize"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
