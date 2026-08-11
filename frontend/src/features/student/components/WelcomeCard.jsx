import React from 'react';
import DashboardCard from '../../../Components/Dashboard/DashboardCard';

const WelcomeCard = ({ name, className = '' }) => {
  return (
    <DashboardCard
      showHeader={false}
      className={`!border-0 !bg-transparent !shadow-none ${className}`.trim()}
      bodyClassName="!px-0 !py-0"
    >
      <div className="w-full rounded-[1.35rem] bg-[linear-gradient(90deg,rgba(249,248,255,1)_0%,rgba(171,164,218,0.98)_100%)] px-6 py-4 text-indigo-950 shadow-[0_10px_30px_-24px_rgba(49,46,129,0.25)] md:px-8 md:py-5">
        <h2 className="font-['Playfair_Display'] text-[1.35rem] font-bold text-indigo-900 md:text-[1.5rem]">Welcome Back, {name}</h2>
      </div>
    </DashboardCard>
  );
};

export default WelcomeCard;