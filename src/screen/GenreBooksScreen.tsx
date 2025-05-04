import  { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book2 } from '../assets/icons';

// Book Card Component (same as in home screen for consistency)
const BookCard = ({ book }:any) => {
  return (
    <div className=" min-h-fit rounded-lg overflow-hidden h-[300px] shadow-lg">
    <div className="relative ">
      <img 
        src={book.image || "/api/placeholder/200/240"} 
        alt={book.title} 
        className="w-full h-64 object-cover"
      />
      <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
        <i className="far fa-heart"></i>
      </button>
    </div>
    <div className="p-3 ">
      <div className="font-bold text-xl text-bgPrimary">Rs {book.price.toLocaleString()}</div>
      <div className="text-lg line-clamp-2 ">{book.title}</div>
      <div className="flex items-center text-sm text-gray-700 mt-1">
        <i className="fas fa-map-marker-alt mr-1"></i>
        <span>{book.location}</span>
      </div>
      <div className="text-sm text-gray-700 mt-1">
        {book.timeAgo}
      </div>
    </div>
  </div>
  );
};

const GenreBooksScreen = () => {
  const { genreId } = useParams();
  const [genreData, setGenreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Sample data for all genres (in a real app, this would come from an API)
  const allGenreData :any = {
    popular: {
      title: 'Most Popular Books',
      books: Array(12).fill(null).map((_, index) => ({
        id: 100 + index,
        title: "Instant Communication with Real-Time Messaging",
        price: 22500,
        image: Book2,
        location: "Prem Nagar, Lahore",
        timeAgo: "1 day ago",
      }))
    },
    dictionaries: {
      title: 'Dictionaries',
      books: Array(12).fill(null).map((_:any, index:any) => ({
        id: 200 + index,
        title: "Instant Communication with Real-Time Messaging",
        price: 22500,
        image: Book2,
        location: "Prem Nagar, Lahore",
        timeAgo: "1 day ago",
      }))
    },
    recommended: {
      title: 'Books You Might Like',
      books: Array(12).fill(null).map((_, index) => ({
        id: 300 + index,
        title: "Instant Communication with Real-Time Messaging",
        price: 22500,
        image: Book2,
        location: "Prem Nagar, Lahore",
        timeAgo: "1 day ago",
      }))
    }
  };
  
  // Simulate fetching data for the selected genre
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchGenreData = () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        setGenreData(allGenreData[genreId || 0] || {
          title: 'Genre Not Found',
          books: []
        });
        setLoading(false);
      }, 500);
    };
    
    fetchGenreData();
  }, [genreId]);
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-2"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Link to="/" className="text-blue-600 mr-3">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold">{genreData.title}</h1>
      </div>
      
      {/* Books grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genreData.books.map((book:any) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      
      {/* Empty state */}
      {genreData.books.length === 0 && (
        <div className="text-center py-10">
          <i className="fas fa-book-open text-gray-300 text-5xl mb-4"></i>
          <p className="text-gray-500">No books found in this category</p>
        </div>
      )}
    </div>
  );
};

export default GenreBooksScreen;