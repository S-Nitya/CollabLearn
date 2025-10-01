import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again later.');
    }
  };

  // The 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc]' class mimics the purple/blue gradient from the footer.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#6a11cb] to-[#2575fc] p-4">
      
      {/* Login Card: White background, rounded corners, and shadow, similar to testimonials */}
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
        <div className="text-left mb-8">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600 transition">
            &larr; Back to Home
          </Link>
        </div>
        {/* Heading: Bold and large, matching the overall design feel */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Welcome Back!</h2>
        
        <form onSubmit={handleLogin}>
          
          {/* Email Input Group */}
          <div className="mb-6 text-left">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              // Clean input styling: focus-ring to match blue/purple
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2575fc] transition duration-200"
            />
          </div>

          {/* Password Input Group */}
          <div className="mb-8 text-left">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              // Clean input styling
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2575fc] transition duration-200"
            />
          </div>

          {/* Login Button: Matches the "Get Started for Free" button style and color */}
          <button 
            type="submit" 
            // Button style uses the blue color from the gradient for vibrancy
            className="w-full py-3 bg-[#2575fc] text-white font-bold text-lg rounded-lg shadow-md hover:bg-[#6a11cb] transition duration-300 transform hover:scale-[1.01]"
          >
            Log In
          </button>

          {/* Forgot Password Link: Uses the darker purple color for contrast */}
          <a 
            href="#" 
            className="block mt-4 text-sm text-[#6a11cb] hover:underline text-center"
            onClick={(e) => { e.preventDefault(); alert('Forgot Password functionality TBD'); }}
          >
            Forgot Password?
          </a>
          
          {/* Sign Up Link */}
          <p className="mt-6 text-gray-600 text-sm text-center">
            Don't have an account? 
            <Link 
                to="/signup" 
                className="text-[#2575fc] font-semibold hover:underline ml-1"
            >
                Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;