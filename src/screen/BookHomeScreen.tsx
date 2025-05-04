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
      className="min-h-fit rounded-lg overflow-hidden h-[300px] shadow-lg 
      hover:shadow-xl hover:duration-300 duration-300 ease-in cursor-pointer hover:scale-110     " >
      <div className="relative">
        <img
          src={baseUrl + book.images[0]}
          alt={book.title}
          className="w-full h-64 object-cover"
        />
      </div>
      <div className="p-3">
        <div className="font-bold text-xl text-bgPrimary">Rs {book.price}</div>
        <div className="text-lg line-clamp-2">{book.title}</div>
        <div className="flex items-center text-sm text-gray-700 mt-1">
          <i className="fas fa-map-marker-alt mr-1"></i>
          <span>{book?.user?.address?.city + ","+book?.user?.address?.country}</span>
        </div>
        <div className="text-sm text-gray-700 mt-1">
          {moment(book.createdAt).fromNow()}
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
    <div className="w-full flex flex-col gap-4 mx-auto md:px-16 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {getAllBooksList?.books?.map((book: any) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {getAllBooksList?.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: getAllBooksList.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? 'bg-bgPrimary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookHomeScreen;