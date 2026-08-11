import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { PiGraduationCapDuotone, PiChartBarDuotone, PiClockDuotone } from 'react-icons/pi';
import Avatar from '../../../Components/Shared/Avatar';
import Card from '../../../Components/Card/Card';
import SharedButton from '../../../Components/Shared/SharedButton';

const overviewItems = ['Level', 'GPA', 'Completed Hours', 'Registered Hours'];

const getIcon = (item) => {
  switch (item) {
    case 'Level':
      return <PiGraduationCapDuotone className="h-5 w-5" />;
    case 'GPA':
      return <PiChartBarDuotone className="h-5 w-5" />;
    case 'Completed Hours':
    case 'Registered Hours':
      return <PiClockDuotone className="h-5 w-5" />;
    default:
      return null;
  }
};

const formatValue = (value) => (value === null || value === undefined || value === '' ? '-' : value);

const StudentOverviewCard = ({ profile = {}, onViewProfile = () => {}, className = '' }) => {
  const fullName =
    profile.name ||
    [profile.firstName, profile.secondName].filter(Boolean).join(' ') ||
    [profile.first_name, profile.second_name].filter(Boolean).join(' ') ||
    'Student';

  const programNameEn = profile.programNameEn || profile.college || profile.faculty || '-';
  const programNameAr = profile.programNameAr || '';
  const avatar = profile.avatar || profile.photoURL || profile.photo_url || '';
  const level = formatValue(profile.level ?? profile.levelText);
  const gpa = formatValue(profile.gpa ?? profile.cgpa);
  const completedHours = formatValue(profile.completedHours ?? profile.hoursTaken ?? profile.hours_taken);
  const registeredHours = formatValue(profile.registeredHours ?? profile.totalRegisteredHours);

  const overviewValues = {
    Level: level,
    GPA: gpa,
    'Completed Hours': completedHours,
    'Registered Hours': registeredHours,
  };

  return (
    <Card
      title="Student Overview"
      className={`!font-sans ${className}`}
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-[1.35rem] border border-slate-100 bg-slate-50/70 px-4 py-4 shadow-[0_10px_28px_-24px_rgba(49,46,129,0.35)]">
          <div className="rounded-full bg-white p-1 shadow-inner">
            <Avatar src={avatar} alt={fullName} name={fullName} size="lg" className="shrink-0 ring-2 ring-white shadow-lg" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="truncate text-[1.05rem] font-bold text-indigo-900">{fullName}</h4>
            <p className="whitespace-normal break-words text-sm font-medium text-indigo-900 leading-snug">{programNameEn}</p>
            {programNameAr ? (
              <p className="whitespace-normal break-words text-xs font-medium text-slate-500 leading-snug">{programNameAr}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-1">
          {overviewItems.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50/80 px-4 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-indigo-800 shadow-sm">
                {getIcon(item)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold  tracking-wider text-indigo-900">{item}</p>
                <p className="truncate text-sm font-bold text-slate-500">{overviewValues[item]}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-2">
          <SharedButton 
            text="View Profile" 
            onClick={onViewProfile} 
            icon={FiChevronRight} 
            className="w-[150px]" 
          />
        </div>
      </div>
    </Card>
  );
};

export default StudentOverviewCard;