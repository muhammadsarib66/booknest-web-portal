/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useRef, useState } from 'react';
import { searchIcon } from '../../assets/icons';
import { baseUrl, socket } from '../../redux/slices/Slicer';
import { useSelector } from 'react-redux';
import moment from 'moment';
// import { NoMessagesSVG } from '../../assets/svgs'; // Import your SVG component

const ChatScreen = () => {
  const { userDetail } = useSelector((state: any) => state.GetUserDetailSlice);
  const {sellerID} = useSelector((state: any) => state.BookSlicer);
  const [chatRooms, setChatRooms] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
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

  const handleShowRoomMessages = (room: any) => {
    socket.emit('get_chat_room_messages', room?._id);
    // console.log(room, 'room message')
    setSelectedRoom(room);

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


useEffect(()=>{
  if(sellerID) {
    const room = chatRooms.find((room:any) => room?.otherUser?._id === sellerID);
    if (room) {
      handleShowRoomMessages(room);
    }
  }
},[sellerID, chatRooms])


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
      setChatRooms(sortChatRooms(filtered));
    };

    const handleChatRoomMessages = (data: any) => {
      setMessages(data);
    };

    const handleReceivedMessage = (data: any) => {
      console.log(data , 'recovimg mesage' , messages)
      setMessages((prevMessages: any) => {
        const messageIndex = prevMessages.findIndex((msg: any) => 
          msg?.user?._id === data?.user?._id
        );

        if (messageIndex !== -1) {
          // Create new array with all previous messages
          const updatedMessages = [...prevMessages];
          // Push the new data
          updatedMessages.push(data);
          return updatedMessages;
        }
        
        return prevMessages;
      });
      
      // Update chat rooms to move the room to top
      setChatRooms((prevRooms:any) => {
        const updatedRooms = prevRooms.map((room:any) => {
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

      {/* Sidebar */}
      <div className="w-1/4 flex flex-col border-r border-gray-300 bg-white">
        {/* Sidebar Header - Fixed */}
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-bgPrimary text-white">
          <div className="flex items-center justify-between gap-4"></div>
          <div className="flex items-center flex-1 bg-bgPrimary rounded-md px-3 py-1">
            <div className='bg-bgPrimary flex items-center gap-2'>
              <img src={searchIcon} alt="Search Icon" className="w-5 h-5" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full focus:outline-none bg-transparent"
              />
            </div>
          </div>
        </header>

        {/* Contact List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {chatRooms?.map((room:any) => (
            <div 
              onClick={() => handleShowRoomMessages(room)} 
              key={room?._id} 
              className={`flex items-center p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                selectedRoom?._id === room._id ? 'bg-blue-50' : ''
              }`}
            >
              {room?.otherUser?.profileimage ? (
                <img
                  src={baseUrl + room?.otherUser.profileimage}
                  alt="User Profile"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg font-semibold mr-3">
                  {room?.otherUser?.firstname.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-md truncate">{room?.otherUser.firstname}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {room?.lastMessage?.createdAt ? moment(room?.lastMessage?.createdAt).fromNow() : ''}
                  </span>
                </div>
                <p className="text-gray-600 text-sm truncate">
                  {room?.lastMessage?.message || 'No message yet'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header - Fixed */}
            <header className="p-4 border-b border-gray-300 bg-white flex items-center">
              {selectedRoom?.otherUser?.profileimage ? (
                <img
                  src={baseUrl + selectedRoom?.otherUser.profileimage}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg font-semibold mr-3">
                  {selectedRoom?.otherUser?.firstname.charAt(0).toUpperCase()}
                </div>
              )}
              <h1 className="text-xl font-semibold">{selectedRoom?.otherUser?.firstname}</h1>
            </header>

            {/* Chat Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length > 0 ? (
                messages.map((message: any, index: number) => (
                  message?.user?._id === userDetail?._id ? (
                    // Outgoing Message
                    <div key={index} className="flex justify-end mb-4">
                      <div className="flex flex-col max-w-3/4 bg-bgPrimary text-white rounded-lg p-3">
                        <p>{message?.message}</p>
                        <span className="text-xs text-gray-500 mt-1">
                          {moment(message?.createdAt).fromNow()}
                        </span>
                      </div>
                   
                      <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        {userDetail?.profileimage ? (
                          <img 
                            src={baseUrl + userDetail?.profileimage} 
                            alt="My Avatar" 
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                            {userDetail?.firstname?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                  : (
                    // Incoming Message
                    <div key={index} className="flex mb-4">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        {message?.user?.profileimage ? (
                          <img 
                            src={baseUrl + message?.user?.profileimage} 
                            alt="User Avatar" 
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                            {message?.user?.firstname && message?.user?.firstname.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col max-w-3/4 bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-gray-700">{message?.message}</p>
                        <span className="text-xs text-gray-500 mt-1">
                          {moment(message?.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  )
                )
              ) ): (
                <div className="flex flex-col items-center justify-center h-full">
                  
                  {/* <NoMessagesSVG className="w-64 h-64 text-gray-300" /> */}
                  <p className="text-gray-500 mt-4">No messages yet</p>
                  <p className="text-gray-400 text-sm">Start the conversation</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input - Fixed */}
            <footer className="p-4 border-t border-gray-300 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-bgPrimary text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600 transition-colors"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            No Message 
            {/* <NoMessagesSVG className="w-64 h-64 text-gray-300" /> */}
            <p className="text-gray-500 mt-4">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>

  );
};



export default ChatScreen;