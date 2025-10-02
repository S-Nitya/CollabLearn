import React, { useState } from 'react';
import MainNavbar from "../navbar/mainNavbar.jsx"; 
// Note: Ensure MainNavbar is correctly defined and exported as default from '../navbar/mainNavbar.jsx'

const MOCK_CURRENT_USER_ID = 1; // Our user ID

const MessagesPage = () => {
    // --- MOCK DATA ---
    const [conversations, setConversations] = useState([
        { id: 1, name: 'Marcus Johnson', lastMessage: 'See you tomorrow at 10 AM.', time: '10:30 AM', unread: 2, avatar: 'https://i.pravatar.cc/32?img=1', skill: 'Learning: React Hooks', online: true, messages: [
            { id: 101, senderId: MOCK_CURRENT_USER_ID, text: 'Hi Marcus, just confirming our session tomorrow. Are you ready for the deep dive on custom hooks?', time: '10:05 AM' },
            { id: 102, senderId: 2, text: 'I am! Looking forward to it.', time: '10:08 AM' },
            { id: 103, senderId: MOCK_CURRENT_USER_ID, text: 'See you tomorrow at 10 AM.', time: '10:10 AM' },
        ]},
        { id: 2, name: 'Sarah Chen', lastMessage: 'The fundamentals link worked, thanks!', time: 'Yesterday', unread: 0, avatar: 'https://i.pravatar.cc/32?img=2', skill: 'Tutoring: Data Structures', online: false, lastOnline: 'Last seen 2h ago', messages: [
            { id: 201, senderId: 2, text: 'Did you manage to open the fundamentals document?', time: 'Yesterday' },
            { id: 202, senderId: MOCK_CURRENT_USER_ID, text: 'The link worked, thanks!', time: 'Yesterday' },
        ]},
        // ... other conversations can be added here
    ]);

    const [activeChatId, setActiveChatId] = useState(1); // Start with the first conversation active
    const [messageInput, setMessageInput] = useState('');

    // --- DERIVED STATE ---
    const activeChat = conversations.find(chat => chat.id === activeChatId);

    // --- HANDLERS ---
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newConversations = conversations.map(chat => {
            if (chat.id === activeChatId) {
                const newMessage = {
                    id: Date.now(),
                    senderId: MOCK_CURRENT_USER_ID,
                    text: messageInput.trim(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                
                return {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: messageInput.trim(),
                    time: newMessage.time, // Update the time in the sidebar
                };
            }
            return chat;
        });

        setConversations(newConversations);
        setMessageInput(''); // Clear the input field
    };

    const ChatBubble = ({ message }) => {
        const isSent = message.senderId === MOCK_CURRENT_USER_ID;
        
        return (
            <div className={`flex mb-4 ${isSent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl text-white shadow-md ${
                    isSent 
                        ? 'bg-indigo-600 rounded-br-none' 
                        : 'bg-gray-700 text-white rounded-tl-none'
                }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${isSent ? 'text-indigo-200' : 'text-gray-400'} text-right`}>{message.time}</p>
                </div>
            </div>
        );
    };

    // --- RENDER ---
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <div className="flex-1 flex flex-col overflow-auto">
                <MainNavbar />
                
                <main className="flex-1 p-6 bg-gray-100">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>
                    
                    {/* Main Messaging Grid */}
                    <div className="flex h-[calc(100vh-160px)] rounded-xl shadow-lg overflow-hidden">
                        
                        {/* 1. Conversation List Sidebar (1/4 width) */}
                        <div className="w-full lg:w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
                            <div className="p-4 border-b border-gray-200">
                                <input 
                                    type="text" 
                                    placeholder="Search chats..." 
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            
                            {conversations.map(chat => (
                                <div 
                                    key={chat.id}
                                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${chat.id === activeChatId ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'}`}
                                    onClick={() => setActiveChatId(chat.id)} // FUNCTIONAL: Change active chat
                                >
                                    <img src={chat.avatar} alt={chat.name} className="h-10 w-10 rounded-full mr-3 object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className={`font-semibold text-gray-800 truncate ${chat.unread > 0 && chat.id !== activeChatId ? 'text-indigo-700' : ''}`}>{chat.name}</p>
                                            <p className="text-xs text-gray-500">{chat.time}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                                            {chat.unread > 0 && chat.id !== activeChatId && (
                                                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                    {chat.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. Main Chat Window (2/4 width on large screens) */}
                        <div className="w-full lg:w-2/4 flex flex-col bg-white border-r border-gray-200">
                            
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
                                <div className="flex items-center">
                                    <img src={activeChat.avatar} alt={activeChat.name} className="h-10 w-10 rounded-full mr-3 object-cover border-2 border-indigo-500" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-lg">{activeChat.name}</p>
                                        <p className="text-sm text-gray-500">{activeChat.skill}</p>
                                    </div>
                                </div>
                                <button className="text-gray-500 hover:text-indigo-600">
                                    <span className="material-icons-outlined text-2xl">&#9742;</span>
                                </button>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                                {activeChat.messages.map(msg => (
                                    <ChatBubble key={msg.id} message={msg} />
                                ))}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex items-center space-x-3">
                                    <input 
                                        type="text" 
                                        placeholder="Type your message..." 
                                        value={messageInput} // FUNCTIONAL: Controlled component
                                        onChange={(e) => setMessageInput(e.target.value)} // FUNCTIONAL: Update state on change
                                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button 
                                        type="submit" // FUNCTIONAL: Triggers form submission
                                        className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:opacity-50"
                                        disabled={!messageInput.trim()} // Disable if input is empty
                                    >
                                        <span className="material-icons-outlined text-xl">&#x27A4;</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 3. Details Panel (1/4 width on large screens) */}
                        <div className="hidden lg:block lg:w-1/4 bg-white p-6 overflow-y-auto">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Chat Details</h3>
                            
                            {/* User Info */}
                            <div className="flex flex-col items-center mb-6">
                                <img src={activeChat.avatar} alt={activeChat.name} className="h-20 w-20 rounded-full mb-3 object-cover border-4 border-indigo-100" />
                                <p className="font-bold text-xl text-gray-800">{activeChat.name}</p>
                                <p className="text-sm text-gray-500">{activeChat.skill}</p>
                                <p className={`text-xs font-medium mt-1 ${activeChat.online ? 'text-green-500' : 'text-gray-500'}`}>
                                    {activeChat.online ? '• Online' : activeChat.lastOnline || 'Offline'}
                                </p>
                            </div>

                            {/* Quick Actions and Shared Files remain static for this iteration */}
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-center py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium">
                                    <span className="material-icons-outlined text-xl mr-2">&#128197;</span> View Calendar
                                </button>
                                <button className="w-full flex items-center justify-center py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium">
                                    <span className="material-icons-outlined text-xl mr-2">&#128200;</span> View Profile
                                </button>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-3">Shared Files (3)</h4>
                                <div className="space-y-2 text-sm text-blue-600">
                                    <p className="truncate hover:underline cursor-pointer">&#128193; react-notes.pdf</p>
                                    <p className="truncate hover:underline cursor-pointer">&#128279; context-api-link.com</p>
                                    <p className="truncate hover:underline cursor-pointer">&#128459; session-summary.txt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MessagesPage;