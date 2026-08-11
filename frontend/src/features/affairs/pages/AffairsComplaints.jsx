import React from 'react';
import StudentRecordsPage from '../../student/pages/StudentRecordsPage';
import { fetchAllAffairsComplaints, fetchAffairsComplaints } from '../affairsService';
import useAuth from '../../auth/useAuth';

const AffairsComplaints = () => {
  const { userRole } = useAuth();

  const basePath =
    userRole === 'academic_staff'
      ? '/dashboard/academic'
      : userRole === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/affairs';

  return (
    <StudentRecordsPage
      recordKind="complaint"
      pageTitle="All Complaints"
      pageSubtitle="Monitor and resolve student facility, academic, and administrative complaints."
      fetchRecords={fetchAffairsComplaints}
      fetchAllRecords={fetchAllAffairsComplaints}
      enablePagination
      defaultItemsPerPage={6}
      emptyMessage="There are no student complaints currently."
      searchPlaceholder="Search complaint text or student ID..."
      categoryLabel="Complaint Status"
      basePath={basePath}
    />
  );
};

export default AffairsComplaints;