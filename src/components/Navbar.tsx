/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  heartIcon,
  notificationIcon,
  searchIcon,
  mainBigLogo,
  chevronIcon,
  postBookImg,
  mybookImg,
  logoutImg,
  userImg2
} from '../assets/icons';
import { Avatar } from '@material-tailwind/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl } from '../redux/slices/Slicer';
import { getUserDetailApi } from '../redux/slices/GetUserDetailSlice';
import { GetSearchedBookApi } from '../redux/slices/BookSlice/BookSlicer';
import SearchResults from './SearchResults';
import { GetNotificationsApi } from '../redux/slices/NotificationSlice';
import moment from 'moment';

const categories = ["All Categories", "Fiction", "Non-Fiction", 'Mystery', 'Science', 'Biography', 'others'];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // Redux selectors
  const { getAllNotifications } = useSelector((state: any) => state.NotificationSlice);
  const { userDetail } = useSelector((state: any) => state.GetUserDetailSlice);
  const { searchBooks } = useSelector((state: any) => state.BookSlicer);

  const recentNotifications = getAllNotifications?.slice(0, 5) || [];

  // Effects
  useEffect(() => {
    if (isNotificationOpen) setIsProfileOpen(false);
    if (isProfileOpen) setNotificationOpen(false);
  }, [isNotificationOpen, isProfileOpen]);

  useEffect(() => {
    dispatch(getUserDetailApi() as any);
    dispatch(GetNotificationsApi() as any);
  }, [dispatch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(GetSearchedBookApi({
          title: searchQuery.trim(),
          genre: selectedCategory !== "All Categories" ? selectedCategory : ""
        }) as any);
        setShowSearchDropdown(true);
      } else {
        setShowSearchDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory, dispatch]);

  // Handlers
  const handleSearchItemClick = (book: any) => {
    setShowSearchDropdown(false);
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/book/${book._id}`);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsProfileOpen(false);
    setNotificationOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Main Navbar */}
      <div className={`${location.pathname === '/communication' ? 'absolute' : "fixed"} top-0 left-0 z-[100] w-full h-16 sm:h-20 bg-white border-b-2 border-gray-100 shadow-sm`}>
        <div className="flex justify-between items-center h-full px-4 sm:px-6 lg:px-16">
          
          {/* Logo */}
          <div onClick={() => handleNavigation('/')} className='cursor-pointer h-8 sm:h-10'>
            <img src={mainBigLogo} alt="logo" className="h-full w-auto" />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center h-12 border border-gray-300 rounded-xl overflow-hidden w-[50%] shadow-sm relative">
            <select
              className="bg-white px-4 py-3 outline-none text-sm font-semibold text-gray-700 border-r border-gray-300"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Books, Magazines, Dictionaries"
              className="flex-1 px-4 py-3 text-sm outline-none text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="bg-bgPrimary h-full w-12 flex items-center justify-center cursor-pointer">
              <img src={searchIcon} alt="search" className="w-4 h-4" />
            </div>
            <SearchResults 
              searchResults={searchBooks} 
              onItemClick={handleSearchItemClick}
              show={showSearchDropdown}
            />
          </div>

          {/* Desktop Right Menu */}
          <div className='hidden lg:flex gap-6 items-center'>
            <div className='flex items-center gap-4'>
              <button 
                onClick={() => setNotificationOpen(!isNotificationOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img src={notificationIcon} alt="notification" className="w-6 h-6" />
                {getAllNotifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {getAllNotifications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavigation('/liked-books')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img src={heartIcon} alt="heart" className="w-6 h-6" />
              </button>
            </div>
            <div onClick={() => setIsProfileOpen(!isProfileOpen)} className='cursor-pointer flex items-center gap-2'>
              <Avatar 
                placeholder={''}
                onPointerEnterCapture={''}
                onPointerLeaveCapture={''}
                className='border-2 border-bgPrimary' 
                size="md" 
                src={userDetail?.profileimage ? baseUrl + userDetail?.profileimage : userImg2} 
              />
              <img src={chevronIcon} alt="chevron" className={`w-3 h-3 transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <img src={searchIcon} alt="search" className="w-5 h-5" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Avatar 
                placeholder={''}
                onPointerEnterCapture={''}
                onPointerLeaveCapture={''}
                className='border-2 border-bgPrimary' 
                size="sm" 
                src={userDetail?.profileimage ? baseUrl + userDetail?.profileimage : userImg2} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-white z-[200] lg:hidden">
          <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setIsMobileSearchOpen(false)} className="p-2">
                <i className="fas fa-arrow-left text-lg"></i>
              </button>
              <h2 className="text-lg font-semibold">Search Books</h2>
            </div>
            <div className="space-y-4">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for books..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <img src={searchIcon} alt="search" className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <SearchResults 
                searchResults={searchBooks} 
                onItemClick={handleSearchItemClick}
                show={searchQuery.length > 0}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[150] lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-[200] lg:hidden shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              {/* User Profile Section */}
              <div className="bg-gradient-to-r from-bgPrimary to-blue-600 rounded-xl p-4 mb-6 text-white">
                <div className="flex items-center gap-3">
                  <Avatar 
                    placeholder={''}
                    onPointerEnterCapture={''}
                    onPointerLeaveCapture={''}
                    size="lg" 
                    src={userDetail?.profileimage ? baseUrl + userDetail?.profileimage : userImg2} 
                  />
                  <div>
                    <div className="font-semibold">{userDetail?.firstname} {userDetail?.lastname}</div>
                    <div className="text-sm opacity-90">{userDetail?.email}</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleNavigation('/liked-books')}
                  className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl"
                >
                  <img src={heartIcon} alt="heart" className="w-6 h-6" />
                  <span className="text-sm font-medium text-red-700">Liked Books</span>
                </button>
                <button
                  onClick={() => handleNavigation('/all-notifications')}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl relative"
                >
                  <img src={notificationIcon} alt="notification" className="w-6 h-6" />
                  <span className="text-sm font-medium text-blue-700">Notifications</span>
                  {getAllNotifications?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {getAllNotifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <button onClick={() => handleNavigation('/edit-profile')} className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-left">
                  <i className="fas fa-user-edit text-gray-600 w-5"></i>
                  <span>View & Edit Profile</span>
                </button>
                <button onClick={() => handleNavigation('/Post-new-book-ad')} className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-left">
                  <img src={postBookImg} alt="post book" className="w-5 h-5" />
                  <span>Post Book</span>
                </button>
                <button onClick={() => handleNavigation('/my-books-listing')} className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-left">
                  <img src={mybookImg} alt="my books" className="w-5 h-5" />
                  <span>My Books</span>
                </button>
                <button onClick={() => handleNavigation('/book-requests')} className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-left">
                  <i className="fas fa-inbox text-gray-600 w-5"></i>
                  <span>Book Requests</span>
                </button>
                <button onClick={() => handleNavigation('/communication')} className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-left">
                  <i className="fas fa-comments text-gray-600 w-5"></i>
                  <span>Chat</span>
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-100 text-red-600 rounded-lg text-left">
                  <img src={logoutImg} alt="logout" className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Profile Dropdown */}
      {isProfileOpen && (
        <div className='hidden lg:block fixed right-4 xl:right-16 z-[10000] top-16 bg-white shadow-xl rounded-xl p-2 w-56 border'>
          <div onClick={() => handleNavigation('/edit-profile')} className='cursor-pointer hover:bg-gray-100 text-xs font-semibold py-3 text-center border border-gray-300 rounded-lg mb-2'>
            View & Edit Profile
          </div>
          <div onClick={() => handleNavigation('/Post-new-book-ad')} className='text-xs font-semibold flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer'>
            <img src={postBookImg} alt="post book" className="w-4 h-4" />
            <span>Post Book</span>
          </div>
          <div onClick={() => handleNavigation('/my-books-listing')} className='text-xs font-semibold flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer'>
            <img src={mybookImg} alt="my books" className="w-4 h-4" />
            <span>My Books</span>
          </div>
          <div onClick={() => handleNavigation('/book-requests')} className='text-xs font-semibold flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer'>
            <i className="fas fa-inbox text-gray-600"></i>
            <span>Book Requests</span>
          </div>
          <div onClick={() => handleNavigation('/communication')} className='text-xs font-semibold flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer'>
            <i className="fas fa-comments text-gray-600"></i>
            <span>Chat</span>
          </div>
          <div onClick={handleLogout} className='text-xs font-semibold text-red-600 flex items-center gap-2 p-3 hover:bg-red-50 rounded-lg cursor-pointer'>
            <img src={logoutImg} alt="logout" className="w-4 h-4" />
            <span>Logout</span>
          </div>
        </div>
      )}

      {/* Desktop Notifications Dropdown */}
      {isNotificationOpen && (
        <div className="hidden lg:block fixed right-4 xl:right-44 top-16 z-[10000] mt-2 w-80 bg-white shadow-xl rounded-xl border">
          <div className="p-4 text-lg font-semibold bg-bgPrimary text-white rounded-t-xl">Notifications</div>
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length > 0 ? recentNotifications.map((notif: any) => (
              <div key={notif._id} className="flex p-4 border-b last:border-b-0 gap-3 hover:bg-gray-50">
                <img src={notificationIcon} alt="notification" className="w-5 h-5 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notif.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar 
                      onPointerEnterCapture={''} 
                      onPointerLeaveCapture={''} 
                      placeholder={''} 
                      src={baseUrl + notif.sender?.profileimage} 
                      alt="user" 
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="text-xs text-gray-600 capitalize">{notif.sender?.firstname}</span>
                  </div>
                  <span className="text-xs text-gray-500">{moment(notif?.createdAt).format('lll')}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-bell-slash text-3xl mb-2"></i>
                <p>No notifications available.</p>
              </div>
            )}
          </div>
          <div onClick={() => handleNavigation('/all-notifications')} className="text-center p-3 border-t hover:bg-gray-50 cursor-pointer">
            <span className="text-sm text-bgPrimary hover:underline">See all notifications</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 