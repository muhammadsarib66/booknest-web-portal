import { baseUrl } from '../redux/slices/Slicer';

interface SearchResultsProps {
  searchResults: any[];
  onItemClick: (book: any) => void;
  show: boolean;
}

const SearchResults = ({ searchResults, onItemClick, show }: SearchResultsProps) => {
  if (!show || !searchResults?.length) return null;
console.log(searchResults, "searchResults")
  return (
    <div className="fixed top-16 z-[1000]   left-[25%] w-[50%] bg-white mt-1 rounded-lg  border-black border-2 shadow-lg max-h-96 overflow-y-auto">
      {searchResults.map((book: any) => (
        <div
          key={book._id}
          className="flex items-center gap-4 p-4 hover:bg-gray-100 cursor-pointer border-b"
          onClick={() => onItemClick(book)}
        >
          <img 
            src={baseUrl + book.images[0]} 
            alt={book.title} 
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex flex-col flex-1">
            <h3 className="font-medium text-sm">{book.title}</h3>
            <div className="flex gap-2 text-xs text-gray-600">
              <span className="font-semibold">₨{book.price}</span>
              <span>•</span>
              <span>{book.location}</span>
              <span>•</span>
              <span className="capitalize">{book.genre}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
