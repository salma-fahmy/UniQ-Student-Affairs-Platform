import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import Avatar from '../../../Components/Shared/Avatar';

const ROLE_META = {
  student:        { label: 'Student',        color: 'bg-indigo-50 text-indigo-700'  },
  academic_staff: { label: 'Academic Staff', color: 'bg-sky-50 text-sky-700'        },
  affairs_staff:  { label: 'Affairs Staff',  color: 'bg-amber-50 text-amber-700'    },
  admin:          { label: 'Admin',          color: 'bg-rose-50 text-rose-700'      },
};

const getUserDescription = (user) => {
  const role = user.role?.role_name;
  if (role === 'student') return user.student?.program?.program_name_en ?? '—';
  if (role === 'academic_staff' || role === 'affairs_staff') return user.staff?.job_title ?? '—';
  return '—';
};

const UserCard = ({ user, onViewDetails }) => {
  const role     = user.role?.role_name ?? '';
  const meta     = ROLE_META[role] ?? { label: role, color: 'bg-slate-100 text-slate-600' };
  const fullName = [user.first_name, user.second_name].filter(Boolean).join(' ');
  const desc     = getUserDescription(user);
  const avatar   = user.photo_url || '';

  return (
    <div className="group bg-white border border-slate-200/70 border-b-[3px] border-b-[#2a266f]/20
                    hover:border-indigo-200 hover:border-b-[#2a266f]
                    rounded-2xl px-4 py-3
                    shadow-[0_4px_16px_-8px_rgba(0,0,0,0.07)]
                    hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(42,38,111,0.13)]
                    transition-all duration-200 ease-out
                    flex items-center gap-4 relative overflow-hidden">

      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a266f]/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Col 1 — Avatar + Name (flex-[3]) */}
      <div className="flex items-center gap-3 flex-[3] min-w-0 relative z-10">
        <Avatar
          src={avatar}
          alt={fullName}
          name={fullName}
          size="sm"
          className="shrink-0 ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all"
        />
        <p className="text-[14px] font-bold text-indigo-950 truncate font-['Manrope']">
          {fullName || '—'}
        </p>
      </div>

      {/* Col 2 — ID (flex-[2]) */}
      <div className="flex-[2] min-w-0 relative z-10 hidden sm:block">
        <p className="text-[13px] font-medium text-slate-500 truncate font-mono">
          {user.user_id}
        </p>
      </div>

      {/* Col 3 — Role badge (flex-[2]) */}
      <div className="flex-[2] min-w-0 relative z-10 hidden md:flex items-center">
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      {/* Col 4 — Program / Job Title (flex-[3]) */}
      <div className="flex-[3] min-w-0 relative z-10 hidden lg:block">
        <p className="text-[13px] font-medium text-slate-500 truncate">{desc}</p>
      </div>

      {/* Col 5 — Button (fixed) */}
      <div className="shrink-0 relative z-10 ml-auto lg:ml-0">
        <button
          onClick={() => onViewDetails(user.user_id)}
          className="flex items-center gap-1.5 text-[13px] font-semibold
                     bg-indigo-800 text-white px-4 py-2 rounded-full
                     shadow-sm shadow-[#2a266f]/20
                     hover:bg-[#201d54] active:scale-95
                     group-hover:scale-[1.02]
                     transition-all duration-200 whitespace-nowrap"
        >
          <span className="hidden sm:inline">View Details</span>
          <FiChevronRight size={15} className="stroke-[2.5px] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default UserCard;