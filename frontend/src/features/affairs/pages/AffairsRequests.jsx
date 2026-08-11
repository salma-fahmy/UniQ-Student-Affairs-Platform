import React from 'react';
import StudentRecordsPage from '../../student/pages/StudentRecordsPage';
import { fetchAllAffairsRequests, fetchAffairsRequests } from '../affairsService';
import useAuth from '../../auth/useAuth';

const AffairsRequests = () => {
  const { userRole } = useAuth();

  const basePath =
    userRole === 'academic_staff'
      ? '/dashboard/academic'
      : userRole === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/affairs';

  return (
    <StudentRecordsPage
      recordKind="request"
      pageTitle="All Requests"
      pageSubtitle="Manage student requests and update their processing statuses."
      fetchRecords={fetchAffairsRequests}
      fetchAllRecords={fetchAllAffairsRequests}
      enablePagination
      defaultItemsPerPage={6}
      emptyMessage="There are no student requests currently."
      searchPlaceholder="Search request type or student name..."
      categoryLabel="Request Status"
      basePath={basePath}
    />
  );
};

export default AffairsRequests;