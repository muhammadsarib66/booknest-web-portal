import TitleScreen from "./TitleScreen";
import PrimaryInput from "../../components/PrimaryInput";
import MyButton from "../../components/MyButton";
import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { SignUpProfileApi } from "../../redux/slices/AuthSlice";
// import Loader from "../../components/Loader";


const signUpSchema = z.object({
  email: z
  .string()
  .email("Invalid email address")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email address" }), // Basic email validation
  firstname: z.string().nonempty("First name is required"),
  lastname: z.string().nonempty("Last name is required"),
  phoneno: z
    .string()
    .nonempty("Phone number is required")
    .regex(
      /^(03\d{8,10}|\+92\d{9,10})$/,
      "Phone number must start with '03' or '+92' and be 10 to 12 digits long"
    ),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
  address: z.object({
    city: z.string().nonempty("City is required"),
    country: z.string().nonempty("Country is required"),
  }),
  });
export default function Signup() {
const navigate = useNavigate();
const dispatch = useDispatch();
const { isLoading } = useSelector((state: any) => state.AuthSlice);

const [formData, setFormData] = useState({
  firstname: "",
  lastname: "",
  phoneno: "",
  email : "",
  password: "",
  address : {
    city: "",
    country: "",
  }
});
const [errors, setErrors] = useState<any>({});



const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
  const { name, value } = e.target;

  // Check if the field belongs to address
  if (name === "city" || name === "country") {
    setFormData({
      ...formData,
      address: {
        ...formData.address, // Preserve existing address fields
        [name]: value,
      },
    });
  } else {
    setFormData({ ...formData, [name]: value });
  }
  setErrors({ ...errors, [name]: "" });
};


const handleProceed = async () => {
  // console.log(formData , accountTypeData, 'form data')
  try {
 
    signUpSchema.parse(formData);

    try {

      await  dispatch(SignUpProfileApi(formData)).unwrap().then(()=>{
        setFormData({
          firstname: "",
  lastname: "",
  phoneno: "",
  email : "",
  password: "",
  address : {
    city: "",
    country: "",
  }
        })
      }).catch((err:any)=>{
        console.log(err.message , 'error message')
      })

    } catch (err) {
      console.log(err, "err");
    }
    // navigate("/documentsubmission");
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Map Zod errors to state
      const validationErrors = error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(validationErrors);
    }
  }
};


  return (
    <div className="flex flex-col  md:flex-row h-screen md:overflow-hidden">
      {/* Left Image Section */}
      <span className="hidden md:contents">
        <TitleScreen />
      </span>

      {/* Right Form Section */}
      <div className=" flex-1 flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-[90%] overflow-y-auto flex flex-col container mx-auto md:w-[65%] bg-white ">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold mb-2">
              Create Account For{" "}
              <span className="text-bgPrimary">BookNest </span>
            </h2>
            <p className="text-gray-400 text-lg font-semibold mb-6">
              Sign up to Exchange your Books with the world
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className=" flex  w-full gap-4">
              <div className="flex-1">
                <PrimaryInput
                  isRequired={true}
                  label="First Name"
                  name="firstname"
                  value={formData?.firstname}
                  onChange={handleInputChange}
                  error={errors.firstname}
                  placeholder={"Enter your First Name"}
                  type="text"
                  icon="fa-user"
                />
              </div>
              <div className="flex-1">
                <PrimaryInput
                  isRequired={true}
                  label={"Last Name"}
                  onChange={handleInputChange}
                  value={formData?.lastname}
                  error={errors.lastname}
                  name="lastname"
                  type="text"
                  placeholder={"Enter your last Name"}
                  icon="fa-user"
                />
              </div>
            </div>
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
                label="Phone"
                onChange={handleInputChange}
                value={formData?.phoneno}
                error={errors.phoneno}
                name="phoneno"
                type="text"
                placeholder={"Enter your phone Number"}
                icon="fa-phone"
              />
 <div className="flex w-full gap-4">
  <div className="flex-1">
    <PrimaryInput
      isRequired={true}
      label="City"
      name="city"
      value={formData?.address?.city}
      onChange={handleInputChange}
      error={errors?.address?.city}  // ✅ FIXED
      placeholder={"Enter your City"}
      type="text"
      icon="fa-city"
    />
  </div>
  <div className="flex-1">
    <PrimaryInput
      isRequired={true}
      label={"Country"}
      onChange={handleInputChange}
      value={formData?.address?.country}
      error={errors?.address?.country} // ✅ FIXED
      name="country"
      type="text"
      placeholder={"Enter your Country"}
      icon="fa-globe"
    />
  </div>
</div>

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
                btnText="Sign Up"
                style="bg-bgPrimary py-2 text-lg capitalize"
              />
              <p className="float-end font-semibold text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 underline">
                  Login
                </Link>
              </p>
            </div>
            </div>

          </div>
        </div>
        {/* {
          isLoading && <Loader />
        } */}
      </div>
  );
}
