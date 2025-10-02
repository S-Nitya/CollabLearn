import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CollabLearnLanding from './components/landingPage';
import LoginPage from './auth/login';
import SignupPage from './auth/signup';
import Dashboard from './components/dashboard';
import BrowseSkills from './components/browseSkills';
import CalendarPage from './components/calendar';
import CommunityPage from './components/community';
import Messages from './components/Messages';
import Achievements from './components/Achievements';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './auth/ProtectedRoute';
import MessagesPage from './components/Messages';

function App() {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<CollabLearnLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/browse-skills" element={<ProtectedRoute><BrowseSkills /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage/></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;