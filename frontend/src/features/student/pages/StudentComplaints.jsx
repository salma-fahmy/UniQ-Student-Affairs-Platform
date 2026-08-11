import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import StudentRecordsPage from './StudentRecordsPage';
import { fetchStudentComplaints } from '../studentService';

const StudentComplaints = () => {
  const navigate = useNavigate();

  return (
    <StudentRecordsPage
      recordKind="complaint"
      pageTitle="All Complaints"
      pageSubtitle=""
      fetchRecords={fetchStudentComplaints}
      fetchAllRecords={fetchStudentComplaints}
      enablePagination
      emptyMessage="You have not submitted any complaints yet."
      searchPlaceholder="Search..."
      categoryLabel="Categories"
      headerAction={
        <button
          type="button"
          onClick={() => navigate('/dashboard/student/complaints/new')}
          className="group flex items-center justify-center gap-2 rounded-full px-5 py-2.5
                     text-sm font-medium bg-indigo-900 text-white
                     shadow-[0_10px_20px_-10px_rgba(49,46,129,0.5)]
                     hover:bg-indigo-800 hover:shadow-[0_15px_25px_-10px_rgba(49,46,129,0.7)]
                     transition-all duration-300 active:scale-95 whitespace-nowrap"
        >
          <FiPlus size={16} className="stroke-[2.5px]" />
          New Complaint
        </button>
      }
    />
  );
};

export default StudentComplaints;