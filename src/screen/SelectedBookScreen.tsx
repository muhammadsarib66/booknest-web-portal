import  { useEffect, useState } from 'react';
import { messageIcon } from "../assets/icons";
import { data, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedBookApi, sendBookRequestApi, setSellerId } from '../redux/slices/BookSlice/BookSlicer';
import Loader from '../components/Loader';
import { baseUrl, socket } from '../redux/slices/Slicer';
import { AddBookWishlistApi } from '../redux/slices/WishListSlice';
import Footer from '../components/Footer';

const SelectedBookScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(0);
    const [showContactOptions, setShowContactOptions] = useState(false);
    const {  userDetail } = useSelector((state: any) => state.GetUserDetailSlice);
    
    const {selectedBook, SelectedMoreBooks, isLoading} = useSelector((state:any) => state.BookSlicer)

    const { id } = useParams();
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestAmount, setRequestAmount] = useState('');
console.log(selectedBook, 'selected book')
    const handleBuyNow = () => {
      setShowContactOptions(true);
    };
    
    const redirectToWhatsApp = () => {
      window.open(`https://wa.me/${selectedBook?.user?.phoneno}`, '_blank');
    };
    
    const redirectToCall = () => {
      window.location.href = `tel:${selectedBook?.user?.phoneno}`;
    };
    
    const handleImageChange = (index:any) => {
      setSelectedImage(index);
    };

    const handleMoreBookClick = (bookId: string) => {
      navigate(`/book/${bookId}`);
    };
    const handleHeartClick  = async (bookId: string) => {
      await dispatch(AddBookWishlistApi(bookId) as any).unwrap().then(() => {
        dispatch(getSelectedBookApi(bookId) as any);
      }).catch((err:any)=>{
        console.log(err?.message, 'error')
      });

    }
const handleRequestBook = () => {
  const bookData = {
    bookId: selectedBook._id,
    amount: parseInt(requestAmount)
  }
 
 
  console.log(bookData, 'book data')
  dispatch(sendBookRequestApi( bookData ) as any);
  setShowRequestModal(false);
  setRequestAmount('');
}

const handleStartChat = (sellerID:any)=>{
  // socket.emit('send_message',{
  //   senderId: userDetail?._id,
  //   receiverId: sellerID,
  //   message: 'I am Interested!'
  // })
      console.log(sellerID, 'seller id')
      socket.emit('create_chat_room',{senderId: userDetail?._id,
          receiverId: sellerID} )
          dispatch(setSellerId(sellerID) as any)
      navigate('/communication')
      // socket.emit('get_chat_room_messages', "680c0ac00fc463b8c3ba4bc1")
}

// useEffect(()=>{
//   socket.on('chat_rooms',(data:any)=>{
//     console.log(data, 'chat rooms data')
//   })
//   socket.on('chat_room_messages',(data:any)=>{
//     console.log(data, 'chat room messages')
//   })

//   return ()=>{
//     socket.off('chat_rooms')
//     socket.off('chat_room_messages')
//   }
// },[])

    useEffect(()=>{
      dispatch(getSelectedBookApi(id) as any)
    },[dispatch,id])
   

    if (isLoading) return <Loader />;
    if (!selectedBook || !selectedBook.images) return null;

   
    return (
      <div className="max-w-6xl min-h-screen mx-auto p-4">
        {/* Main Book Detail Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Left side - Images */}
          <div className="w-full md:w-2/5">
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 h-96 relative">
              <img 
                src={baseUrl + (selectedBook.images[selectedImage] || '')} 
                alt={selectedBook.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {selectedBook.images.map((image: string, index: number) => (
                <div 
                  key={index}
                  className={`h-20 cursor-pointer rounded overflow-hidden border-2 ${selectedImage === index ? 'border-purple-600' : 'border-transparent'}`}
                  onClick={() => handleImageChange(index)}
                >
                  <img 
                    src={baseUrl + image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - Book details */}
          <div className="w-full md:w-3/5">
          <div className='flex w-full justify-between'>

            <h1 className="text-2xl font-bold mb-2">{selectedBook?.title}</h1>
              <div>
                {
                  selectedBook?.likes?.includes(userDetail?._id) ?
                  <button 
                  onClick={() => handleHeartClick(selectedBook?._id)}
                  className="text-red-700 hover:text-red-100 transition duration-200 animate-pulse"
                  >
                  <i className="fas fa-heart text-2xl"></i>
                </button>
:
                <button onClick={() => handleHeartClick(selectedBook?._id)} className="text-gray-400 hover:text-red-500">
                  <i className="text-2xl far fa-heart"></i>
                </button>


                  }
                  

          </div>
          </div>
            <div className="text-2xl font-bold mb-4">Rs {selectedBook?.price}</div>
            <p className="text-gray-600 mb-6">{selectedBook?.description}</p>
            
            {/* Seller info */}
            <div className="flex items-center mb-6">
              <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <img 
                  src={baseUrl + selectedBook?.user?.profileimage} 
                  alt={selectedBook?.user?.firstname}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{selectedBook?.user?.firstname} {selectedBook?.user?.lastname}</div>
                <div className="text-sm text-gray-500">
                  {new Date(selectedBook?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            {
              userDetail?._id !== selectedBook?.user?._id ? (

            
            <div className="flex flex-col gap-3">
              <div className='flex gap-2'>
                <button 
                  className="bg-bgPrimary text-white px-6 py-3 rounded-md font-medium flex-1"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
                <div className='p-4 border border-bgPrimary rounded-lg'>
                  <img 
                    onClick={()=>handleStartChat(selectedBook?.user?._id)}
                    src={messageIcon} alt="message" className="w-6 h-6 cursor-pointer" 
                  />
                </div>
              </div>
              <button  
              onClick={() => setShowRequestModal(true)}
              className="border border-bgPrimary text-bgPrimary px-6 py-3 rounded-md font-medium flex-1">
                Request
              </button>
            </div>
              ) :
                <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
                  <span className="text-gray-600 font-medium">This book is your Posted</span>
                </div>

            }
          </div>
        </div>
        
        {/* More From This Seller Section */}
        {SelectedMoreBooks?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">More From This Seller</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {SelectedMoreBooks.map((item: any) => (
                <div 
                  key={item._id} 
                  className="border rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleMoreBookClick(item._id)}
                >
                  <div className="relative h-48">
                    <img 
                      src={baseUrl + item.images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-bold">Rs {item.price}</div>
                    <div className="text-sm line-clamp-2">{item.title}</div>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <span>{item.user.firstname}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Contact options modal */}
        {showContactOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-xl font-bold mb-4">Contact Seller</h3>
              
              <div className="space-y-4">
                <button 
                  className="w-full py-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2"
                  onClick={redirectToWhatsApp}
                >
                  <img src={messageIcon} alt="WhatsApp" className="w-6 h-6" />
                  <span>WhatsApp</span>
                </button>
                
                <button 
                  className="w-full py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2"
                  onClick={redirectToCall}
                >
                  <i className={`fas fa-phone text-gray-500 mr-2`}></i>
                  <span>Call</span>
                </button>
                
                <button 
                  className="w-full py-2 border border-gray-300 rounded-lg"
                  onClick={() => setShowContactOptions(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-xl font-bold mb-4">Make a Bid Request</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Offer Amount (Rs)
                  </label>
                  <input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Enter amount"
                  />
                </div>
                
                <button 
                  className="w-full py-3 bg-bgPrimary text-white rounded-lg"
                  onClick={handleRequestBook}
                >
                  Send Request
                </button>
                
                <button 
                  className="w-full py-2 border border-gray-300 rounded-lg"
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestAmount('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && <Loader />}
        <Footer />
      </div>
    );
};

export default SelectedBookScreen;