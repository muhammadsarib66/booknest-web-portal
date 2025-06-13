/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { searchIcon } from '../../assets/icons';
import { baseUrl, socket } from '../../redux/slices/Slicer';
import { useSelector } from 'react-redux';
import moment from 'moment';
// import { NoMessagesSVG } from '../../assets/svgs'; // Import your SVG component

const ChatScreen = () => {
  const { userDetail } = useSelector((state: any) => state.GetUserDetailSlice);
  const { sellerID } = useSelector((state: any) => state.BookSlicer);
  const [chatRooms, setChatRooms] = useState<any>([]);
  const [filteredChatRooms, setFilteredChatRooms] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showChat, setShowChat] = useState<boolean>(false); // For mobile view toggle
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState<string>('');

  // Sort chat rooms by last message time (newest first)
  const sortChatRooms = (rooms: any[]) => {
    return rooms.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  };

  // Filter chat rooms based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChatRooms(chatRooms);
    } else {
      const filtered = chatRooms.filter((room: any) =>
        room?.otherUser?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room?.otherUser?.lastname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChatRooms(filtered);
    }
  }, [searchQuery, chatRooms]);

  const handleShowRoomMessages = (room: any) => {
    socket.emit('get_chat_room_messages', room?._id);
    setSelectedRoom(room);
    setShowChat(true); // Show chat view on mobile
  };

  const handleBackToContacts = () => {
    setShowChat(false);
    setSelectedRoom(null);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom || !userDetail) return;

    socket.emit('send_message', {
      senderId: userDetail?._id,
      receiverId: selectedRoom?.otherUser?._id,
      message: newMessage
    });

    setNewMessage('');
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (sellerID) {
      const room = chatRooms.find((room: any) => room?.otherUser?._id === sellerID);
      if (room) {
        handleShowRoomMessages(room);
      }
    }
  }, [sellerID, chatRooms]);

  useEffect(() => {
    const handleChatRooms = (data: any) => {
      const filtered = data.map((room: any) => {
        const otherUser = room?.sender?._id === userDetail?._id ? room?.receiver : room?.sender;
        return {
          lastMessage: room?.lastMessage || {},
          otherUser: otherUser,
          _id: room._id
        };
      });
      const sortedRooms = sortChatRooms(filtered);
      setChatRooms(sortedRooms);
      setFilteredChatRooms(sortedRooms);
    };

    const handleChatRoomMessages = (data: any) => {
      setMessages(data);
    };

    const handleReceivedMessage = (data: any) => {
      console.log(data, 'receiving message', messages);
      setMessages((prevMessages: any) => {
        const messageIndex = prevMessages.findIndex((msg: any) =>
          msg?.user?._id === data?.user?._id
        );

        if (messageIndex !== -1) {
          const updatedMessages = [...prevMessages];
          updatedMessages.push(data);
          return updatedMessages;
        }

        return prevMessages;
      });

      // Update chat rooms to move the room to top
      setChatRooms((prevRooms: any) => {
        const updatedRooms = prevRooms.map((room: any) => {
          if (room._id === data.roomId) {
            return {
              ...room,
              lastMessage: data
            };
          }
          return room;
        });
        return sortChatRooms(updatedRooms);
      });
    };

    socket.on('chat_rooms', handleChatRooms);
    socket.on('chat_room_messages', handleChatRoomMessages);
    socket.on('received_message', handleReceivedMessage);

    if (userDetail?._id) {
      socket.emit('get_chat_rooms', userDetail._id);
    }

    return () => {
      socket.off('chat_rooms', handleChatRooms);
      socket.off('chat_room_messages', handleChatRoomMessages);
      socket.off('received_message', handleReceivedMessage);
    };
  }, [userDetail]);

  // console.log(messages[2])
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Hidden on mobile when chat is shown */}
      <div className={`${showChat ? 'hidden' : 'flex'} lg:flex w-full lg:w-1/4 flex-col border-r border-gray-300 bg-white`}>
        {/* Sidebar Header - Fixed */}
        <header className="p-4 border-b border-gray-300 bg-bgPrimary text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex items-center flex-1 max-w-xs lg:max-w-none bg-white/20 rounded-md px-3 py-2 ml-4">
              <img src={searchIcon} alt="Search Icon" className="w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full focus:outline-none bg-transparent placeholder-white/70 text-white text-sm"
              />
            </div>
          </div>
        </header>

        {/* Contact List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {filteredChatRooms?.length > 0 ? (
            filteredChatRooms.map((room: any) => (
              <div
                onClick={() => handleShowRoomMessages(room)}
                key={room?._id}
                className={`flex items-center p-3 sm:p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedRoom?._id === room._id ? 'bg-blue-50 border-l-4 border-l-bgPrimary' : ''
                }`}
              >
                {room?.otherUser?.profileimage ? (
                  <img
                    src={baseUrl + room?.otherUser.profileimage}
                    alt="User Profile"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover mr-3 border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-bgPrimary flex items-center justify-center text-white text-lg font-semibold mr-3">
                    {room?.otherUser?.firstname?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm sm:text-md text-gray-800 truncate">
                      {room?.otherUser?.firstname} {room?.otherUser?.lastname}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {room?.lastMessage?.createdAt ? moment(room?.lastMessage?.createdAt).format('MMM DD') : ''}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm truncate mt-1">
                    {room?.lastMessage?.message || 'Start a conversation...'}
                  </p>
                  <span className="text-xs text-gray-400">
                    {room?.lastMessage?.createdAt ? moment(room?.lastMessage?.createdAt).fromNow() : ''}
                  </span>
                </div>
                <div className="lg:hidden ml-2">
                  <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-search text-gray-400 text-xl"></i>
              </div>
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No contacts found' : 'No conversations yet'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery ? 'Try a different search term' : 'Start chatting with book sellers'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area - Hidden on mobile when contacts are shown */}
      <div className={`${!showChat ? 'hidden' : 'flex'} lg:flex flex-1 flex-col`}>
        {selectedRoom ? (
          <>
            {/* Chat Header - Fixed */}
            <header className="p-3 sm:p-4 border-b border-gray-300 bg-white shadow-sm">
              <div className="flex items-center">
                {/* Back button for mobile */}
                <button
                  onClick={handleBackToContacts}
                  className="lg:hidden mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <i className="fas fa-arrow-left text-gray-600"></i>
                </button>
                
                {selectedRoom?.otherUser?.profileimage ? (
                  <img
                    src={baseUrl + selectedRoom?.otherUser.profileimage}
                    alt="User Profile"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-bgPrimary flex items-center justify-center text-white text-lg font-semibold mr-3">
                    {selectedRoom?.otherUser?.firstname?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {selectedRoom?.otherUser?.firstname} {selectedRoom?.otherUser?.lastname}
                  </h1>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
                
                {/* More options button */}
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <i className="fas fa-ellipsis-v text-gray-600"></i>
                </button>
              </div>
            </header>

            {/* Chat Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-b from-gray-50 to-gray-100">
              {messages.length > 0 ? (
                messages.map((message: any, index: number) => (
                  message?.user?._id === userDetail?._id ? (
                    // Outgoing Message
                    <div key={index} className="flex justify-end mb-3 sm:mb-4">
                      <div className="flex flex-col max-w-[85%] sm:max-w-[70%]">
                        <div className="bg-bgPrimary text-white rounded-2xl rounded-br-md p-3 shadow-sm">
                          <p className="text-sm sm:text-base break-words">{message?.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 text-right">
                          {moment(message?.createdAt).format('HH:mm')}
                        </span>
                      </div>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                        {userDetail?.profileimage ? (
                          <img
                            src={baseUrl + userDetail?.profileimage}
                            alt="My Avatar"
                            className="w-full h-full rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-bgPrimary flex items-center justify-center text-white text-sm font-semibold">
                            {userDetail?.firstname?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Incoming Message
                    <div key={index} className="flex mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        {message?.user?.profileimage ? (
                          <img
                            src={baseUrl + message?.user?.profileimage}
                            alt="User Avatar"
                            className="w-full h-full rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-semibold">
                            {message?.user?.firstname?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col max-w-[85%] sm:max-w-[70%]">
                        <div className="bg-white rounded-2xl rounded-bl-md p-3 shadow-sm border border-gray-100">
                          <p className="text-sm sm:text-base text-gray-700 break-words">{message?.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {moment(message?.createdAt).format('HH:mm')}
                        </span>
                      </div>
                    </div>
                  )
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-comments text-gray-400 text-2xl sm:text-3xl"></i>
                  </div>
                  <p className="text-gray-500 font-medium text-lg">No messages yet</p>
                  <p className="text-gray-400 text-sm mt-1">Start the conversation with {selectedRoom?.otherUser?.firstname}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input - Fixed */}
            <footer className="p-3 sm:p-4 border-t border-gray-300 bg-white">
              <div className="flex items-center space-x-2">
                <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent focus:outline-none text-sm sm:text-base"
                  />
                  <button className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <i className="fas fa-paperclip text-gray-500"></i>
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className={`p-3 rounded-full transition-all ${
                    newMessage.trim()
                      ? 'bg-bgPrimary text-white hover:bg-blue-600 shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!newMessage.trim()}
                >
                  <i className="fas fa-paper-plane text-sm"></i>
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-comment-dots text-gray-400 text-3xl sm:text-4xl"></i>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Welcome to BookNest Chat</h3>
            <p className="text-gray-500 text-sm sm:text-base max-w-md">
              Select a conversation from the sidebar to start messaging with other book lovers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;