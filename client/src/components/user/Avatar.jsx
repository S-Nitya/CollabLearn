import React from 'react';

// Utility function to generate a color based on name
const getAvatarColor = (name) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#10AC84', '#EE5A6F', '#C44569', '#F8B500', '#6C5CE7',
    '#A29BFE', '#FD79A8', '#FDCB6E', '#E17055', '#00B894'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return colors[hash % colors.length];
};

// Utility function to get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Avatar component
export default function Avatar({ 
  src, 
  name, 
  size = 'md', 
  className = '',
  onClick,
  showUploadIcon = false 
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl',
    '2xl': 'w-32 h-32 text-2xl'
  };

  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white relative overflow-hidden transition-all duration-200 ${className}`;

  // If image source is provided and valid, show image
  if (src && src.trim() && src !== 'default') {
    return (
      <div className={`${baseClasses} ${onClick ? 'cursor-pointer hover:scale-105' : ''}`} onClick={onClick}>
        <img
          src={src}
          alt={name || 'Profile'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, hide it and show initials instead
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback initials (hidden by default) */}
        <div 
          className="absolute inset-0 flex items-center justify-center font-semibold text-white"
          style={{ 
            backgroundColor: getAvatarColor(name || 'User'),
            display: 'none'
          }}
        >
          {getInitials(name || 'User')}
        </div>
        {showUploadIcon && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  // Show initials with colored background
  return (
    <div 
      className={`${baseClasses} ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      style={{ backgroundColor: getAvatarColor(name || 'User') }}
      onClick={onClick}
    >
      {getInitials(name || 'User')}
      {showUploadIcon && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      )}
    </div>
  );
}

// Utility function to convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Utility function to validate image file
export const validateImageFile = (file) => {
  const errors = [];
  
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    errors.push('Please select a valid image file (JPEG, PNG, or WebP)');
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    errors.push('Image size must be less than 5MB');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};