// apps/api/src/services/staff.services.ts

import { prisma } from "@repo/db";

/**
 * COMPLAINT TYPE for complaints filed by a student AGAINST a doctor.
 * These complaints are ONLY visible to Admin, NOT to affairs_staff.
 */
export const DOCTOR_COMPLAINT_TYPE = "doctor_complaint";

// ============================================================
// Affairs Staff Dashboard
// ============================================================
export const getStaffDashboard = async () => {
  const [
    pendingRequestsCount,
    // Affairs only counts complaints that are NOT doctor complaints
    activeComplaintsCount,
    recentRequests,
    recentComplaints,
  ] = await Promise.all([
    prisma.request.count({ where: { status: "pending" } }),

    prisma.complaint.count({
      where: {
        status: { in: ["open", "in_progress"] },
        // Affairs does NOT see doctor complaints
        complaint_type: { not: DOCTOR_COMPLAINT_TYPE },
      },
    }),

    prisma.request.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
      select: {
        request_number: true,
        status: true,
        created_at: true,
        request_type: { select: { name: true, code: true } },
        student: {
          select: {
            student_id: true,
            // fees_due exposed as read-only info (no update endpoint)
            fees_due: true,
            user: { select: { first_name: true, second_name: true } },
          },
        },
      },
    }),

    prisma.complaint.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
      where: {
        // Affairs does NOT see doctor complaints
        complaint_type: { not: DOCTOR_COMPLAINT_TYPE },
      },
      select: {
        complaint_number: true,
        complaint_type: true,
        status: true,
        priority: true,
        created_at: true,
        student: {
          select: {
            student_id: true,
            user: { select: { first_name: true, second_name: true } },
          },
        },
      },
    }),
  ]);

  return {
    stats: {
      pendingRequests: pendingRequestsCount,
      activeComplaints: activeComplaintsCount,
    },
    recentRequests,
    recentComplaints,
  };
};

// ============================================================
// Admin Dashboard (sees EVERYTHING including doctor complaints)
// ============================================================
export const getAdminDashboard = async () => {
  const [
    pendingRequestsCount,
    activeComplaintsCount,
    doctorComplaintsCount,
    recentRequests,
    recentComplaints,
  ] = await Promise.all([
    prisma.request.count({ where: { status: "pending" } }),

    prisma.complaint.count({
      where: { status: { in: ["open", "in_progress"] } },
    }),

    prisma.complaint.count({
      where: { complaint_type: DOCTOR_COMPLAINT_TYPE },
    }),

    prisma.request.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
      select: {
        request_number: true,
        status: true,
        created_at: true,
        request_type: { select: { name: true, code: true } },
        student: {
          select: {
            student_id: true,
            fees_due: true,
            user: { select: { first_name: true, second_name: true } },
          },
        },
      },
    }),

    prisma.complaint.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
      select: {
        complaint_number: true,
        complaint_type: true,
        status: true,
        priority: true,
        created_at: true,
        student: {
          select: {
            student_id: true,
            user: { select: { first_name: true, second_name: true } },
          },
        },
      },
    }),
  ]);

  return {
    stats: {
      pendingRequests: pendingRequestsCount,
      activeComplaints: activeComplaintsCount,
      doctorComplaints: doctorComplaintsCount,
    },
    recentRequests,
    recentComplaints,
  };
};
