/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl } from '../../redux/slices/Slicer';
import Loader from '../../components/Loader';
import MyButton from '../../components/MyButton';
import { GetRequestBooksApi, HandleBookRequestApi } from '../../redux/slices/BookSlice/BookSlicer';
import Footer from '../../components/Footer';

const BookRequests = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('received');
  const {RequestBooksList ,isLoading} = useSelector((state: any) => state?.BookSlicer);
  // Temporary mock data - replace with actual API data


console.log(RequestBooksList, 'request books list')

  useEffect(()=>{
    dispatch(GetRequestBooksApi()as any)
  },[dispatch])

  const handleAcceptRequest = (requestData: any) => {
    // TODO: Implement accept request logic
    console.log('Accepting request:', requestData);
    dispatch(HandleBookRequestApi(requestData) as any)
  };

  const handleRejectRequest = (requestData: any) => {
   // TODO: Implement accept request logic
   console.log('Accepting request:', requestData);
   dispatch(HandleBookRequestApi(requestData) as any)
  };

  const RequestCard = ({ request, type }: { request: any, type: 'received' | 'sent' }) => {
    if (type === 'sent') {
      return (
        <div className="shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row mb-4">
          <div className="w-full md:w-60 h-52 md:h-auto rounded-lg flex-shrink-0">
            <img 
              src={baseUrl + (request?.book?.images?.[0] || 'default-image.jpg')} 
              alt={request?.book?.title} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <div className="flex flex-col p-4 flex-grow justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Rs {request?.book?.price}</h2>
                <span className={`px-3 py-1 rounded text-sm ${
                  request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </div>
              
              <h3 className="font-semibold mb-2">{request?.book?.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{request?.book?.description}</p>
              
              <div className="text-sm text-gray-600">
                <p>Author: {request?.book?.author}</p>
                <p>Genre: {request?.book?.genre}</p>
                <p>Condition: {request?.book?.condition}</p>
                <p>Year: {request?.book?.year}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
else{

    return (
      
      <div className="shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row mb-4">
        <div className="w-full md:w-60 h-52 md:h-auto rounded-lg flex-shrink-0">
          <img 
            src={baseUrl + request.book.images[0]} 
            alt={request.book.title} 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex flex-col p-4 flex-grow justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Rs {request.book.price}</h2>
              <span className={`px-3 py-1 rounded text-sm ${
                request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status}
              </span>
            </div>
            
            <h3 className="font-semibold mb-2">{request.book.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{request.book.description}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {request.user.firstname[0]}
              </div>
              <span className="text-gray-700">
                {`${request.user.firstname} ${request.user.lastname}`}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Author: {request.book.author}</p>
              <p>Genre: {request.book.genre}</p>
              <p>Condition: {request.book.condition}</p>
              <p>Year: {request.book.year}</p>
            </div>
          </div>
          
          {request.status == 'Pending'  && (
            <div className="mt-4 flex gap-2">
              <MyButton
                onClick={() => handleAcceptRequest({
                    bookId: request.book._id,
                    requesterId: request.user._id,
                    status : "Accepted"
                })}
                btnText="Accept"
                style="bg-bgPrimary py-2 text-xs px-20 py-3 capitalize"
              />
              <MyButton
                onClick={() => handleRejectRequest({
                    bookId: request.book._id,
                    requesterId: request.user._id,
                    status : "Rejected"
                })}
                btnText="Reject"
                style="bg-bgSecondary text-bgPrimary border border-bgPrimary py-2 text-xs px-20 py-3 capitalize"
              />
            </div>
          )}
        </div>
      </div>
    );
}

  };

  return (
    <>
    <div className="w-full min-h-screen overflow-auto mx-auto py-4 px-8 md:px-20">
      <div className="border-b mb-6">
        <div className="flex">
          {['received', 'sent'].map((tab) => (
            <button 
              key={tab}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === tab ? 'border-b-2 border-bgPrimary text-bgPrimary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Requests
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'received' ? (
          RequestBooksList?.receivedRequests?.length > 0 ? (
            RequestBooksList.receivedRequests.map((request: any) => (
              <RequestCard key={request._id} request={request} type="received" />
            ))
          ) : (
            <div className="text-center py-10">
              <i className="fas fa-inbox text-gray-300 text-5xl mb-4"></i>
              <p className="text-gray-500">No received requests</p>
            </div>
          )
        ) : (
          RequestBooksList?.sentRequests?.length > 0 ? (
            RequestBooksList.sentRequests.map((request: any) => (
              <RequestCard key={request._id} request={request} type="sent" />
            ))
          ) : (
            <div className="text-center py-10">
              <i className="fas fa-paper-plane text-gray-300 text-5xl mb-4"></i>
              <p className="text-gray-500">No sent requests</p>
            </div>
          )
        )}
      </div>

      {isLoading && <Loader />}
    </div>
      <Footer />
      </>
  );
};

export default BookRequests;