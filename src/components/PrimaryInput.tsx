import { useState } from "react";

const PrimaryInput = ({
  type,
  placeholder,
  icon,
  style,
  value,
  onChange,
  name,
  label,
  isRequired,
  error ,
  disabled
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1 ">
      <label className="font-semibold text-sm">
        {label} {isRequired && <span className="text-red-700">*</span>}
      </label>

      <div
        className={`flex items-center  p-2 rounded-md text-textSecondary bg-bgSecondary w-full ${style}`}
      >
        <i className={`fas ${icon} text-gray-500 mr-2`}></i>
        <input
          onChange={onChange}
          value={value}
          name={name}
        disabled={disabled}

          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          className="outline-none w-full bg-transparent placeholder:text-sm"
        />
        {type === "password" && (
          <i
            className={`fas ${
              showPassword ? "fa-eye-slash" : "fa-eye"
            } text-gray-500 cursor-pointer`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        )}
      </div>
      {error && <small className="ml-1 -mt-1 text-xs text-errorText">{error}</small>}
    </div>
  );
};

export default PrimaryInput;
