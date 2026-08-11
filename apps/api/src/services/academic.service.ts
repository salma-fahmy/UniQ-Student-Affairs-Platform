// apps/api/src/services/academic.service.ts

import { prisma } from "@repo/db";
import NotFoundError from "../error/NotFound.Error";
import { createNotification } from "./notification.service";

// Codes for the only request types a doctor (academic_staff) is allowed to see
const DOCTOR_ALLOWED_REQUEST_CODES = ["CRS_REG", "CRS_WTH"];

// ============================================================
// 1. Dashboard
// ============================================================
export const getAcademicDashboard = async (staffId: string) => {
  const assignedPrograms = await prisma.academicProgram.findMany({
    where: { academic_staff_id: staffId },
    select: { program_id: true },
  });

  const programIds = assignedPrograms.map((p) => p.program_id);

  const assignedStudents = await prisma.student.findMany({
    where: { program_id: { in: programIds } },
    select: { student_id: true },
  });

  const studentIds = assignedStudents.map((s) => s.student_id);

  // Doctor can only count the allowed request types
  const [pendingRequests, assignedStudentsCount] = await Promise.all([
    prisma.request.count({
      where: {
        student_id: { in: studentIds },
        status: "pending",
        request_type: { code: { in: DOCTOR_ALLOWED_REQUEST_CODES } },
      },
    }),
    prisma.student.count({
      where: { program_id: { in: programIds } },
    }),
  ]);

  const recentRequests = await prisma.request.findMany({
    where: {
      student_id: { in: studentIds },
      request_type: { code: { in: DOCTOR_ALLOWED_REQUEST_CODES } },
    },
    select: {
      request_number: true,
      status: true,
      created_at: true,
      request_type: { select: { name: true, code: true } },
      student: {
        select: {
          user: { select: { first_name: true, second_name: true } },
          student_id: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
    take: 10,
  });

  return {
    pendingRequests,
    assignedStudentsCount,
    recentRequests,
  };
};

// ============================================================
// 2. Assigned Students List
// ============================================================
export const getAssignedStudents = async (
  staffId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const assignedPrograms = await prisma.academicProgram.findMany({
    where: { academic_staff_id: staffId },
    select: { program_id: true },
  });

  const programIds = assignedPrograms.map((p) => p.program_id);

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where: { program_id: { in: programIds } },
      select: {
        student_id: true,
        status: true,
        program: { select: { program_name_en: true } },
        user: {
          select: {
            first_name: true,
            second_name: true,
            email: true,
            photo_url: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { student_id: "asc" },
    }),
    prisma.student.count({ where: { program_id: { in: programIds } } }),
  ]);

  return {
    data: students,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// ============================================================
// 3. Academic Requests List (CRS_REG and CRS_WTH only)
// ============================================================
export const getAcademicRequests = async (
  staffId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const assignedPrograms = await prisma.academicProgram.findMany({
    where: { academic_staff_id: staffId },
    select: { program_id: true },
  });

  const programIds = assignedPrograms.map((p) => p.program_id);

  const studentIds = (
    await prisma.student.findMany({
      where: { program_id: { in: programIds } },
      select: { student_id: true },
    })
  ).map((s) => s.student_id);

  const [requests, total] = await Promise.all([
    prisma.request.findMany({
      where: {
        student_id: { in: studentIds },
        // Doctor only sees Add Course and Drop Course requests
        request_type: { code: { in: DOCTOR_ALLOWED_REQUEST_CODES } },
      },
      select: {
        request_number: true,
        status: true,
        created_at: true,
        request_type: { select: { name: true, code: true } },
        student: {
          select: {
            student_id: true,
            user: { select: { first_name: true, second_name: true } },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
    prisma.request.count({
      where: {
        student_id: { in: studentIds },
        request_type: { code: { in: DOCTOR_ALLOWED_REQUEST_CODES } },
      },
    }),
  ]);

  return {
    data: requests,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// ============================================================
// 4. Request Detail (CRS_REG and CRS_WTH only)
// ============================================================
export const getAcademicRequestDetail = async (
  staffId: string,
  requestNumber: string
) => {
  const request = await prisma.request.findUnique({
    where: { request_number: requestNumber },
    select: {
      request_number: true,
      status: true,
      description: true,
      comments: true,
      created_at: true,
      processed_at: true,
      price_at_request: true,
      request_type: { select: { name: true, name_ar: true, code: true } },
      student: {
        select: {
          student_id: true,
          status: true,
          // fees_due is exposed as read-only info alongside request data
          fees_due: true,
          program: { select: { program_name_en: true } },
          user: {
            select: {
              first_name: true,
              second_name: true,
              email: true,
              photo_url: true,
            },
          },
        },
      },
    },
  });

  if (!request) {
    throw new NotFoundError({
      message: "Request not found",
      code: "ERR_NF",
      statusCode: 404,
    });
  }

  // Ensure the doctor is not accessing a non-allowed request type
  if (!DOCTOR_ALLOWED_REQUEST_CODES.includes(request.request_type.code)) {
    throw new NotFoundError({
      message: "Request not found",
      code: "ERR_NF",
      statusCode: 404,
    });
  }

  return request;
};

// ============================================================
// 5. Update Request Status (Approve / Reject) - CRS_REG/CRS_WTH only
// ============================================================
export const updateRequestStatus = async (
  staffId: string,
  requestNumber: string,
  status: "accepted" | "rejected",
  comments?: string
) => {
  const request = await prisma.request.findUnique({
    where: { request_number: requestNumber },
    include: { request_type: { select: { code: true } } },
  });

  if (!request) {
    throw new NotFoundError({
      message: "Request not found",
      code: "ERR_NF",
      statusCode: 404,
    });
  }

  // Doctors can only act on allowed request types
  if (!DOCTOR_ALLOWED_REQUEST_CODES.includes(request.request_type.code)) {
    throw new NotFoundError({
      message: "Request not found",
      code: "ERR_NF",
      statusCode: 404,
    });
  }

  return await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.role', 'academic_staff', true)`;
    const updated = await tx.request.update({
      where: { request_id: request.request_id },
      data: {
        status: status as any,
        comments: comments ?? null,
        updated_by: staffId,
        processed_at: new Date(),
      },
      select: {
        request_number: true,
        status: true,
        comments: true,
        updated_at: true,
        processed_at: true,
        student_id: true,
      },
    });

    const notificationMessages: Record<string, { title: string; message: string }> = {
      accepted: { title: "Request Accepted", message: "Your request has been accepted." },
      rejected: { title: "Request Rejected", message: "Your request has been rejected." },
    };

    const notif = notificationMessages[status];
    if (notif) {
      await createNotification({
        userId: updated.student_id,
        title: notif.title,
        message: notif.message,
        notificationType: "request_update",
        actionUrl: `/requests/${updated.request_number}`,
      });
    }

    return updated;
  });
};