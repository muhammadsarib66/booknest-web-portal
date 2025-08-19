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
      console.log('Updated book data:', updatedData);
      dispatch(UpdateBookApi(updatedData) as any).unwrap().then(()=>{
        setIsEditModalOpen(false);
        setSelectedBook(null);
      }).catch((error: any) => {
        console.error('Error updating book:', error);
      });
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleTogglePauseActive = (BookId: string) => {
   console.log(BookId, 'book id')
   const status = getMyBooksList.find((book: any) => book._id === BookId)?.isActive;
   const updatedBookStatus = { id: BookId, status: !status };
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
          <span className="badge badge-success">Sold</span>
        </div>
      );
    }

    switch (book.status) {
      case 'Approved':
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            {book.isActive ? (
              <>
                <button 
                  onClick={() => handleMarkAsSold(book._id)}
                  className="btn-success text-sm px-4 py-2"
                >
                  Mark as Sold
                </button>
                <button 
                  onClick={() => handleTogglePauseActive(book._id)}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Pause
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleTogglePauseActive(book._id)}
                className="btn-primary text-sm px-4 py-2"
              >
                Activate
              </button>
            )}
            <button 
              onClick={() => handleEditClick(book)}
              className="btn-ghost text-sm px-4 py-2"
            >
              Edit
            </button>
          </div>
        );
      case 'Pending':
        return (
          <div className="flex space-x-2">
            <span className="badge badge-warning">Pending Approval</span>
          </div>
        );
      case 'Rejected':
        return (
          <div className="flex space-x-2">
            <span className="badge badge-error">Rejected</span>
            <button className="btn-danger text-sm px-4 py-2">Delete</button>
          </div>
        );
      default:
        return null;
    }
  };

  // Update book card rendering
  const renderBookCard = (book: any) => (
    <div key={book._id} className="card card-hover animate-fade-in">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-64 h-48 lg:h-auto rounded-t-xl lg:rounded-l-xl lg:rounded-t-none overflow-hidden flex-shrink-0">
          <img 
            src={baseUrl+book.images[0]} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <div className="flex flex-col p-4 lg:p-6 flex-grow justify-between">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="heading-3 text-primary-600">Rs {book.price}</h2>
              <div className='flex gap-2'>
                <button className="text-secondary-400 hover:text-error-500 transition-colors duration-200">
                  <i className="fas fa-heart"></i>
                </button>
                <button 
                  onClick={()=>handledeleteBook(book?._id)} 
                  className="text-error-600 hover:text-error-700 transition-colors duration-200"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            
            <h3 className="heading-3">{book.title}</h3>
            <p className="body-medium text-secondary-600 line-clamp-2">{book.description}</p>
            
            <div className="flex items-center text-secondary-500 text-sm">
              <i className="fas fa-user mr-2 text-primary-500"></i>
              <span>{book.user.firstname}</span>
            </div>
            
            <div className="text-secondary-500 text-sm">
              Posted on: {new Date(book.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="mt-6">
            {getActionButtons(book)}
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(()=>{
    dispatch(GetMyBooksApi()as any)
  },[dispatch])
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/20">
        <div className="container-responsive section-padding">
          <div className="animate-fade-in">
            <h1 className="heading-1 text-center mb-8">My Book Listings</h1>
            
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-soft p-1 mb-8 overflow-x-auto">
              <div className="flex min-w-max">
                {['all', 'approved', 'pending', 'active', 'rejected', 'sold', 'paused'].map((tab) => (
                  <button 
                    key={tab}
                    className={`py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-primary-500 text-white shadow-lg transform scale-105' 
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Books List */}
            <div className="space-y-6">
              {getFilteredBooks().map(renderBookCard)}
            </div>

            {getFilteredBooks().length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
                <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-book-open text-secondary-400 text-3xl"></i>
                </div>
                <h3 className="heading-3 mb-2">No Books Found</h3>
                <p className="body-medium text-secondary-600">No books found in this category</p>
              </div>
            )}
            
            {isLoading && <Loader />}
          </div>
        </div>
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