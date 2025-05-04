
import Navbar from '../../components/Navbar';
import { Routes, Route } from 'react-router-dom';
import SelectedBookScreen from '../SelectedBookScreen';
// import Footer from '../../components/Footer';
import BooksMainScreen from './BooksMainScreen';
import ChatScreen from '../communication/ChatScreen';
import BookListingAdScreen from '../BookListingAdScreen';
import EditProfile from '../auth/EditProfile';
import LikedBooks from '../LikedBooks';
import PostBookAd from '../PostBookAd';
import GenreBooksScreen from '../GenreBooksScreen';
import BookRequests from './BookRequests';
import AllNotifications from '../AllNotifications';

const Home = () => {
// const location = window.location.pathname; 
  return (
    <>
      <Navbar />
      <div className='mt-20'>
        <Routes>
          <>
            <Route path="*" element={<BooksMainScreen />} />
            <Route path="/Books" element={<BooksMainScreen />} />
            <Route path="/book/:id" element={<SelectedBookScreen />} />
            <Route path="/my-books-listing" element={<BookListingAdScreen/>} />
            <Route path="/book-requests" element={<BookRequests/>} />
            <Route path="/edit-profile" element={<EditProfile/>} />
            <Route path="/liked-books" element={<LikedBooks/>} />
            <Route path="/Post-new-book-ad" element={<PostBookAd/>} />
            <Route path="/genre/:genreId" element={<GenreBooksScreen />} />
            <Route path="/communication" element={<ChatScreen />} />
            <Route path="/all-notifications" element={<AllNotifications />} />
          </>
        </Routes>
        {/* {location !== '/communication' && <Footer />} */}
      </div>
    </>
  );
};

export default Home;