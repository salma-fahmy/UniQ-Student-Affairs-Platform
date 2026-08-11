import React, { useState } from 'react';

const sizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-20 w-20 text-xl',
};

const AvatarImage = ({ src, alt, imageClassName }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imageClassName}`.trim()}
    />
  );
};

const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '', imageClassName = '' }) => {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-400 shadow-[0_12px_28px_-14px_rgba(49,46,129,0.75)] ${sizeClasses[size] || sizeClasses.md} ${className}`.trim()}
    >
      {/* Default User SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="mt-2 h-[80%] w-[80%]"
        aria-hidden="true"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>

      <AvatarImage key={src} src={src} alt={alt} imageClassName={imageClassName} />
    </div>
  );
};

export default Avatar;