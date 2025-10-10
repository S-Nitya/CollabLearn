import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import MainNavbar from "../../navbar/mainNavbar.jsx";

const SOCKET_SERVER_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api';

const getLoggedInUserId = () => {
  return localStorage.getItem('userId');
};

const MessagesPage = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const activeContactIdRef = useRef(activeContactId);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const userId = getLoggedInUserId();
    if (!userId) {
      console.error('No logged-in user found!');
      return;
    }
    setLoggedInUserId(userId);
    console.log('Logged in user ID:', userId);
  }, []);

  useEffect(() => {
    activeContactIdRef.current = activeContactId;
  }, [activeContactId]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!loggedInUserId) return;
    
    setLoadingContacts(true);
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(users => {
        const withMeta = users.map(u => ({ ...u, latestMessage: "", unread: 0 }));
        setContacts(withMeta);
        setLoadingContacts(false);
      })
      .catch(() => setLoadingContacts(false));
  }, [loggedInUserId]);

  useEffect(() => {
    if (!activeContactId || !loggedInUserId) {
      setMessages([]); // Clear messages when no contact is active
      return;
    }
    const chatId = [loggedInUserId, activeContactId].sort().join('_');
    fetch(`${API_URL}/messages/${chatId}`)
      .then(res => res.json())
      .then(msgs => {
        console.log('Loaded messages:', msgs);
        setMessages(msgs);
      });

    setContacts(prev =>
      prev.map(c =>
        c._id === activeContactId ? { ...c, unread: 0 } : c
      )
    );
  }, [activeContactId, loggedInUserId]);

  useEffect(() => {
    if (!loggedInUserId) return;

    socketRef.current = io(SOCKET_SERVER_URL);

    const handleIncomingMessage = (msg) => {
      const currentActiveId = activeContactIdRef.current;
      const currentChatId = currentActiveId
        ? [loggedInUserId, currentActiveId].sort().join("_")
        : null;

      console.log('📨 Received message:', {
        text: msg.text,
        senderId: msg.senderId,
        chatId: msg.chatId,
        loggedInUser: loggedInUserId,
        isFromMe: msg.senderId === loggedInUserId
      });

      if (msg.chatId === currentChatId) {
        setMessages((prev) => [...prev, msg]);
        setIsTyping(false); // Stop typing indicator when message is received
      }

      setContacts((prevContacts) =>
        prevContacts.map((c) => {
          if (msg.chatId.includes(c._id) && c._id !== loggedInUserId) {
            return {
              ...c,
              latestMessage: msg.text,
              unread:
                msg.chatId !== currentChatId
                  ? (c.unread || 0) + 1
                  : c.unread || 0,
            };
          }
          return c;
        })
      );
    };

    // Listen for typing events
    const handleUserTyping = (data) => {
      const currentActiveId = activeContactIdRef.current;
      const currentChatId = currentActiveId
        ? [loggedInUserId, currentActiveId].sort().join("_")
        : null;

      if (data.chatId === currentChatId && data.userId !== loggedInUserId) {
        setIsTyping(true);
        
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    const handleUserStoppedTyping = (data) => {
      const currentActiveId = activeContactIdRef.current;
      const currentChatId = currentActiveId
        ? [loggedInUserId, currentActiveId].sort().join("_")
        : null;

      if (data.chatId === currentChatId && data.userId !== loggedInUserId) {
        setIsTyping(false);
      }
    };

    socketRef.current.on("chat message", handleIncomingMessage);
    socketRef.current.on("user typing", handleUserTyping);
    socketRef.current.on("user stopped typing", handleUserStoppedTyping);

    return () => {
      socketRef.current.off("chat message", handleIncomingMessage);
      socketRef.current.off("user typing", handleUserTyping);
      socketRef.current.off("user stopped typing", handleUserStoppedTyping);
      socketRef.current.disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [loggedInUserId]);

  useEffect(() => {
    if (!activeContactId || !socketRef.current || !loggedInUserId) return;
    const chatId = [loggedInUserId, activeContactId].sort().join('_');
    console.log('🔗 Joining room:', chatId);
    socketRef.current.emit("joinRoom", chatId);
    
    setIsTyping(false);
    
    return () => {
      socketRef.current.emit("leaveRoom", chatId);
    };
  }, [activeContactId, loggedInUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeContactId || !loggedInUserId) return;
    
    const chatId = [loggedInUserId, activeContactId].sort().join('_');
    const newMessage = {
      chatId,
      senderId: loggedInUserId,
      text: messageInput.trim(),
      time: new Date().toISOString(),
    };
    
    console.log('📤 Sending message:', newMessage);
    socketRef.current.emit('chat message', newMessage);

    socketRef.current.emit('stopped typing', { chatId, userId: loggedInUserId });

    setMessages((prev) => [...prev, newMessage]);
    setContacts(prev =>
      prev.map(c =>
        c._id === activeContactId
          ? { ...c, latestMessage: newMessage.text }
          : c
      )
    );
    setMessageInput('');
  };

  // Handle typing indicator
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    if (!activeContactId || !loggedInUserId) return;
    
    const chatId = [loggedInUserId, activeContactId].sort().join('_');
    socketRef.current.emit('typing', { chatId, userId: loggedInUserId });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stopped typing', { chatId, userId: loggedInUserId });
    }, 2000);
  };

  const ChatBubble = ({ message, index }) => {
    if (!loggedInUserId) return null;
    
    const msgSenderId = String(message.senderId).trim();
    const loggedInId = String(loggedInUserId).trim();
    const isSent = msgSenderId === loggedInId;
    
    console.log('💬 Rendering bubble:', {
      text: message.text,
      msgSenderId,
      loggedInId,
      isSent
    });
    
    return (
      <div 
        className={`flex mb-4 ${isSent ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl text-white shadow-lg transform transition-all duration-200 hover:scale-102 ${
          isSent 
            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 rounded-br-none hover:shadow-xl' 
            : 'bg-gradient-to-br from-gray-700 to-gray-800 rounded-tl-none hover:shadow-xl'
        }`}>
          <p className="text-sm">{message.text}</p>
          <p className="text-xs mt-1 text-right opacity-70">
            {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  };

  if (!loggedInUserId) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <style>
        {`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
          .contact-item { transition: all 0.2s ease; }
          .contact-item:hover { transform: translateX(2px); background-color: #f8fafc; }
          .send-button { transition: all 0.2s ease; }
          .send-button:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); }
          .send-button:active:not(:disabled) { transform: scale(0.95); }
          .online-dot { animation: pulse 3s ease-in-out infinite; }
          @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.6;} }
          .skeleton { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation: loading 1.5s ease-in-out infinite; }
          @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          .typing-indicator { display: flex; align-items: center; gap: 4px; }
          .typing-dot { width: 8px; height: 8px; border-radius: 50%; background-color: #9ca3af; animation: typing 1.4s infinite; }
          .typing-dot:nth-child(1){animation-delay:0s;} .typing-dot:nth-child(2){animation-delay:0.2s;} .typing-dot:nth-child(3){animation-delay:0.4s;}
          @keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:0.7;} 30%{transform:translateY(-10px);opacity:1;} }
        `}
      </style>
      <div className="flex-1 flex flex-col overflow-auto">
        <MainNavbar />
        <main className="flex-1 p-6 bg-slate-50 mt-20">
          <div className="flex h-[calc(100vh-160px)] rounded-xl shadow-lg overflow-hidden">
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 bg-white border-r overflow-y-auto">
              <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-white">
                <input type="text" placeholder="Search contacts..."
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 transition-all duration-300"/>
              </div>
              {loadingContacts ? (
                <>
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="flex items-center p-4 border-b">
                      <div className="skeleton h-10 w-10 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="skeleton h-4 w-24 mb-2 rounded"></div>
                        <div className="skeleton h-3 w-32 rounded"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                contacts.map((user) => (
                  <div key={user._id}
                    className={`contact-item flex items-center justify-between p-4 cursor-pointer ${user._id === activeContactId ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                    onClick={() => setActiveContactId(user._id)}>
                    <div className="flex items-center">
                      <div className="relative">
                        <img src={user.avatar || `https://i.pravatar.cc/40?u=${user._id}`}
                             alt={user.name}
                             className="h-10 w-10 rounded-full mr-3 ring-2 ring-white shadow-md"
                             onError={(e) => {
                               if (!e.target.src.includes('pravatar.cc')) {
                                 e.target.src = `https://i.pravatar.cc/40?u=${user._id}`;
                               }
                             }}/>
                        <div className="online-dot absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600 truncate w-32">
                          {user.latestMessage || user.email}
                        </p>
                      </div>
                    </div>
                    {user.unread > 0 && (
                      <span className="ml-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        {user.unread}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Chat window */}
            <div className="w-full lg:w-2/4 flex flex-col bg-white">
              <div className="p-4 border-b flex items-center bg-gradient-to-r from-indigo-50 to-white shadow-sm">
                {activeContactId ? (
                  <div className="flex items-center">
                    <div className="relative">
                      <img src={(contacts.find(u => u._id === activeContactId)?.avatar) || `https://i.pravatar.cc/40?u=${activeContactId}`}
                           alt="avatar"
                           className="h-10 w-10 rounded-full mr-3 ring-2 ring-indigo-200 shadow-md"
                           onError={(e) => {
                            const activeContact = contacts.find(u => u._id === activeContactId);
                            if (activeContact && !e.target.src.includes('pravatar.cc')) {
                                e.target.src = `https://i.pravatar.cc/40?u=${activeContact._id}`;
                            }
                         }}/>
                      <div className="online-dot absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{contacts.find(u => u._id === activeContactId)?.name}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <span className="online-dot w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Active now
                      </p>
                    </div>
                  </div>
                ) : <span>Select a contact to chat</span>}
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
                {activeContactId ? (
                  <>
                    {messages.map((msg, idx) => (
                      <ChatBubble key={msg._id || idx} message={msg} index={idx}/>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start mb-3">
                        <div className="bg-gray-200 px-3 py-2 rounded-xl text-gray-600 flex items-center typing-indicator">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <svg className="w-24 h-24 mb-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    <h2 className="text-2xl font-semibold text-indigo-700">Welcome to CollabLearn Messages</h2>
                    <p className="mt-2">Select a conversation to start chatting.</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white shadow-lg">
                <div className="flex items-center space-x-3">
                  <input type="text" placeholder="Type a message..."
                    value={messageInput}
                    onChange={handleInputChange}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300"
                    disabled={!activeContactId}/>
                  <button type="submit"
                    className="send-button p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-md"
                    disabled={!messageInput.trim() || !activeContactId}>
                    ➤
                  </button>
                </div>
              </form>
            </div>

            {/* Right panel */}
            <div className="hidden lg:block lg:w-1/4 bg-white p-6 overflow-y-auto border-l">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-800">Chat Details</h3>
              {activeContactId ? (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img src={(contacts.find(u => u._id === activeContactId)?.avatar) || `https://i.pravatar.cc/80?u=${activeContactId}`}
                        alt="avatar"
                        className="h-20 w-20 rounded-full mb-3 ring-4 ring-indigo-100 shadow-lg"
                        onError={(e) => {
                            const activeContact = contacts.find(u => u._id === activeContactId);
                            if (activeContact && !e.target.src.includes('pravatar.cc')) {
                                e.target.src = `https://i.pravatar.cc/80?u=${activeContact._id}`;
                            }
                        }}/>
                    <div className="online-dot absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <h4 className="font-bold text-gray-800">{contacts.find(u => u._id === activeContactId)?.name}</h4>
                  <p className="text-gray-500 mb-4">{contacts.find(u => u._id === activeContactId)?.email}</p>
                  <div className="w-full">
                    <h5 className="font-semibold mb-2 text-gray-700">Shared Files</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {[1,2,3,4,5,6].map((i) => (
                        <div key={i} className="bg-gray-100 rounded-lg p-2 aspect-square flex items-center justify-center hover:bg-gray-200 transition">
                          📄
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Select a conversation to view details</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;