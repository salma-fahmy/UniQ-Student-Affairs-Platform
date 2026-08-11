import React from 'react';

import img from "../../assets/Logo/Logo_icon.png";

const Logoo = ({ textColor = "text-indigo-900" }) => {
  return (
    <div className="flex items-center space-x-2">
      <img src={img} alt="UNIQ Logo" className="h-9 w-9" />
      <span className={`text-xl font-bold font-['Clash_Display'] ${textColor}`}>
        UNIQ
      </span>
    </div>
  );
};

export default Logoo;