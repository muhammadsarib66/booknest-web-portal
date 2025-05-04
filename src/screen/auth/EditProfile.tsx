import React, { useEffect, useRef, useState } from 'react'
import PrimaryInput from '../../components/PrimaryInput'
import MyButton from '../../components/MyButton';
import { Avatar } from '@material-tailwind/react';
// import { userImg } from '../../assets/icons';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { ChangePassApi, updateUserProfileApi } from '../../redux/slices/UpdateProfileSlice';
import {  z } from 'zod';
import { getUserDetailApi } from '../../redux/slices/GetUserDetailSlice';
import { CgArrowLongRight } from 'react-icons/cg';
import { baseUrl } from '../../redux/slices/Slicer';
import { userImg2 } from '../../assets/icons';

// Define validation schemas
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
});

const passwordSchema = z.object({
  oldpassword: z.string().min(1, "Current password is required"),
  newpassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).superRefine((data, ctx) => {
  if (data.newpassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });
  }
});

const EditProfile = () => {
  const dispatch = useDispatch();
  const { isLoading, userDetail } = useSelector((state: any) => state.GetUserDetailSlice);
  const { isLoading: updateLoading } = useSelector((state: any) => state.UpdateProfileSlice);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [profile, setProfile] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    oldpassword: "",
    newpassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.match('image.*')) {
        setProfilePic(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      // Validate the form data
      profileSchema.parse({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      });
      
      // Clear any existing errors
      setErrors({});

      // Prepare form data to include image if selected
      const formData = new FormData();
      
      if (profile.firstName !== userDetail?.firstname) {
        formData.append('firstname', profile.firstName);
      }
      if (profile.lastName !== userDetail?.lastname) {
        formData.append('lastname', profile.lastName);
      }
      if (profile.phone !== userDetail?.phoneno) {
        formData.append('phoneno', profile.phone);
      }
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      // Only proceed if there are changes
      if (formData.entries().next().done && !profilePic) {
        console.log("No changes detected");
        return;
      }
      
      console.log("Updating profile with:", formData);
      await dispatch(updateUserProfileApi(formData) as any);
      
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

  const handleUpdatePassword = async () => {
    try {
      // Validate the form data
      passwordSchema.parse({
        oldpassword: profile.oldpassword,
        newpassword: profile.newpassword,
        confirmPassword: profile.confirmPassword,
      });
      
      // Clear any existing errors
      setErrors({});

      // Prepare the data to send to the API
      const updateData = {
        oldPassword: profile.oldpassword,
        newPassword: profile.newpassword,
      };

      console.log("Updating password with:", updateData);
      await dispatch(ChangePassApi(updateData) as any);
      
      // Reset password fields after successful update
      setProfile({
        ...profile,
        oldpassword: "",
        newpassword: "",
        confirmPassword: "",
      });
      setShowPasswordFields(false);
    }
    catch (error) {
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

  useEffect(() => {
    dispatch(getUserDetailApi() as any);
  }, [dispatch]);

  useEffect(() => {
    if (userDetail) {
      setProfile({
        firstName: userDetail?.firstname || "",
        lastName: userDetail?.lastname || "",
        email: userDetail?.email || "",
        phone: userDetail?.phoneno || "",
        oldpassword: "",
        newpassword: "",
        confirmPassword: "",
      });
    }
  }, [userDetail]);

  const getAvatarSrc = () => {
    if (previewImage) return previewImage;
    if (userDetail?.profileimage) return baseUrl + userDetail.profileimage;
    return userImg2;
  };

  return (
    <div className='min-h-screen flex justify-center py-12'>
      <div className="w-[90%] flex flex-col container mx-auto md:w-[55%] bg-white">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-2">
            Edit Your Profile
          </h2>
        </div>
        
        {/* Profile Image Section */}
        <div className='relative w-fit'>
          <Avatar
            onPointerLeaveCapture={''}
            onPointerEnterCapture={''}
            placeholder={''}
            className='border-2 border-bgPrimary object-cover' 
            size="xxl" 
            src={getAvatarSrc()} 
          />
          <div 
            onClick={triggerFileInput} 
            className='absolute bottom-0 -right-2 w-10 border shadow-sm cursor-pointer h-10 flex items-center justify-center bg-white rounded-full p-2'
          >
            <i className='fa-solid fa-camera text-black text-2xl cursor-pointer'></i>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Profile Information Form */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <PrimaryInput
                value={profile.firstName}
                onChange={handleChange}
                name="firstName"
                label="First Name"
                type="text"
                placeholder="Enter your First Name"
                icon="fa-user"
                error={errors.firstName}
              />
            </div>
            <div className="flex-1">
              <PrimaryInput
                value={profile.lastName}
                onChange={handleChange}
                name="lastName"
                label="Last Name"
                type="text"
                placeholder="Enter your last Name"
                icon="fa-user"
                error={errors.lastName}
              />
            </div>
          </div>
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <PrimaryInput
                value={profile.email}
                name="email"
                disabled={true}
                label="Email"
                type="email"
                placeholder="Enter your email"
                icon="fa-envelope"
              />
            </div>
            <div className="flex-1">
              <PrimaryInput
                value={profile.phone}
                onChange={handleChange}
                name="phone"
                label="Phone"
                type="text"
                placeholder="Enter your phone Number"
                icon="fa-phone"
                error={errors.phone}
              />
            </div>
          </div>
          
          <div className="space-y-3 w-fit">
            <MyButton
              onClick={handleSubmit}
              btnText="Save Changes"
              loading={isLoading}
              style="bg-bgPrimary py-2 text-lg px-20 py-3 capitalize"
            />
          </div>
          
          {/* Password Change Section */}
          <div>
            <h2 className="text-lg font-bold mb-2 mt-4">
              Change Password
            </h2>
            {!showPasswordFields ? (
              <button
                onClick={() => setShowPasswordFields(true)}
                className="text-bgPrimary hover:underline flex items-center gap-1"
              >
                Change Password <CgArrowLongRight className="text-xl" />
              </button>
            ) : (
              <div className="space-y-3">
                <PrimaryInput
                  value={profile.oldpassword}
                  onChange={handleChange}
                  name="oldpassword"
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  icon="fa-lock"
                  error={errors.oldpassword}
                />

                <PrimaryInput
                  value={profile.newpassword}
                  onChange={handleChange}
                  name="newpassword"
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  icon="fa-lock"
                  error={errors.newpassword}
                />

                <PrimaryInput
                  value={profile.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password"
                  icon="fa-lock"
                  error={errors.confirmPassword}
                />

                <div className="flex gap-3">
                  <MyButton
                    onClick={handleUpdatePassword}
                    btnText="Update Password"
                    loading={isLoading}
                    style="bg-bgPrimary py-2 text-lg px-8 py-3 capitalize"
                  />
                  <button
                    onClick={() => {
                      setShowPasswordFields(false);
                      setErrors({});
                      setProfile({
                        ...profile,
                        oldpassword: "",
                        newpassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="text-gray-600 hover:text-gray-800 px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isLoading || updateLoading && <Loader />}
    </div>
  )
}

export default EditProfile