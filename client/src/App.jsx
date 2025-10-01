import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CollabLearnLanding from './components/landingPage';
import LoginPage from './auth/login';
import SignupPage from './auth/signup';

function App() {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<CollabLearnLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;