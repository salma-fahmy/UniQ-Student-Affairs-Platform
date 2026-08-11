import React from 'react';
import StudentRecordsPage from '../pages/StudentRecordsPage';
import {
  fetchStudentComplaintDetails,
  fetchStudentComplaints,
} from '../studentService';

const StudentComplaints = () => {
  return (
    <StudentRecordsPage
      recordKind="complaint"
      pageTitle="All Complaints"
      pageSubtitle="Browse every complaint submitted through your student account and open any card to see the latest response or resolution note."
      fetchRecords={fetchStudentComplaints}
      loadRecordDetails={fetchStudentComplaintDetails}
      emptyMessage="You have not submitted any complaints yet."
      searchPlaceholder="Search complaints by title, ID, status, or note"
      categoryLabel="Complaint categories"
    />
  );
};

export default StudentComplaints;
