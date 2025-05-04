import { useNavigate } from "react-router-dom";
import { verifyIcon } from "../assets/icons";

const ConfirmPassModal = ({ open, onClose }:any) => {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white w-[420px] rounded-lg p-5 shadow-lg text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-3">
          <img src={verifyIcon} className="h-24 w-24" alt="" />

        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold mb-2">Password Successfully Changed</h2>

        {/* Button */}
        
        <button
          onClick={()=>{
            onClose()
            navigate('/login')
          }}
          className="mt-4 w-full bg-bgPrimary text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
          Back To Login
        </button>
      </div>
    </div>
  );
};

export default ConfirmPassModal;
