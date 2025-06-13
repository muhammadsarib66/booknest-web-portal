/* eslint-disable @typescript-eslint/no-explicit-any */
import TitleScreen from "./TitleScreen";
import PrimaryInput from "../../components/PrimaryInput";
import MyButton from "../../components/MyButton";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { LoginApi, SendVerEmailApi } from "../../redux/slices/AuthSlice";
import toast from "react-hot-toast";

const signUpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(/@/, { message: "Email must contain @" }),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: any) => state.AuthSlice);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleProceed = async () => {
    try {
      signUpSchema.parse(formData);
      
      try {
        await dispatch(LoginApi(formData)).unwrap().then((result: any) => {
          console.log(result?.responseData?.user?.isadmin);
          if (result?.responseData.user?.isadmin == true) {
            console.log(result?.responseData.user?.isadmin);
            toast.error("You are not authorized to access this application");
          } else if (result?.responseData?.user?.isadmin == false) {
            window.location.reload();
            navigate("/");
          }
        }).catch((error: any) => {
          console.log(error?.message, "error");
        });
      } catch (error: any) {
        console.log(error?.message || 'error');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(validationErrors as any);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Image Section - Hidden on mobile, visible on large screens */}
        <div className="hidden lg:flex lg:w-1/2">
          <TitleScreen />
        </div>

        {/* Right Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile Logo Section - Only visible on mobile */}
            <div className="lg:hidden text-center mb-8">
              <h2 className="text-4xl font-bold text-bgPrimary mb-2">BookNest</h2>
              <div className="w-20 h-1 bg-bgPrimary mx-auto rounded-full"></div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-500 text-sm sm:text-base">
                  Log in to share your Books with the world
                </p>
              </div>

              <div className="space-y-6">
                <PrimaryInput
                  label="Email"
                  isRequired={true}
                  onChange={handleInputChange}
                  value={formData?.email}
                  error={errors.email}
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  icon="fa-envelope"
                />

                <PrimaryInput
                  isRequired={true}
                  label="Password"
                  onChange={handleInputChange}
                  value={formData?.password}
                  error={errors.password}
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  icon="fa-lock"
                />

                <div className="space-y-4">
                  <MyButton
                    disabled={isLoading}
                    loading={isLoading}
                    onClick={handleProceed}
                    btnText={isLoading ? "Signing In..." : "Sign In"}
                    style="bg-gradient-to-r from-bgPrimary to-blue-600 hover:from-blue-600 hover:to-bgPrimary py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  />

                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 text-sm">
                    <button
                      onClick={() => {
                        if (formData.email) {
                          dispatch(SendVerEmailApi(formData?.email));
                        }
                      }}
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 underline decoration-2 underline-offset-2"
                    >
                      Send Verification Link
                    </button>
                    <Link
                      to="/reset-password"
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 underline decoration-2 underline-offset-2"
                    >
                      Forget Password?
                    </Link>
                  </div>
                </div>

                <div className="flex items-center my-6">
                  <hr className="flex-grow border-gray-300" />
                  <span className="mx-4 text-gray-500 font-medium">OR</span>
                  <hr className="flex-grow border-gray-300" />
                </div>

                <div className="text-center">
                  <p className="text-gray-600 font-medium">
                    Don't have an Account?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-2 underline-offset-2 transition-colors duration-200"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer for mobile */}
            <div className="lg:hidden text-center mt-8 text-xs text-gray-500">
              © 2024 BookNest. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;