import { useState, useRef } from "react";
import PrimaryInput from "./PrimaryInput";
import MyButton from "./MyButton";
import { addImageIcon } from "../assets/icons";
import { baseUrl } from "../redux/slices/Slicer";
import { useSelector } from "react-redux";
import Loader from "./Loader";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookData: any;
  onUpdate: (updatedData: any) => void;
}

const EditBookModal = ({ isOpen, onClose, bookData, onUpdate }: EditBookModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading  } = useSelector((state: any) => state?.BookSlicer);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: bookData.title || "",
    description: bookData.description || "",
    price: bookData.price || "",
    genre: bookData.genre || "",
    condition: bookData.condition || "New",
    year: bookData.year || "",
    images: bookData.images || [null, null, null, null],
    id : bookData._id || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedSlot !== null) {
      const newImages = [...formData.images];
      newImages[selectedSlot] = file;
      setFormData({ ...formData, images: newImages });
    }
  };

  const handleSlotClick = (index: number) => {
    setSelectedSlot(index);
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData({ ...formData, images: newImages });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Book</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <PrimaryInput
              value={formData.title}
              onChange={handleChange}
              name="title"
              label="Book Title"
              type="text"
              placeholder="Enter Book Title"
              icon="fa-book"
            />
            <PrimaryInput
              value={formData.price}
              onChange={handleChange}
              name="price"
              label="Price"
              type="number"
              placeholder="Enter Price"
              icon="fa-dollar-sign"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PrimaryInput
              value={formData.year}
              onChange={handleChange}
              name="year"
              label="Published Year"
              type="number"
              placeholder="Enter Year"
              icon="fa-calendar"
            />
            <PrimaryInput
              value={formData.genre}
              onChange={handleChange}
              name="genre"
              label="Genre"
              type="text"
              placeholder="Enter Genre"
              icon="fa-bookmark"
            />
          </div>

          <div className="w-full">
            <label className="font-medium block mb-1">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-bgSecondary text-textSecondary outline-none"
            >
              {["New", 'Used'].map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="font-medium block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write about your book..."
              className="w-full p-2 border-none bg-bgSecondary rounded h-32 outline-none resize-none"
            />
          </div>

          <div className="w-full">
            <label className="font-medium block mb-1">Images</label>
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  onClick={() => handleSlotClick(index)}
                  className="relative h-24 bg-bgSecondary flex flex-col items-center justify-center border border-dashed rounded cursor-pointer"
                >
                  {formData.images[index] ? (
                    <>
                      <img
                        src={typeof formData.images[index] === 'string' ? baseUrl+ formData.images[index] : URL.createObjectURL(formData.images[index])}
                        alt={`Book ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <img src={addImageIcon} alt="Add" className="w-8 h-8" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="flex justify-end space-x-3">
            <MyButton
              onClick={onClose}
              btnText="Cancel"
              style="bg-gray-200 text-white px-6 py-2"
            />
            <MyButton
              onClick={() => onUpdate(formData)}
              btnText="Update Book"
              style="bg-bgPrimary text-white px-6 py-2"
            />
          </div>
        </form>
      </div>
      {
        isLoading && <Loader />
      }
    </div>
  );
};

export default EditBookModal;
