import React from 'react';
import StatCard from './StatCard';

const StudentStatsGrid = ({ items = [] }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className=" w-full grid grid-cols-2 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          titleClassName={item.titleClassName}
          value={item.value}
          icon={item.icon}
          accent={item.accent}
        />
      ))}
    </section>
  );
};

export default StudentStatsGrid;