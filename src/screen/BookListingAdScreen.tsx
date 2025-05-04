import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetMyBooksApi, TogglePauseActiveBookApi, UpdateBookApi, MarkBookSoldApi, DeleteBookApi } from '../redux/slices/BookSlice/BookSlicer';
import Loader from "../components/Loader"
import { baseUrl } from '../redux/slices/Slicer';
import EditBookModal from '../components/EditBookModal';
import Footer from '../components/Footer';

const BookListingAdScreen = () => {
  const dispatch = useDispatch();
  const { isLoading , getMyBooksList } = useSelector((state: any) => state?.BookSlicer);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (book: any) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = async (updatedData: any) => {
    try {
      // TODO: Dispatch update book action here
      console.log('Updated book data:', updatedData);
      dispatch(UpdateBookApi(updatedData) as any).unwrap().then(()=>{
        setIsEditModalOpen(false);
        setSelectedBook(null);

      }).catch((error: any) => {
        console.error('Error updating book:', error);
        // Handle error if needed
      }
    );
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleTogglePauseActive = (BookId: string) => {
   console.log(BookId, 'book id')
   const status = getMyBooksList.find((book: any) => book._id === BookId)?.isActive;
   const updatedBookStatus = { id: BookId, status: !status };
  //  alert('Are you sure you want to pause this book?')

    dispatch(TogglePauseActiveBookApi(updatedBookStatus) as any);
  };

  const handleMarkAsSold = (bookId: string) => {
    if (window.confirm('Are you sure you want to mark this book as sold?')) {
      dispatch(MarkBookSoldApi(bookId) as any);
    }
  };
  const handledeleteBook = (bookId: string) => {
    console.log(bookId,'s')
    if (window.confirm('Are you sure you want to delete this book?')) {
      dispatch(DeleteBookApi(bookId) as any);
    }
  }

  // Filter books based on active tab
  const getFilteredBooks = () => {
    if (!getMyBooksList) return [];
    
    switch(activeTab) {
      case 'all':
        return getMyBooksList;
      case 'approved':
        return getMyBooksList.filter((book: any) => book.status === 'Approved');
      case 'pending':
        return getMyBooksList.filter((book: any) => book.status === 'Pending');
      case 'rejected':
        return getMyBooksList.filter((book: any) => book.status === 'Rejected');
      case 'active':
        return getMyBooksList.filter((book: any) => book.isActive === true && book.status === 'Approved');
      case 'paused':
        return getMyBooksList.filter((book: any) => book.isActive === false);
      case 'sold':
        return getMyBooksList.filter((book: any) => book.isSold === true);
      default:
        return [];
    }
  };

  // Get action buttons based on book status
  const getActionButtons = (book: any) => {
    if (book.isSold) {
      return (
        <div className="flex space-x-2">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">Sold</span>
        </div>
      );
    }

    switch (book.status) {
      case 'Approved':
        return (
          <div className="flex space-x-2">
            {book.isActive ? (
              <>
                <button 
                  onClick={() => handleMarkAsSold(book._id)}
                  className="bg-bgPrimary text-white px-3 py-1 rounded text-sm"
                >
                  Mark as Sold
                </button>
                <button 
                  onClick={() => handleTogglePauseActive(book._id)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
                >
                  Pause
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleTogglePauseActive(book._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Activate
              </button>
            )}
            <button 
              onClick={() => handleEditClick(book)}
              className="bg-white border border-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
            >
              Edit
            </button>
          </div>
        );
      case 'Pending':
        return (
          <div className="flex space-x-2">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">Pending Approval</span>
          </div>
        );
      case 'Rejected':
        return (
          <div className="flex space-x-2">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">Rejected</span>
            <button className="bg-white border border-gray-300 text-gray-800 px-3 py-1 rounded text-sm">Delete</button>
          </div>
        );
      default:
        return null;
    }
  };

  // Update book card rendering
  const renderBookCard = (book: any) => (
    <div key={book._id} className="shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-60 h-52 md:h-auto rounded-lg flex-shrink-0">
        <img 
          src={baseUrl+book.images[0]} 
          alt={book.title} 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      <div className="flex flex-col p-4 flex-grow justify-between">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Rs {book.price}</h2>
           <div className='flex gap-2'>

            <button className="text-gray-400 hover:text-red-500">
              <i className="fas fa-heart"></i>
            </button>
            <button onClick={()=>handledeleteBook(book?._id)} className="text-red-800 hover:text-red-500">
              <i className="fas fa-trash"></i>
            </button>
           </div>
          </div>
          
          <h3 className="font-semibold mb-2">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{book.description}</p>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <i className="fas fa-user mr-1"></i>
            <span>{book.user.firstname}</span>
          </div>
          
          <div className="text-gray-500 text-sm">
            Posted on: {new Date(book.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="mt-4">
          {getActionButtons(book)}
        </div>
      </div>
    </div>
  );

  useEffect(()=>{
    dispatch(GetMyBooksApi()as any)
  },[dispatch])
  return (
    <>
      <div className="w-full min-h-screen overflow-auto mx-auto py-4 px-8 md:px-20">
        <div className="border-b mb-6">
          <div className="flex overflow-x-auto whitespace-nowrap">
            {['all', 'approved', 'pending', 'active', 'rejected', 'sold', 'paused'].map((tab) => (
              <button 
                key={tab}
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === tab ? 'border-b-2 border-bgPrimary text-bgPrimary' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {getFilteredBooks().map(renderBookCard)}
        </div>

        {getFilteredBooks().length === 0 && (
          <div className="text-center py-10">
            <i className="fas fa-book-open text-gray-300 text-5xl mb-4"></i>
            <p className="text-gray-500">No books found in this category</p>
          </div>
        )}
        {
          isLoading && <Loader />
        }
      </div>
      
      {selectedBook && (
        <EditBookModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedBook(null);
          }}
          bookData={selectedBook}
          onUpdate={handleUpdateBook}
        />
      )}
      <Footer />
    </>
  );
};

export default BookListingAdScreen;