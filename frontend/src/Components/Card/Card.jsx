import React from 'react';

/**
 * Reusable card component.
 *
 * Props:
 *  - image, title, description, className  — as before
 *  - linkText   — label for the CTA button
 *  - targetId   — (optional) scroll to element with this id on click
 *  - onLinkClick — (optional) callback called on click (takes priority over targetId)
 *  - children   — optional extra content inside the card body
 */
const Card = ({
  image,
  title,
  description,
  linkText,
  targetId,
  onLinkClick,
  children,
  className = '',
}) => {
  const handleClick = (e) => {
    e.preventDefault();

    if (onLinkClick) {
      onLinkClick();
      return;
    }

    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const hasAction = linkText && (onLinkClick || targetId);

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${className}`}
    >
      {/* Image container */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent z-10" />
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {title && (
          <h3 className="font-playfair text-xl font-semibold text-indigo-900 mb-3">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {description}
          </p>
        )}
        {children}
        {hasAction && (
          <button
            onClick={handleClick}
            className="text-indigo-800 font-semibold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
          >
            {linkText}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-300 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  );
};

export default Card;