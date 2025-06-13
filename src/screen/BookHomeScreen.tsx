import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllBooksApi } from '../redux/slices/BookSlice/BookSlicer';
import { baseUrl } from '../redux/slices/Slicer';
import moment from 'moment';

const BookCard = ({ book }: any) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/book/' + book._id)}
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl 
      transition-all duration-300 ease-out cursor-pointer transform hover:-translate-y-2 
      border border-gray-100 hover:border-bgPrimary/20"
    >
      <div className="relative overflow-hidden">
        <img
          src={baseUrl + book.images[0]}
          alt={book.title}
          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 
          group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price Badge */}
        <div className="absolute top-3 left-3 bg-bgPrimary text-white px-3 py-1 rounded-full 
        text-sm font-bold shadow-lg">
          Rs {book.price}
        </div>
        
        {/* Time Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 
        rounded-full text-xs font-medium">
          {moment(book.createdAt).fromNow()}
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-bgPrimary 
        transition-colors duration-200">
          {book.title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600">
          <i className="fas fa-map-marker-alt mr-2 text-bgPrimary"></i>
          <span className="truncate">
            {book?.user?.address?.city + ", " + book?.user?.address?.country}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
              {book?.user?.profileimage && (
                <img 
                  src={baseUrl + book.user.profileimage} 
                  alt="seller" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {book?.user?.firstname}
            </span>
          </div>
          
          <div className="text-xs text-gray-400">
            <i className="fas fa-eye mr-1"></i>
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

const BookHomeScreen = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { getAllBooksList } = useSelector((state: any) => state.BookSlicer);

  useEffect(() => {
    dispatch(GetAllBooksApi(currentPage) as any);
  }, [dispatch, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Discover Amazing Books
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of books from passionate readers around the world
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {getAllBooksList?.books?.map((book: any) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>

        {/* Empty State */}
        {(!getAllBooksList?.books || getAllBooksList.books.length === 0) && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500">Be the first to share a book with the community!</p>
          </div>
        )}

        {/* Pagination */}
        {getAllBooksList?.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 
                hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: getAllBooksList.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-bgPrimary text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-bgPrimary/50'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(Math.min(getAllBooksList.totalPages, currentPage + 1))}
                disabled={currentPage === getAllBooksList.totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 
                hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookHomeScreen;