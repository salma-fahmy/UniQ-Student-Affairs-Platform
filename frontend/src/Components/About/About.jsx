import React from 'react';

const About = ({
  image,
  title,
  description,
  stats = [],
  reverse = false,
  badgeText = "ABOUT US"
}) => {
  return (
    <div className={`grid md:grid-cols-2 items-center gap-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      {/* Image Column */}
      <div className={`relative ${reverse ? 'md:order-2' : ''}`}>
        {/* Gradient background shape (like HeroSection) */}
        <div className="absolute w-[520px] h-[420px] bg-gradient-to-br from-indigo-200/40 to-indigo-300/20 rounded-[40px] -z-10 translate-x-12 translate-y-12 blur-sm"></div>
        
        <div className="relative w-full h-[480px] rounded-[10px] overflow-hidden border border-white/40 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)]">
          <div className="absolute inset-0 bg-indigo-900/5 z-10"></div>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition duration-700 hover:scale-105"
          />
        </div>
      </div>

      {/* Content Column */}
      <div className={reverse ? 'md:order-1' : ''}>
        <p className="text-sm tracking-widest font-semibold text-indigo-800 relative inline-block mb-8">
          {badgeText}
          <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-indigo-800"></span>
        </p>

        <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-indigo-900 leading-[1.1] mb-8">
          {title}
        </h2>

        <p className="text-gray-800 mb-10 leading-relaxed font-['Open_Sans']">
          {description}
        </p>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="flex gap-12 mt-10">
            {stats.map((stat, index) => (
              <div key={index}>
                <h3 className="text-3xl font-semibold text-indigo-800">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;