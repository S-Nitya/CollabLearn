import React, { useState } from 'react';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    // Basic client-side validation
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Logic for handling signup (e.g., API call) would go here
    console.log('Signup attempt with:', { username, email, password });
    alert(`Attempting to sign up with Username: ${username}, Email: ${email}`);
    // You would typically redirect the user or show a success message here
  };

  // The 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc]' class mimics the purple/blue gradient from the footer.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#6a11cb] to-[#2575fc] p-4">
      
      {/* Signup Card: White background, rounded corners, and shadow, similar to testimonials */}
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full text-center">
        
        {/* Heading: Bold and large, matching the overall design feel */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Your Account</h2>
        
        <form onSubmit={handleSignup}>
          
          {/* Username Input Group */}
          <div className="mb-6 text-left">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2575fc] transition duration-200"
            />
          </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2575fc] transition duration-200"
            />
          </div>

          {/* Password Input Group */}
          <div className="mb-6 text-left">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2575fc] transition duration-200"
            />
          </div>

          {/* Confirm Password Input Group */}
          <div className="mb-8 text-left">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2575fc] transition duration-200"
            />
          </div>

          {/* Signup Button: Matches the button style and color */}
          <button 
            type="submit" 
            className="w-full py-3 bg-[#2575fc] text-white font-bold text-lg rounded-lg shadow-md hover:bg-[#6a11cb] transition duration-300 transform hover:scale-[1.01]"
          >
            Sign Up
          </button>

          {/* Already have an account? Link */}
          <p className="mt-6 text-gray-600 text-sm">
            Already have an account? 
            <a 
                href="#" 
                className="text-[#2575fc] font-semibold hover:underline ml-1"
                onClick={(e) => { e.preventDefault(); alert('Redirect to Login page'); }}
            >
                Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;