import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetNotificationsApi } from "../redux/slices/NotificationSlice";
import moment from "moment";

const AllNotifications = () => {
    const dispatch = useDispatch();
    const {getAllNotifications} = useSelector((state: any) => state.NotificationSlice);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // ...existing useEffect...

    const handleMenuClick = (notificationId: string) => {
        setOpenMenuId(openMenuId === notificationId ? null : notificationId);
    };

    const handleDeleteClick = (notificationId: string) => {
        console.log("Delete", notificationId);
        setOpenMenuId(null); // Close menu after delete action
    };
    useEffect(() => {
        dispatch(GetNotificationsApi() as any)
    }, [dispatch])

    return (
        <section className='min-h-screen bg-gray-50 py-8'>
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Notifications</h1>
            
            <div className="space-y-4">
                {getAllNotifications?.map((notification: any) => (
                    <div 
                        key={notification?._id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-start gap-3">
                            {/* User Avatar */}
                            <div className="w-10 h-10 rounded-full bg-bgPrimary flex items-center justify-center text-white font-semibold">
                                {notification?.sender?.firstname?.charAt(0)}
                            </div>
                            
                            {/* Notification Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-800">
                                            <span className="font-semibold">
                                                {notification?.sender?.firstname}
                                            </span>
                                            {' '}{notification?.message}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {moment(notification?.createdAt).fromNow()}
                                        </p>
                                    </div>
                                    
                                    {/* Menu Dropdown */}
                                    <div className="relative">
                                        <div
                                            onClick={() => handleMenuClick(notification?._id)}
                                            className="flex gap-1 cursor-pointer p-2"
                                        >
                                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                        </div>
                                        {openMenuId === notification?._id && (
                                            <div className="absolute right-0 top-8 w-32 bg-white shadow-lg rounded-md border border-gray-100">
                                                <button 
                                                    onClick={() => handleDeleteClick(notification?._id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {(!getAllNotifications || getAllNotifications.length === 0) && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    </section>
    );
}

export default AllNotifications;