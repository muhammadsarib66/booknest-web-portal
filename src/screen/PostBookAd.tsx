
// export default PostBookAd;
import { useState, useRef } from "react";
import PrimaryInput from "../components/PrimaryInput";
import MyButton from "../components/MyButton";
import { addImageIcon } from "../assets/icons";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AddBookApi } from "../redux/slices/BookSlice/BookSlicer";
import Loader from "../components/Loader";

// Define validation schema
const bookAdSchema = z.object({
  bookName: z.string()
    .min(1, "Book name is required")
    .min(2, "Book name must be at least 2 characters")
    .max(100, "Book name must be less than 100 characters"),
  publishedYear: z.number({
    required_error: "Published year is required",
    invalid_type_error: "Must be a valid year"
  }).min(1800, "Year must be after 1800")
    .max(new Date().getFullYear(), "Year can't be in the future"),
  genre: z.enum(['Fiction', 'Non-Fiction', 'Mystery', 'Science', 'Biography', 'others'], {
    errorMap: () => ({ message: "Please select a valid genre" })
  }),
  author: z.string()
    .min(1, "Author name is required")
    .min(2, "Author name must be at least 2 characters")
    .max(100, "Author name must be less than 100 characters"),
  condition: z.enum(["New", 'Used'], {
    errorMap: () => ({ message: "Please select a valid condition" })
  }),
  description: z.string()
    .min(1, "Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters"),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Must be a valid number"
  }).min(0, "Price can't be negative")
    .max(1000000, "Price seems too high"),
  websiteUrl: z.string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  images: z.array(z.any())
    .refine(images => images.filter(img => img !== null).length >= 1, {
      message: "At least one image is required"
    })
    .refine(images => images.filter(img => img !== null).length <= 4, {
      message: "Maximum 4 images allowed"
    })
});

const PostBookAd = () => {
  const dispatch = useDispatch();
  const {isLoading} = useSelector((state:any)=>state.BookSlicer) 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const GenreTypes = ['Fiction', 'Non-Fiction', 'Mystery', 'Science', 'Biography', 'others'] as const;
  const ConditionTypes = ["New", "Used"] as const;

  const [formData, setFormData] = useState({
    bookName: "",
    publishedYear: "",
    genre: GenreTypes[0],
    author: "",
    condition: ConditionTypes[0],
    description: "",
    price: "",
    websiteUrl: "",
    images: [null, null, null, null] as (File | null)[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedSlot !== null) {
      // Store the actual file object
      const newImages = [...formData.images];
      newImages[selectedSlot] = file;
      setFormData({ ...formData, images: newImages });
      
      if (errors.images) {
        setErrors({ ...errors, images: "" });
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate data first
      const validatedData = bookAdSchema.parse({
        ...formData,
        publishedYear: Number(formData.publishedYear),
        price: Number(formData.price),
      });

      console.log("Validated form data:", validatedData);

      // Create FormData object for multipart/form-data
      // const formDataToSend = new FormData();

      // Append all text fields to FormData
      // Object.entries(validatedData).forEach(([key, value]) => {
      //   if (key !== 'images' && value !== undefined && value !== null) {
      //     formDataToSend.append(key, String(value));
      //   }
      // });

      // Append only non-null images
    
      // formDataToSend.append("websiteUrl" , validatedData.websiteUrl)

      // Dispatch the API action with FormData
      console.log(validatedData,' validatedData')
      await dispatch(AddBookApi(validatedData) as any).unwrap().then(()=>{
        setFormData({
          bookName: "",
          publishedYear: "",
          genre: GenreTypes[0],
          author: "",
          condition: ConditionTypes[0],
          description: "",
          price: "",
          websiteUrl: "",
          images: [null, null, null, null],
        });
        setErrors({});
      }).catch((err:any)=>{
        console.log(err.message , 'error message')
        }) ;

      // Clear form after successful submission
    

    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(validationErrors);
      } else {
        console.error("Submission error:", error);
      }
    }
  };

  return (
    <div className='min-h-screen flex justify-center py-12'>
      <div className="w-[90%] flex flex-col container mx-auto md:w-[55%] bg-white">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-2">Post Book Ad</h2>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          {/* Book Name and Author */}
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <PrimaryInput
                value={formData.bookName}
                onChange={handleChange}
                name="bookName"
                label="Book Name"
                type="text"
                placeholder="Enter Book Name"
                icon="fa-book"
                error={errors.bookName}
              />
            </div>
            <div className="flex-1">
              <PrimaryInput
                value={formData.author}
                onChange={handleChange}
                name="author"
                label="Author"
                type="text"
                placeholder="Enter Author Name"
                icon="fa-user"
                error={errors.author}
              />
            </div>
          </div>

          {/* Published Year and Genre */}
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <PrimaryInput
                value={formData.publishedYear}
                onChange={handleChange}
                name="publishedYear"
                label="Published Year"
                type="number"
                placeholder="Enter Published Year"
                icon="fa-calendar"
                error={errors.publishedYear}
              />
            </div>
            <div className="flex-1">
              <label className="font-medium block mb-1">Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-bgSecondary text-textSecondary outline-none"
              >
                {GenreTypes.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              {errors.genre && (
                <p className="text-red-500 text-sm">{errors.genre}</p>
              )}
            </div>
          </div>

          {/* Price and Website URL */}
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <PrimaryInput
                value={formData.price}
                onChange={handleChange}
                name="price"
                label="Price"
                type="number"
                placeholder="Enter Price"
                icon="fa-dollar-sign"
                error={errors.price}
              />
            </div>
            <div className="flex-1">
              <PrimaryInput
                value={formData.websiteUrl}
                onChange={handleChange}
                name="websiteUrl"
                label="Website URL"
                type="url"
                placeholder="Enter Website URL"
                icon="fa-link"
                error={errors.websiteUrl}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium block mb-1">Upload Images</label>
            <p className="text-sm text-gray-500">Share Your Book: Upload up to 4 images!</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  onClick={() => handleSlotClick(index)}
                  className="relative h-36 bg-bgSecondary flex flex-col items-center justify-center border border-dashed rounded cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {formData.images[index] ? (
                    <>
                      <img 
                        src={URL.createObjectURL(formData.images[index]!)} 
                        alt={`Book ${index + 1}`} 
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                      >
                        <i className="fas fa-times text-sm"></i>
                      </button>
                    </>
                  ) : (
                    <>
                      <img src={addImageIcon} alt="Upload" className="w-12 h-12 object-cover rounded" />
                      <span className="text-sm text-gray-500 mt-2">Add Image</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Condition Dropdown */}
          <div className="w-full">
            <label className="font-medium block mb-1">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-bgSecondary text-textSecondary outline-none"
            >
              {ConditionTypes.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
            {errors.condition && (
              <p className="text-red-500 text-sm">{errors.condition}</p>
            )}
          </div>

          {/* Description */}
          <div className="w-full">
            <label className="font-medium block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write about your book..."
              className="w-full p-2 border-none bg-bgSecondary rounded h-32 outline-none resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="space-y-3 w-fit">
            <MyButton
              type="submit"
              btnText="Post Book"
              style="bg-bgPrimary py-2 text-lg px-20 py-3 capitalize"
            />
          </div>
        </form>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default PostBookAd;