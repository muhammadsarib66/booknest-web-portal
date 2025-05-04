import  { useEffect, useState } from 'react'
import {heartIcon,
notificationIcon,
searchIcon, 
mainBigLogo,
chevronIcon,
postBookImg,
mybookImg,
logoutImg,
userImg2} from '../assets/icons' 
import { Avatar } from '@material-tailwind/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl } from '../redux/slices/Slicer';
import { getUserDetailApi } from '../redux/slices/GetUserDetailSlice';
import { GetSearchedBookApi } from '../redux/slices/BookSlice/BookSlicer';
import SearchResults from './SearchResults';
import { GetNotificationsApi } from '../redux/slices/NotificationSlice';
import moment from 'moment';

const categories = ["All Categories", "Fiction", "Non-Fiction",  'Mystery', 'Science', 'Biography','others'];

const Navbar = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(categories[0]);
    const [searchQuery, setSearchQuery] = useState<any>("");
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const {getAllNotifications} = useSelector((state: any) => state.NotificationSlice);
    
    const {  userDetail } = useSelector((state: any) => state.GetUserDetailSlice);
    const {  searchBooks } = useSelector((state: any) => state.BookSlicer);

  const recentNotificaions = getAllNotifications?.slice(0, 5);
  console.log(getAllNotifications,'notifcaiton')
  useEffect(() => {
    if(isNotificationOpen ){
      setIsProfileOpen(false)
    }
    if(isProfileOpen){
      setNotificationOpen(false)
    }
  }, [
    isNotificationOpen,
    isProfileOpen
  ]);

  useEffect(()=>{
    dispatch(getUserDetailApi() as any)
    dispatch(GetNotificationsApi() as any)
  },[dispatch])

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
    }, 300); // Add debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory, dispatch]);

  const handleSearchItemClick = (book: any) => {
    // console.log('Selected book:', book);
    setShowSearchDropdown(false);
    navigate(`/book/${book._id}`); // Assuming you have a book detail route
  };

  return (
    <>
    <div className={`${location.pathname == '/communication' ? 'absolute' : "fixed"} top-0 left-0 z-[100] flex w-full h-20 overflow-hidden bg-white border-b border-2 px-4 md:px-16 py-4 justify-between items-center`}>
            <div onClick={()=>{navigate('/')
              setIsProfileOpen(false)
            }} className='cursor-pointer'>
                <img src={mainBigLogo} alt="logo" className="w-full h-full" />
            </div>
        <div className="flex items-center h-full border rounded-lg overflow-visible w-[60%] shadow-sm relative">
      {/* Category Dropdown */}
      <div className="relative   my-4">
        <select
          className="bg-white px-4 py-2 outline-none appearance-none text-sm font-semibold text-textSecondary cursor-pointer"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          >
          {categories.map((category) => (
            <option className='capitalize' key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Books, Magazines, Dictionaries"
        className="flex-1 px-4  text-sm font-semibold h-fit outline-none border-l-2 border-gray-700 text-gray-700"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />

      {/* Search Button */}
      <div  className="bg-bgPrimary select-none h-full w-12 flex items-center justify-center text-white rounded-lg">
        <img src={searchIcon} alt="search" className="w-4 h-4" />
      </div>
      <SearchResults 
        searchResults={searchBooks} 
        onItemClick={handleSearchItemClick}
        show={showSearchDropdown}
        />
    </div>
          <div className='flex gap-4'>
            <div className='flex items-center gap-4'>
                <img 
                 onClick={() => setNotificationOpen(!isNotificationOpen)}
                src={notificationIcon} alt="notification" className="w-5 h-5 cursor-pointer" />
                <img
                onClick={() => {
                  navigate('/liked-books')
                  setIsProfileOpen(false)
                  setNotificationOpen(false)
                }}
                src={heartIcon} alt="heart" className="w-5 h-5 cursor-pointer" />
            </div>
            {/* // profile */}
            <div 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
            className='cursor-pointer flex relative items-center gap-1'>

            <Avatar 
            placeholder={''}
onPointerEnterCapture={''}
onPointerLeaveCapture={''}
            className='border-2 border-bgPrimary' size="md" src={userDetail?.profileimage ? baseUrl+ userDetail?.profileimage  :userImg2} />
            <img
      
            src={chevronIcon} alt="chevron" className={`w-3 h-3 transform duration-300 ${isProfileOpen ?"transform rotate-180" :"" }`} />

          
            </div>
            
            {/* <img src={userImg} alt="profile" className="w-10 h-10 rounded-full" /> */}
          </div>
         
    </div>
    {isProfileOpen && (
                <div
                 className='fixed  right-16 z-[10000] text-textSecondary top-16 bg-[#F9FAFF]  rounded-lg p-2 w-48'>
                      <div 
                      onClick={() => {navigate('/edit-profile')
                      setIsProfileOpen(false)
                      }}

                      className=' cursor-pointer hover:bg-gray-100 hover:duration-300   text-xs text-black font-semibold py-2 text-center border border-black '>
                        View & Edit Profile
                      </div>
                    <div 
                    onClick={() => {navigate('/Post-new-book-ad')
                        setIsProfileOpen(false)

                    }}
                    className='text-xs font-semibold text-gray-900 flex items-center gap-2 p-2  hover:bg-textPrimary rounded cursor-pointer'>
                    <img src={postBookImg} alt="postBook" className="w-4 h-4" />
                    <span>Post Book</span>
                    </div>
                    <div 
                    onClick={() => {navigate('/my-books-listing')
                        setIsProfileOpen(false)}
                    }
                    className='text-xs font-semibold text-gray-900 flex items-center gap-2 p-2  hover:bg-textPrimary rounded cursor-pointer'>
                    <img src={mybookImg} alt="mybook" className="w-4 h-4" />

                    <span>My Books</span>
                    </div>
                    <div 
                    onClick={() => {navigate('/book-requests')
                        setIsProfileOpen(false)}
                    }
                    className='text-xs font-semibold text-gray-900 flex items-center gap-2 p-2  hover:bg-textPrimary rounded cursor-pointer'>
                    <img src={mybookImg} alt="mybook" className="w-4 h-4" />

                    <span>Books Request </span>
                    </div>
                    <div 
                    onClick={() => {navigate('/communication')
                        setIsProfileOpen(false)
                    }}
                    className='text-xs font-semibold text-gray-900 flex items-center gap-2 p-2  hover:bg-textPrimary rounded cursor-pointer'>
                    <img src={mybookImg} alt="mybook" className="w-4 h-4" />

                    <span>Chat</span>
                    </div>
                    <div 
                    onClick={() => {
                        // Add logout logic here
                        navigate('/login');
                            localStorage.clear();
                            window.location.reload();                        

                    }}
                    className='text-xs font-semibold text-gray-900 flex items-center gap-2 p-2  hover:bg-textPrimary rounded cursor-pointer'>
                    <img src={logoutImg} alt="mybook" className="w-4 h-4" />

                    <span>Logout</span>
                    </div>
                </div>
                )}
                {isNotificationOpen && (
        // <div className="fixed  right-44 top-14 z-[10000] mt-2 w-72 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="fixed  sm:right-44 top-14 z-[10000] mt-2 bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="p-3 text-lg font-semibold bg-bgPrimary text-textPrimary border-b">Notification</div>
          <div className="max-h-60 overflow-y-auto">
            { recentNotificaions.length>0 ? recentNotificaions.map((notif :any) => (
              <div key={notif._id} className="flex  p-3 border-b last:border-b-0 gap-2 hover:bg-bgSecondary">
                <img src={notificationIcon } alt="notification" className="w-4 h-4" />
                <div>
                  <p className="text-xs font-medium">{notif.message}</p>
                  <p className="text-xs font-semibold capitalize "> <Avatar onPointerEnterCapture={''} onPointerLeaveCapture={''} placeholder={''} src={baseUrl+notif.sender?.profileimage} alt="user" className="w-4 h-4 rounded-full"/> {notif.sender?.firstname}</p>
                  <span className="text-xs text-gray-500">{moment(notif?.createdAt).format('lll')}</span>
                </div>
              </div>
            )) 
          :
          (
            <div className="flex items-center justify-center p-4 text-gray-500">
              No notifications available.
            </div>
          )
          }
          </div>
          <p onClick={()=>{
            navigate('/all-notifications')
            setNotificationOpen(false)
            setIsProfileOpen(false)
          }}>
            <span className="text-xs text-gray-500 cursor-pointer hover:text-bgPrimary hover:underline px-3 py-2 block text-center">See all notifications</span>
          </p>
        </div>
      )}
            </>
  )
}

export default Navbar