/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { messageIcon } from "../assets/icons";
import { useNavigate, useParams } from 'react-router-dom';
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
    const { userDetail } = useSelector((state: any) => state.GetUserDetailSlice);
    
    const { selectedBook, SelectedMoreBooks, isLoading } = useSelector((state: any) => state.BookSlicer);

    const { id } = useParams();
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestAmount, setRequestAmount] = useState('');
    console.log(selectedBook, 'selected book');

    const handleBuyNow = () => {
        setShowContactOptions(true);
    };
    
    const redirectToWhatsApp = () => {
        window.open(`https://wa.me/${selectedBook?.user?.phoneno}`, '_blank');
    };
    
    const redirectToCall = () => {
        window.location.href = `tel:${selectedBook?.user?.phoneno}`;
    };
    
    const handleImageChange = (index: any) => {
        setSelectedImage(index);
    };

    const handleMoreBookClick = (bookId: string) => {
        navigate(`/book/${bookId}`);
    };
    
    const handleHeartClick = async (bookId: string) => {
        await dispatch(AddBookWishlistApi(bookId) as any).unwrap().then(() => {
            dispatch(getSelectedBookApi(bookId) as any);
        }).catch((err: any) => {
            console.log(err?.message, 'error');
        });
    };

    const handleRequestBook = () => {
        const bookData = {
            bookId: selectedBook._id,
            amount: parseInt(requestAmount)
        };
        
        console.log(bookData, 'book data');
        dispatch(sendBookRequestApi(bookData) as any);
        setShowRequestModal(false);
        setRequestAmount('');
    };

    const handleStartChat = (sellerID: any) => {
        console.log(sellerID, 'seller id');
        socket.emit('create_chat_room', { 
            senderId: userDetail?._id,
            receiverId: sellerID 
        });
        dispatch(setSellerId(sellerID) as any);
        navigate('/communication');
    };

    useEffect(() => {
        dispatch(getSelectedBookApi(id) as any);
    }, [dispatch, id]);

    if (isLoading) return <Loader />;
    if (!selectedBook || !selectedBook.images) return null;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Main Book Detail Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="flex flex-col lg:flex-row">
                            {/* Left side - Images */}
                            <div className="w-full lg:w-2/5 p-6">
                                <div className="bg-gray-100 rounded-xl overflow-hidden mb-4 aspect-square relative group">
                                    <img 
                                        src={baseUrl + (selectedBook.images[selectedImage] || '')} 
                                        alt={selectedBook.title} 
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    
                                    {/* Navigation arrows for large images */}
                                    {selectedBook.images.length > 1 && (
                                        <>
                                            <button 
                                                onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : selectedBook.images.length - 1)}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                            <button 
                                                onClick={() => setSelectedImage(selectedImage < selectedBook.images.length - 1 ? selectedImage + 1 : 0)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                                
                                {/* Thumbnail images */}
                                <div className="grid grid-cols-4 gap-3">
                                    {selectedBook.images.map((image: string, index: number) => (
                                        <div 
                                            key={index}
                                            className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                selectedImage === index 
                                                    ? 'border-bgPrimary shadow-lg transform scale-105' 
                                                    : 'border-gray-200 hover:border-gray-400'
                                            }`}
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
                            <div className="w-full lg:w-3/5 p-6 lg:pl-8">
                                <div className='flex justify-between items-start mb-4'>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 pr-4">
                                        {selectedBook?.title}
                                    </h1>
                                    <button 
                                        onClick={() => handleHeartClick(selectedBook?._id)}
                                        className={`flex-shrink-0 p-2 rounded-full transition-all duration-200 ${
                                            selectedBook?.likes?.includes(userDetail?._id)
                                                ? "text-red-500 bg-red-50 hover:bg-red-100" 
                                                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                        }`}
                                    >
                                        <i className={`text-2xl ${
                                            selectedBook?.likes?.includes(userDetail?._id) ? "fas" : "far"
                                        } fa-heart`}></i>
                                    </button>
                                </div>
                                
                                <div className="text-3xl font-bold text-bgPrimary mb-6">
                                    Rs {selectedBook?.price?.toLocaleString()}
                                </div>
                                
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {selectedBook?.description}
                                </p>
                                
                                {/* Seller info */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-8">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md">
                                            <img 
                                                src={baseUrl + selectedBook?.user?.profileimage} 
                                                alt={selectedBook?.user?.firstname}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                {selectedBook?.user?.firstname} {selectedBook?.user?.lastname}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Member since {new Date(selectedBook?.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action buttons */}
                                {userDetail?._id !== selectedBook?.user?._id ? (
                                    <div className="space-y-4">
                                        <div className='flex flex-col sm:flex-row gap-3'>
                                            <button 
                                                className="bg-gradient-to-r from-bgPrimary to-blue-600 hover:from-blue-600 hover:to-bgPrimary 
                                                text-white px-8 py-4 rounded-xl font-semibold flex-1 transition-all duration-300 
                                                transform hover:-translate-y-1 hover:shadow-lg"
                                                onClick={handleBuyNow}
                                            >
                                                💬 Contact Seller
                                            </button>
                                            <button 
                                                onClick={() => handleStartChat(selectedBook?.user?._id)}
                                                className="bg-white border-2 border-bgPrimary text-bgPrimary px-8 py-4 rounded-xl 
                                                font-semibold hover:bg-bgPrimary hover:text-white transition-all duration-300 
                                                transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <img src={messageIcon} alt="message" className="w-5 h-5" />
                                                Chat
                                            </button>
                                        </div>
                                        <button  
                                            onClick={() => setShowRequestModal(true)}
                                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 
                                            text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 
                                            transform hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            💰 Make an Offer
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 text-center">
                                        <i className="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                                        <span className="text-green-700 font-semibold block">This is your posted book</span>
                                        <span className="text-green-600 text-sm">Manage it from your books section</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* More From This Seller Section */}
                    {SelectedMoreBooks?.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <i className="fas fa-books mr-3 text-bgPrimary"></i>
                                More From This Seller
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {SelectedMoreBooks.map((item: any) => (
                                    <div 
                                        key={item._id} 
                                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer 
                                        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-bgPrimary/50"
                                        onClick={() => handleMoreBookClick(item._id)}
                                    >
                                        <div className="relative aspect-video overflow-hidden">
                                            <img 
                                                src={baseUrl + item.images[0]} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 left-3 bg-bgPrimary text-white px-3 py-1 rounded-full text-sm font-bold">
                                                Rs {item.price}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-bgPrimary transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{item.user.firstname}</span>
                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Contact options modal */}
                {showContactOptions && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Contact Seller</h3>
                            
                            <div className="space-y-4">
                                <button 
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 
                                    text-white rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 
                                    transform hover:-translate-y-1 hover:shadow-lg"
                                    onClick={redirectToWhatsApp}
                                >
                                    <i className="fab fa-whatsapp text-xl"></i>
                                    WhatsApp
                                </button>
                                
                                <button 
                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 
                                    text-white rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 
                                    transform hover:-translate-y-1 hover:shadow-lg"
                                    onClick={redirectToCall}
                                >
                                    <i className="fas fa-phone text-lg"></i>
                                    Call Now
                                </button>
                                
                                <button 
                                    className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium 
                                    hover:bg-gray-50 transition-colors duration-200"
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Make an Offer</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Your Offer Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">Rs</span>
                                        <input
                                            type="number"
                                            value={requestAmount}
                                            onChange={(e) => setRequestAmount(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none 
                                            focus:border-bgPrimary focus:ring-4 focus:ring-bgPrimary/10 transition-all duration-200 text-lg font-semibold"
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Original price: Rs {selectedBook?.price?.toLocaleString()}
                                    </p>
                                </div>
                                
                                <button 
                                    className="w-full py-4 bg-gradient-to-r from-bgPrimary to-blue-600 hover:from-blue-600 hover:to-bgPrimary 
                                    text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                                    onClick={handleRequestBook}
                                >
                                    Send Offer
                                </button>
                                
                                <button 
                                    className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium 
                                    hover:bg-gray-50 transition-colors duration-200"
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
            </div>
            <Footer />
        </>
    );
};

export default SelectedBookScreen;