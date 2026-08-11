import React, { useEffect, useRef, useState } from 'react';
import {
  FiUser,
  FiBook,
  FiStar,
  FiShield,
  FiCalendar,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

import { FaUserGraduate } from 'react-icons/fa';

import {
  fetchStudentStudyInfo,
  updateStudentProfilePhoto,
} from '../../features/student/studentService';

import {
  formatDate,
  formatDateTime,
  getLevelText,
  SectionCell,
  ProfileSection,
  SidebarItem,
} from './ProfileShared';

import EditableAvatar from '../../Components/Shared/EditableAvatar';
import { useAuth } from '../../store/authContext';

const PhotoStatusMessage = ({ status }) => {
  if (!status) return null;

  const isSuccess = status === 'updated';

  const messages = {
    updated: 'Profile photo updated successfully.',
    error: 'Something went wrong. Please try again.',
  };

  return (
    <div
      className={`mt-2 flex items-center gap-1.5 text-[12px] font-medium transition-all duration-300 ${
        isSuccess ? 'text-indigo-600' : 'text-red-500'
      }`}
    >
      {isSuccess ? <FiCheckCircle size={13} /> : <FiAlertCircle size={13} />}
      {messages[status]}
    </div>
  );
};

const StudentProfile = ({
  user: userProp,
  displayRoleLabel,
  accessToken,
}) => {
  const { user, setAuth, userRole, userId } = useAuth();

  const resolvedUser = user || userProp;

  const [studyInfo, setStudyInfo] = useState(null);
  const [photoStatus, setPhotoStatus] = useState(null);

  const statusTimerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadStudyInfo = async () => {
      try {
        const response = await fetchStudentStudyInfo(accessToken);

        if (isMounted) {
          setStudyInfo(response || null);
        }
      } catch {
        if (isMounted) {
          setStudyInfo(null);
        }
      }
    };

    if (accessToken) {
      loadStudyInfo();
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, []);

  const showStatus = (status) => {
    setPhotoStatus(status);

    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
    }

    statusTimerRef.current = setTimeout(() => {
      setPhotoStatus(null);
    }, 3000);
  };

  const handlePhotoUpdated = async (imageUrl, publicId) => {
    try {
      await updateStudentProfilePhoto(accessToken, imageUrl, publicId);

      setAuth({
        user: {
          ...resolvedUser,
          photo_url: imageUrl,
          photoURL: imageUrl,
          photoUrl: imageUrl,
          avatar: imageUrl,
        },
        accessToken,
        userRole,
        userId,
      });

      showStatus('updated');

    } catch (error) {
      console.error('Failed to save profile photo:', error);
      showStatus('error');
    }
  };

  const currentAvatar =
    resolvedUser.photo_url ||
    resolvedUser.photoURL ||
    resolvedUser.photoUrl ||
    resolvedUser.avatar ||
    '';

  const fullName =
    resolvedUser.name ||
    [
      resolvedUser.firstName || resolvedUser.first_name,
      resolvedUser.secondName || resolvedUser.second_name,
      resolvedUser.thirdName || resolvedUser.third_name,
      resolvedUser.fourthName || resolvedUser.fourth_name,
    ]
      .filter(Boolean)
      .join(' ') ||
    'User';

  const shortName =
    [
      resolvedUser.first_name || resolvedUser.firstName,
      resolvedUser.second_name || resolvedUser.secondName,
    ]
      .filter(Boolean)
      .join(' ') ||
    fullName.split(' ').slice(0, 2).join(' ');

  const student = resolvedUser.student || {};
  const program = resolvedUser.program || student.program || {};
  const academicSemester = resolvedUser.academicSemester || student.academic_semester || {};

  const studyLevel = studyInfo?.level ?? student.level ?? resolvedUser.level ?? '';
  const studyGpa = studyInfo?.cgpa ?? student.cgpa ?? resolvedUser.cgpa ?? '';

  const completedHours =
    studyInfo?.completedHours ??
    student.completedHours ??
    student.hours_taken ??
    resolvedUser.completedHours ??
    resolvedUser.hours_taken ??
    '';

  const registeredHours =
    studyInfo?.totalRegisteredHours ??
    student.totalRegisteredHours ??
    resolvedUser.totalRegisteredHours ??
    '';

  return (
    <section className="min-h-[calc(100vh-80px)] border-t border-slate-200 bg-[#f0f4f8] py-8">
      <div className="mx-auto max-w-[1240px] px-4 md:px-8">

        <div className="mb-8 flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <h1 className="text-[20px] font-bold text-indigo-900">
              {displayRoleLabel} Profile
            </h1>

            {(resolvedUser.last_login || resolvedUser.lastLogin) && (
              <>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block"></span>
                <span className="text-[13px] font-medium text-slate-500">
                  Last login:{' '}
                  {formatDateTime(resolvedUser.last_login || resolvedUser.lastLogin)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-8 lg:flex-row">

          <div className="w-full shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_15px_rgb(0,0,0,0.015)] lg:w-[320px]">

            <div className="h-[140px] bg-gradient-to-b from-[#EAE1F9] to-[#F4F1FD]"></div>

            <div className="relative mt-[-60px] flex flex-col items-center border-b border-slate-100/80 pb-6">

              <EditableAvatar
                src={currentAvatar}
                alt={shortName}
                accessToken={accessToken}
                onPhotoUpdated={handlePhotoUpdated}
              />

              <PhotoStatusMessage status={photoStatus} />

              <h2 className="mt-1 text-[18px] font-bold text-indigo-950">
                {shortName}
              </h2>

              <p className="mt-0.5 text-[13px] font-medium text-slate-500">
                Faculty of Computers & Data Science
              </p>
            </div>

            <div className="flex flex-col divide-y divide-slate-50 py-2">

              <SidebarItem
                Icon={FaUserGraduate}
                label="Level"
                value={getLevelText(studyLevel)}
              />

              <SidebarItem
                Icon={FiBook}
                label="Program"
                value={program.program_name_en || resolvedUser.college || '-'}
                subValue={program.program_name_ar}
              />

              <SidebarItem
                Icon={FiStar}
                label="GPA"
                value={studyGpa}
              />

              <SidebarItem
                Icon={FiShield}
                label="Academic Status"
                value={student.status || resolvedUser.status || 'Active'}
                isBadge
              />

              <SidebarItem
                Icon={FiCalendar}
                label="Academic Year"
                value={academicSemester.academic_year || '2024 - 2025'}
              />
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col gap-2">

            <ProfileSection title="Basic Information" icon={FiUser}>
              <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell key="name" label="Full Name" value={fullName} />
                <SectionCell
                  key="ssn"
                  label="System ID (SSN)"
                  value={resolvedUser.national_id || student.ssn || resolvedUser.ssn || '-'}
                />
              </div>

              <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell key="dob" label="Date of Birth" value={formatDate(resolvedUser.birth)} />
                <SectionCell key="phone" label="Phone Number" value={resolvedUser.phone} isSensitive />
              </div>

              <div className="grid grid-cols-1 divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell key="email" label="Email Address" value={resolvedUser.email || '-'} />
              </div>
            </ProfileSection>

            <ProfileSection title="Academic Information" icon={FaUserGraduate}>
              <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell
                  key="uid"
                  label="University ID"
                  value={student.student_id || resolvedUser.studentId || resolvedUser.user_id || '-'}
                />
                <SectionCell
                  key="fees"
                  label="Fees Due"
                  value={student.fees_due || 'Free'}
                  badge={student.fees_due === 0 || !student.fees_due ? 'Free' : null}
                />
              </div>

              <div className="grid grid-cols-1 divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell key="completedHours" label="Completed Hours" value={completedHours} />
                <SectionCell key="registeredHours" label="Registered Hours" value={registeredHours} />
              </div>

              <div className="grid grid-cols-1 divide-slate-100 border-t border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell
                  key="semester"
                  label="Semester"
                  value={academicSemester.semester_name || 'Fall Semester 2024'}
                />
              </div>
            </ProfileSection>

            <ProfileSection title="Student Background" icon={FiBook}>
              <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell
                  key="secondarySchool"
                  label="Secondary School"
                  value={student.secondary_school || resolvedUser.secondary_school || '-'}
                />
                <SectionCell
                  key="country"
                  label="Country"
                  value={student.country || resolvedUser.country || '-'}
                />
              </div>

              <div className="grid grid-cols-1 divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell
                  key="secondaryQualification"
                  label="Secondary Qualification"
                  value={student.secondary_qualification || resolvedUser.secondary_qualification || '-'}
                />
              </div>
            </ProfileSection>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-indigo-100/50 bg-indigo-50/50 p-5 text-indigo-800">
              <FiInfo size={20} className="mt-0.5 shrink-0" />
              <p className="text-sm font-medium leading-relaxed">
                If you would like to update any of your profile information, please contact the{' '}
                <span className="font-bold">Student Affairs Office</span>.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentProfile;