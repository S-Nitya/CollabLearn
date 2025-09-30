const SignUpPage = ({ goToLogin }) => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #4b3f8e 0%, #6c63ff 100%)', // Blue/Purple Gradient
    fontFamily: 'sans-serif',
    padding: '20px',
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '40px 50px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxSizing: 'border-box',
    fontSize: '16px',
  };

  const primaryButtonStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '20px',
    backgroundColor: '#6c63ff', // Primary purple color
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };
  
  const linkStyle = {
    color: '#6c63ff',
    cursor: 'pointer',
    marginTop: '15px',
    display: 'block',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      {/* Updated Logo Component */}
      <CollablearnLogo />
      <p style={{ color: 'white', marginBottom: '30px', fontSize: '18px' }}>
        Start your learning journey today
      </p>

      <div style={cardStyle}>
        <h2 style={{ marginBottom: '25px', fontSize: '24px', fontWeight: '500' }}>Create Account</h2>
        
        <form>
          <input 
            type="text" 
            placeholder="Full Name" 
            style={inputStyle} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            style={inputStyle} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password (min 8 characters)" 
            style={inputStyle} 
            required 
          />
          
          <button type="submit" style={primaryButtonStyle}>
            Sign Up
          </button>
        </form>

        <a onClick={goToLogin} style={linkStyle}>
          Already have an account? **Sign In**
        </a>
      </div>

      <p style={{ color: 'white', marginTop: '30px', opacity: '0.8', fontSize: '14px' }}>
        &larr; Back to homepage
      </p>
    </div>
  );
};