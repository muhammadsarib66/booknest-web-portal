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

  console.log(RequestBooksList, 'request books list')

  useEffect(()=>{
    dispatch(GetRequestBooksApi()as any)
  },[dispatch])

  const handleAcceptRequest = (requestData: any) => {
    console.log('Accepting request:', requestData);
    dispatch(HandleBookRequestApi(requestData) as any)
  };

  const handleRejectRequest = (requestData: any) => {
   console.log('Accepting request:', requestData);
   dispatch(HandleBookRequestApi(requestData) as any)
  };

  const RequestCard = ({ request, type }: { request: any, type: 'received' | 'sent' }) => {
    if (type === 'sent') {
      return (
        <div className="card card-hover animate-fade-in">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-64 h-48 lg:h-auto rounded-t-xl lg:rounded-l-xl lg:rounded-t-none overflow-hidden flex-shrink-0">
              <img 
                src={baseUrl + (request?.book?.images?.[0] || 'default-image.jpg')} 
                alt={request?.book?.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            <div className="flex flex-col p-4 lg:p-6 flex-grow justify-between">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="heading-3 text-primary-600">Rs {request?.book?.price}</h2>
                  <span className={`badge ${
                    request.status === 'Pending' ? 'badge-warning' :
                    request.status === 'Accepted' ? 'badge-success' :
                    'badge-error'
                  }`}>
                    {request.status}
                  </span>
                </div>
                
                <h3 className="heading-3">{request?.book?.title}</h3>
                <p className="body-medium text-secondary-600 line-clamp-2">{request?.book?.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user text-primary-500"></i>
                    <span className="text-secondary-700">{request?.book?.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-bookmark text-primary-500"></i>
                    <span className="text-secondary-700">{request?.book?.genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-star text-primary-500"></i>
                    <span className="text-secondary-700">{request?.book?.condition}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-calendar text-primary-500"></i>
                    <span className="text-secondary-700">{request?.book?.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="card card-hover animate-fade-in">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-64 h-48 lg:h-auto rounded-t-xl lg:rounded-l-xl lg:rounded-t-none overflow-hidden flex-shrink-0">
              <img 
                src={baseUrl + request.book.images[0]} 
                alt={request.book.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            <div className="flex flex-col p-4 lg:p-6 flex-grow justify-between">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="heading-3 text-primary-600">Rs {request.book.price}</h2>
                  <span className={`badge ${
                    request.status === 'Pending' ? 'badge-warning' :
                    request.status === 'Accepted' ? 'badge-success' :
                    'badge-error'
                  }`}>
                    {request.status}
                  </span>
                </div>
                
                <h3 className="heading-3">{request.book.title}</h3>
                <p className="body-medium text-secondary-600 line-clamp-2">{request.book.description}</p>
                
                {/* Requester Info */}
                <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-lg">
                    {request.user.firstname[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-800">
                      {`${request.user.firstname} ${request.user.lastname}`}
                    </p>
                    <p className="text-sm text-secondary-600">Book Requester</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user text-primary-500"></i>
                    <span className="text-secondary-700">{request.book.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-bookmark text-primary-500"></i>
                    <span className="text-secondary-700">{request.book.genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-star text-primary-500"></i>
                    <span className="text-secondary-700">{request.book.condition}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-calendar text-primary-500"></i>
                    <span className="text-secondary-700">{request.book.year}</span>
                  </div>
                </div>
              </div>
              
              {request.status === 'Pending' && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <MyButton
                    onClick={() => handleAcceptRequest({
                        bookId: request.book._id,
                        requesterId: request.user._id,
                        status : "Accepted"
                    })}
                    btnText="Accept Request"
                    style="btn-success w-full sm:w-auto"
                  />
                  <MyButton
                    onClick={() => handleRejectRequest({
                        bookId: request.book._id,
                        requesterId: request.user._id,
                        status : "Rejected"
                    })}
                    btnText="Reject Request"
                    style="btn-danger w-full sm:w-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/20">
        <div className="container-responsive section-padding">
          <div className="animate-fade-in">
            <h1 className="heading-1 text-center mb-8">Book Requests</h1>
            
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-soft p-1 mb-8 max-w-md mx-auto">
              <div className="flex">
                {['received', 'sent'].map((tab) => (
                  <button 
                    key={tab}
                    className={`flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      activeTab === tab 
                        ? 'bg-primary-500 text-white shadow-lg transform scale-105' 
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Requests
                  </button>
                ))}
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-6">
              {activeTab === 'received' ? (
                RequestBooksList?.receivedRequests?.length > 0 ? (
                  RequestBooksList.receivedRequests.map((request: any) => (
                    <RequestCard key={request._id} request={request} type="received" />
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
                    <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-inbox text-secondary-400 text-3xl"></i>
                    </div>
                    <h3 className="heading-3 mb-2">No Received Requests</h3>
                    <p className="body-medium text-secondary-600">You haven't received any book requests yet.</p>
                  </div>
                )
              ) : (
                RequestBooksList?.sentRequests?.length > 0 ? (
                  RequestBooksList.sentRequests.map((request: any) => (
                    <RequestCard key={request._id} request={request} type="sent" />
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
                    <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-paper-plane text-secondary-400 text-3xl"></i>
                    </div>
                    <h3 className="heading-3 mb-2">No Sent Requests</h3>
                    <p className="body-medium text-secondary-600">You haven't sent any book requests yet.</p>
                  </div>
                )
              )}
            </div>

            {isLoading && <Loader />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookRequests;