import React, { useState } from 'react';
import { FiUser, FiBook, FiShield, FiInfo } from 'react-icons/fi';
import { 
  formatDate, 
  formatDateTime, 
  SectionCell, 
  ProfileSection, 
  SidebarItem 
} from './ProfileShared';
import EditableAvatar from '../../Components/Shared/EditableAvatar';

const StaffProfile = ({ user, displayRoleLabel, accessToken }) => {
  const [uploadedAvatar, setUploadedAvatar] = useState(null);

  const currentAvatar = uploadedAvatar || user.photoURL || user.photo_url || user.photoUrl || user.avatar || '';

  const handlePhotoUpdated = (newUrl) => {
    setUploadedAvatar(newUrl);
  };

  const fullName =
    user.name ||
    [user.firstName || user.first_name, user.secondName || user.second_name, user.thirdName || user.third_name, user.fourthName || user.fourth_name].filter(Boolean).join(' ') ||
    'User';

  const shortName = 
    [user.first_name || user.firstName, user.second_name || user.secondName].filter(Boolean).join(' ') || 
    fullName.split(' ').slice(0, 2).join(' ');

  return (
    <section className="bg-[#f0f4f8] min-h-[calc(100vh-80px)] py-8 border-t border-slate-200">
      <div className="mx-auto max-w-[1240px] px-4 md:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 px-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <h1 className="text-[20px] font-bold text-indigo-900">{displayRoleLabel} Profile</h1>
            {(user.last_login || user.lastLogin) && (
              <>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-[13px] font-medium text-slate-500">
                  Last login: {formatDateTime(user.last_login || user.lastLogin)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="lg:w-[320px] shrink-0 bg-white border border-slate-100 rounded-2xl flex flex-col pb-4 shadow-[0_2px_15px_rgb(0,0,0,0.015)] overflow-hidden w-full">
            <div className="h-[140px] bg-gradient-to-b from-[#EAE1F9] to-[#F4F1FD]"></div>
            <div className="relative flex flex-col items-center mt-[-60px] pb-6 border-b border-slate-100/80">
               
               <EditableAvatar 
                 src={currentAvatar}
                 alt={shortName}
                 accessToken={accessToken}
                 onPhotoUpdated={handlePhotoUpdated}
               />

               <h2 className="text-[18px] font-bold text-indigo-950 mt-1">{shortName}</h2>
               <p className="text-[13px] text-slate-500 font-medium mt-0.5 text-center px-4">
                 {user.staff?.job_title || user.department || 'Staff Member'}
                 {user.staff?.department && <span className="block text-[12px] opacity-80 mt-0.5">{user.staff.department}</span>}
               </p>
            </div>

            <div className="flex flex-col py-2 divide-y divide-slate-50">
              <SidebarItem Icon={FiShield} label="Account Status" value={user.is_active ? 'Active' : 'Inactive'} isBadge />
              <SidebarItem Icon={FiBook} label="Role" value={displayRoleLabel} />
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col gap-2">
              
              <ProfileSection title="Basic Information" icon={FiUser}>
                 <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
                    <SectionCell key="name" label="Full Name" value={fullName} />
                    <SectionCell key="ssn" label="System ID (SSN)" value={user.national_id || user.ssn || '-'} /> 
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100"> 
                    <SectionCell key="dob" label="Date of Birth" value={formatDate(user.birth)} />
                    <SectionCell key="phone" label="Phone Number" value={user.phone} isSensitive />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <SectionCell key="email" label="Email Address" value={user.email || '-'} />
                 </div>
              </ProfileSection>

              <ProfileSection title="Staff Information" icon={FiInfo}>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
                  <SectionCell key="dept" label="Department" value={user.staff?.department || user.department || '-'} />
                  <SectionCell key="jobTitle" label="Job Title" value={user.staff?.job_title || '-'} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  <SectionCell key="hireDate" label="Hire Date" value={formatDate(user.staff?.hire_date || user.hire_date)} />
                  <SectionCell key="staffId" label="Staff ID" value={user.user_id || user.userId || '-'} />
                </div>
              </ProfileSection>

          </div>
        </div>
      </div>
    </section>
  );
};

export default StaffProfile;