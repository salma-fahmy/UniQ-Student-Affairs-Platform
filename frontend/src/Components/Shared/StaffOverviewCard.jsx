// src/Components/Shared/StaffOverviewCard.jsx
//
// Sidebar overview card for staff roles (affairs_staff, academic_staff).
// Mirrors StudentOverviewCard exactly — same Card, Avatar, SharedButton,
// same layout, same icon pattern — just with staff-appropriate fields.

import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { PiBriefcaseDuotone, PiBuildingsDuotone, PiEnvelopeDuotone, PiPhoneDuotone, PiChalkboardTeacherDuotone, PiMapPinDuotone } from 'react-icons/pi';
import Avatar from './Avatar';
import Card from '../Card/Card';
import SharedButton from './SharedButton';

const formatValue = (value) =>
  value === null || value === undefined || value === '' ? '-' : value;

const getIcon = (item) => {
  switch (item) {
    case 'Job Title':       return <PiBriefcaseDuotone className="h-5 w-5" />;
    case 'Department':      return <PiBuildingsDuotone className="h-5 w-5" />;
    case 'Academic Rank':   return <PiChalkboardTeacherDuotone className="h-5 w-5" />;
    case 'Specialization':  return <PiChalkboardTeacherDuotone className="h-5 w-5" />;
    case 'Office':          return <PiMapPinDuotone className="h-5 w-5" />;
    case 'Office Hours':    return <PiMapPinDuotone className="h-5 w-5" />;
    case 'Email':           return <PiEnvelopeDuotone className="h-5 w-5" />;
    case 'Phone':           return <PiPhoneDuotone className="h-5 w-5" />;
    default:                return null;
  }
};

/**
 * StaffOverviewCard
 *
 * @param {{
 *   name: string,
 *   avatar: string,
 *   role: string,
 *   department: string,
 *   jobTitle: string,
 *   academicRank?: string,
 *   specialization?: string,
 *   officeLocation?: string,
 *   officeHours?: string,
 *   email: string,
 *   phone: string,
 * }} profile
 * @param {() => void} onViewProfile
 * @param {string} [className]
 */
const StaffOverviewCard = ({ profile = {}, onViewProfile = () => {}, className = '' }) => {
  const fullName =
    profile.name ||
    [profile.firstName, profile.secondName].filter(Boolean).join(' ') ||
    [profile.first_name, profile.second_name].filter(Boolean).join(' ') ||
    'Staff';

  const roleLabel = profile.role || '-';
  const avatar    = profile.avatar || profile.photoURL || profile.photo_url || '';

  // Build the list of rows dynamically — only include fields that have values.
  // Affairs staff won't have academicRank/specialization/office; those just won't appear.
  const allItems = [
    { label: 'Job Title',      value: profile.jobTitle       },
    { label: 'Department',     value: profile.department     },
    { label: 'Academic Rank',  value: profile.academicRank   },
    { label: 'Specialization', value: profile.specialization },
    { label: 'Office',         value: profile.officeLocation },
    { label: 'Office Hours',   value: profile.officeHours    },
    { label: 'Email',          value: profile.email          },
    { label: 'Phone',          value: profile.phone          },
  ].filter((item) => item.value);   // hide rows with no data

  return (
    <Card title="Staff Overview" className={`!font-sans ${className}`}>
      <div className="space-y-6">

        {/* ── Avatar + name block — identical markup to StudentOverviewCard ── */}
        <div className="flex items-start gap-3 rounded-[1.35rem] border border-slate-100 bg-slate-50/70 px-4 py-4 shadow-[0_10px_28px_-24px_rgba(49,46,129,0.35)]">
          <div className="rounded-full bg-white p-1 shadow-inner">
            <Avatar
              src={avatar}
              alt={fullName}
              name={fullName}
              size="lg"
              className="shrink-0 ring-2 ring-white shadow-lg"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="truncate text-[1.05rem] font-bold text-indigo-900">{fullName}</h4>
            <p className="whitespace-normal break-words text-sm font-medium text-indigo-900 leading-snug">
              {roleLabel}
            </p>
          </div>
        </div>

        {/* ── Info rows — same structure as StudentOverviewCard's overviewItems ── */}
        <div className="space-y-3 border-t border-slate-100 pt-1">
          {allItems.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-slate-50/80 px-4 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-indigo-800 shadow-sm">
                {getIcon(label)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold tracking-wider text-indigo-900">{label}</p>
                <p className="truncate text-sm font-bold text-slate-500">{formatValue(value)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── View Profile button — identical to StudentOverviewCard ─────────── */}
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

export default StaffOverviewCard;