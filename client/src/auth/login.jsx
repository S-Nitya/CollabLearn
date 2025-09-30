const LoginPage = ({ goToSignUp }) => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-5 
                 bg-gradient-to-br from-[#4b3f8e] to-[#6c63ff] 
                 font-sans"
    >
      <CollablearnLogo />
      <p className="text-white mb-8 text-lg">
        Welcome back to your learning journey
      </p>

      <div 
        className="bg-white p-10 rounded-xl shadow-xl text-center 
                   w-full max-w-md"
      >
        <h2 className="mb-6 text-3xl font-semibold text-gray-800">Sign In</h2>
        
        <form>
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#6c63ff]" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#6c63ff]" 
            required 
          />
          
          <div className="flex items-center justify-start mb-4">
            <input 
              type="checkbox" 
              id="remember" 
              className="mr-2 h-4 w-4 text-[#6c63ff] rounded 
                         focus:ring-[#6c63ff] border-gray-300" 
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full p-3 mt-4 bg-[#6c63ff] text-white font-bold 
                       rounded-lg hover:bg-[#5a4cb3] transition duration-300 
                       focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
          >
            Sign In
          </button>
        </form>

        <a 
          onClick={goToSignUp} 
          className="text-[#6c63ff] cursor-pointer mt-6 block text-sm font-medium 
                     hover:underline"
        >
          Don't have an account? <span className="font-bold">Sign Up</span>
        </a>
      </div>

      <p className="text-white mt-8 opacity-80 text-sm">
        &larr; Back to homepage
      </p>
    </div>
  );
}; 

export default LoginPage;