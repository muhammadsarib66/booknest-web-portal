import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddBookWishlistApi, getUserWishlistApi } from '../redux/slices/WishListSlice';
import { baseUrl } from '../redux/slices/Slicer';
import Loader from '../components/Loader';

const LikedBooks = () => {
  const dispatch = useDispatch()
  const { myWishListBooks ,isLoading} = useSelector((state:any)=>state.WishListSlice) 

  useEffect(()=>{
    dispatch(getUserWishlistApi()as any)
  },[dispatch])

  const handleHeartClick = (bookId: string) => {
    console.log('Book ID:', bookId);
    dispatch(AddBookWishlistApi(bookId) as any)
  };

  // Simplified action buttons with user details
  const getActionButtons = (book: any) => {
    return (
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium text-sm">{book.user.firstname} {book.user.lastname}</p>
            <p className="text-xs text-gray-500">{book.user.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded text-sm ${!book.isSold ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {!book.isSold ? 'Available' : 'Sold'}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen overflow-auto mx-auto py-4 px-8 md:px-20">
      <h1 className="text-2xl font-bold mb-6">Liked Books</h1>
      
      <div className="space-y-4">
        {myWishListBooks?.map((book: any) => (
          <div key={book._id} className="shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-60 h-52 md:h-auto rounded-lg flex-shrink-0">
              <img 
                src={baseUrl+ book.images[0]} 
                alt={book.title} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div className="flex flex-col p-4 flex-grow justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">Rs {book.price}</h2>
                  <button 
                    onClick={() => handleHeartClick(book._id)}
                    className="text-red-700 hover:text-red-100 transition duration-200 animate-pulse"
                  >
                    <i className="fas fa-heart text-2xl"></i>
                  </button>
                </div>
                
                <h3 className="font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{book.description}</p>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <i className="fas fa-book mr-1"></i>
                  <span>{book.genre}</span>
                </div>
                
                <div className="text-gray-500 text-sm">
                  Year: {book.year}
                </div>
              </div>
              
              <div className="mt-4">
                {getActionButtons(book)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {(!myWishListBooks || myWishListBooks.length === 0) && (
        <div className="text-center py-10">
          <i className="fas fa-book-open text-gray-300 text-5xl mb-4"></i>
          <p className="text-gray-500">No books found in your wishlist</p>
        </div>
      )}
      {
        isLoading && <Loader />
      }
    </div>
  );
};

export default LikedBooks;