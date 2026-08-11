import React from 'react';
import Button from '../../../Components/Shared/Button';
import DashboardCard from '../../../Components/Dashboard/DashboardCard';
import RequestCard from './RequestCard';

const RecentActivitiesCard = ({ activities = [], isLoading = false, error = '', onViewAll }) => {
  return (
    <DashboardCard 
      title="Recent Activities" 
      headerClassName="bg-[#f0f0f8] !border-b-0 px-6 py-5"
      titleClassName="text-indigo-900 font-bold text-xl"
      bodyClassName="!p-0"
    >
      {isLoading ? (
        <div className="px-6 py-8 text-sm font-medium text-slate-500">
          Loading recent activities...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700 m-6">
          {error}
        </div>
      ) : activities.length > 0 ? (
        <div className="divide-y divide-slate-200">
          {activities.map((activity) => (
            <RequestCard
              key={activity.id}
              title={activity.title}
              description={activity.description}
              submittedAt={activity.submittedAt}
              status={activity.status}
              category={activity.category}
              isDashboard={true}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 m-6">
          No recent activities have been submitted yet.
        </div>
      )}

      {onViewAll ? (
        <div className="p-5 border-t border-slate-200">
          <Button type="button" variant="secondary" className="w-full rounded-full" onClick={onViewAll}>
            View All Activities
          </Button>
        </div>
      ) : null}
    </DashboardCard>
  );
};

export default RecentActivitiesCard;