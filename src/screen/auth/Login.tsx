import TitleScreen from "./TitleScreen";
import PrimaryInput from "../../components/PrimaryInput";
import MyButton from "../../components/MyButton";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { LoginApi, SendVerEmailApi } from "../../redux/slices/AuthSlice";
const signUpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(/@/, { message: "Email must contain @" }), // Ensure email contains @

    password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
  });
 const Login = () =>  {
  const dispatch = useDispatch()
   const navigate = useNavigate()
   const {isLoading} = useSelector((state: any) => state.AuthSlice);
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
    setErrors({ ...errors, [name]: "" }); // Clear error for the field being updated
  };

  const handleProceed = async () => {
    try {
      signUpSchema.parse(formData);
      
      try {
        const result = await dispatch(LoginApi(formData)).unwrap();
          if(result) {
            navigate("/")
            window.location.reload()
          }
       
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
  // const handleLogin = ()=>{
  //   console.log('click')
  //   localStorage.setItem("token","123456")  
  //   window.location.href = "/"
  //   window.location.reload()
  // }
  return (
    <div className="flex flex-col  md:flex-row h-screen md:overflow-hidden">
      {/* Left Image Section */}
      <span className="hidden md:contents">
      <TitleScreen />
      </span>

      {/* Right Form Section */}
      <div className=" flex-1 flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-[90%] flex flex-col container mx-auto md:w-[65%] bg-white ">
            <div className="flex flex-col gap-2">
            <h2 className=" text-3xl font-bold text-bgPrimary">BookNest </h2>
          <h2 className="text-3xl font-bold ">
            Welcome Back 
          </h2>
          <p className="text-gray-400 text-lg font-semibold mb-6">
          Log in to share your Books with the world
          </p>
          </div>

          <div className="w-full flex flex-col gap-3">
          
          <PrimaryInput
              label={"Email"}
              isRequired={true}
              onChange={handleInputChange}
              value={formData?.email}
              error={errors.email}
              name="email"
              type="email"
                placeholder={"Enter your phone email"}
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
                placeholder={"Enter password"}
                icon="fa-lock"
              />
           
            <div className="space-y-3">
              <MyButton 
               disabled={isLoading}
               loading={isLoading}
                onClick={handleProceed}
              btnText={isLoading ? "Loading..." :"Login"}  style="bg-bgPrimary py-3  text-lg capitalize" />
              <div className="flex justify-between w-full items-center">

            <p 
              onClick={()=>{
                if(formData.email){
                  dispatch(SendVerEmailApi(formData?.email))
              }}
              }
            className=" font-semibold text-sm text-blue-500 cursor-pointer underline">
              Send Verification Link
            </p>
            <p className=" font-semibold text-sm">
              <Link to="/reset-password" className="text-blue-500 ">
              Forget Password?
              </Link>
            </p>
            </div>

            </div>
            <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <p className="text-center font-semibold text-sm">
              Don't have an Account ?{" "}
              <Link to="/signup" className="text-blue-500 underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;