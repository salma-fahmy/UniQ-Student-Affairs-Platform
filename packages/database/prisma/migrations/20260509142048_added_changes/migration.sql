-- CreateEnum
CREATE TYPE "student_status" AS ENUM ('active', 'graduated', 'suspended', 'withdrawn', 'on_leave');

-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('pending', 'approved', 'rejected', 'in_Progress');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('pending', 'paid', 'failed');

-- CreateEnum
CREATE TYPE "course_status" AS ENUM ('enrolled', 'completed', 'dropped', 'failed', 'absent', 'withdrawn');

-- CreateEnum
CREATE TYPE "complaint_status" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "qualification_type" AS ENUM ('general_secondary_science', 'general_secondary_math', 'IGCSE', 'american_diploma', 'IB', 'arab_equivalent', 'steam');

-- CreateEnum
CREATE TYPE "course_type" AS ENUM ('program_elective', 'program_obligatory', 'university_elective', 'university_obligatory', 'faculty_elective', 'faculty_obligatory');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('request_update', 'payment', 'complaint', 'course_update', 'system', 'announcement');

-- CreateEnum
CREATE TYPE "GradeEnum" AS ENUM ('A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', '(F)', 'Abs', 'W', 'FW', 'MW', 'I', 'IP', 'S', 'U', 'AU');

-- CreateEnum
CREATE TYPE "MilitaryStudentStatus" AS ENUM ('failed', 'success', 'training');

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "academic_programs" (
    "program_id" INTEGER NOT NULL,
    "academic_staff_id" VARCHAR(50) NOT NULL,
    "role" VARCHAR(50),
    "assigned_date" DATE,

    CONSTRAINT "academic_programs_pkey" PRIMARY KEY ("program_id","academic_staff_id")
);

-- CreateTable
CREATE TABLE "academic_semesters" (
    "semester_id" SERIAL NOT NULL,
    "semester_name" VARCHAR(50),
    "semester_code" VARCHAR(20),
    "academic_year" VARCHAR(20),
    "start_date" DATE,
    "end_date" DATE,
    "is_current" BOOLEAN DEFAULT false,
    "registration_start" DATE,
    "registration_end" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_semesters_pkey" PRIMARY KEY ("semester_id")
);

-- CreateTable
CREATE TABLE "academic_staff" (
    "staff_id" VARCHAR(50) NOT NULL,
    "academic_rank" VARCHAR(100),
    "specialization" VARCHAR(100),
    "office_location" VARCHAR(100),
    "office_hours" TEXT,

    CONSTRAINT "academic_staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" SERIAL NOT NULL,
    "course_code" VARCHAR(20),
    "course_name_en" VARCHAR(100),
    "credit_hours" INTEGER,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "course_type" "course_type" NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "course_prerequisites" (
    "course_id" INTEGER NOT NULL,
    "prerequisite_course_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_prerequisites_pkey" PRIMARY KEY ("course_id","prerequisite_course_id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "programs" (
    "program_id" SERIAL NOT NULL,
    "program_name_en" VARCHAR(100) NOT NULL,
    "program_name_ar" VARCHAR(100),
    "program_type" VARCHAR(50),
    "tuition_fees" DECIMAL(10,2),
    "is_active" BOOLEAN DEFAULT true,
    "credit_hour_price" DECIMAL(10,2) NOT NULL,
    "program_description_en" VARCHAR(500) NOT NULL,
    "program_description_ar" VARCHAR(500) NOT NULL,
    "program_benefits_en" VARCHAR(500) NOT NULL,
    "program_benefits_ar" VARCHAR(500) NOT NULL,
    "student_skills_en" VARCHAR(500) NOT NULL,
    "student_skills_ar" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "program_courses" (
    "program_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "semester_offered" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "program_courses_pkey" PRIMARY KEY ("program_id","course_id")
);

-- CreateTable
CREATE TABLE "request_types" (
    "request_type_id" SERIAL NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "name_ar" VARCHAR(100),
    "price" DECIMAL(10,2),
    "processing_days" INTEGER,
    "requires_approval" BOOLEAN DEFAULT true,
    "form_schema" JSONB,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_types_pkey" PRIMARY KEY ("request_type_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "staff" (
    "staff_id" VARCHAR(50) NOT NULL,
    "job_title" VARCHAR(100),
    "hire_date" DATE,
    "department" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "students" (
    "student_id" VARCHAR(50) NOT NULL,
    "status" "student_status" NOT NULL DEFAULT 'active',
    "fees_due" DECIMAL(10,2) DEFAULT 0,
    "enrollment_date" DATE,
    "graduation_date" DATE,
    "secondary_qualification" "qualification_type" NOT NULL,
    "secondary_grade" INTEGER NOT NULL,
    "secondary_school" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "secondary_english_grade" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "program_id" INTEGER,
    "current_semester_id" INTEGER,
    "military_id" INTEGER,
    "academic_staff_id" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "military_training" (
    "military_id" SERIAL NOT NULL,
    "military_training_completed" BOOLEAN NOT NULL DEFAULT false,
    "military_training_start_date" DATE,
    "student_training_status" "MilitaryStudentStatus" NOT NULL,
    "military_training_end_date" DATE,

    CONSTRAINT "military_training_pkey" PRIMARY KEY ("military_id")
);

-- CreateTable
CREATE TABLE "student_courses" (
    "student_id" VARCHAR(50) NOT NULL,
    "course_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "work" INTEGER NOT NULL,
    "final" INTEGER NOT NULL,
    "mid_term" INTEGER NOT NULL,
    "grade" "GradeEnum" NOT NULL,
    "status" "course_status",
    "completion_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "student_courses_pkey" PRIMARY KEY ("student_id","course_id","semester_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "second_name" VARCHAR(50),
    "third_name" VARCHAR(50),
    "fourth_name" VARCHAR(50),
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "ssn" VARCHAR(20) NOT NULL,
    "birth" DATE,
    "phone" VARCHAR(20) NOT NULL,
    "address" TEXT,
    "last_login" TIMESTAMP(6),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "role_id" INTEGER NOT NULL,
    "photo_url" TEXT DEFAULT 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp',
    "public_photo_cloud_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "log_id" SERIAL NOT NULL,
    "table_name" VARCHAR(50),
    "record_id" VARCHAR(50),
    "action" VARCHAR(20),
    "old_data" JSONB,
    "new_data" JSONB,
    "changed_by" VARCHAR(50),
    "changed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "college_info" (
    "college_id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "name_ar" VARCHAR(100),
    "title" VARCHAR(200),
    "dean_name" VARCHAR(100),
    "contact_email" VARCHAR(100),
    "contact_phone" VARCHAR(20),
    "address" TEXT,
    "logo_url" TEXT,
    "hero_image_url" TEXT,
    "vision" TEXT,
    "vision_ar" TEXT,
    "mission" TEXT,
    "mission_ar" TEXT,
    "description" TEXT,
    "description_ar" TEXT,
    "uploaded_by" VARCHAR(50),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "college_info_pkey" PRIMARY KEY ("college_id")
);

-- CreateTable
CREATE TABLE "college_rules_files" (
    "file_id" SERIAL NOT NULL,
    "file_url" TEXT,
    "file_name" VARCHAR(255),
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "title" VARCHAR(200),
    "description" TEXT,
    "uploaded_by" VARCHAR(50),
    "uploaded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "version" INTEGER DEFAULT 1,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "college_rules_files_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "complaint_id" SERIAL NOT NULL,
    "complaint_number" VARCHAR(50),
    "student_id" VARCHAR(50),
    "complaint_type" VARCHAR(100),
    "complaint_text" TEXT,
    "attachment" TEXT,
    "status" "complaint_status" DEFAULT 'open',
    "priority" VARCHAR(20) DEFAULT 'medium',
    "handled_by" VARCHAR(50),
    "resolution_text" TEXT,
    "resolved_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("complaint_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" VARCHAR(50),
    "title" VARCHAR(100),
    "message" TEXT,
    "notification_type" "notification_type" NOT NULL,
    "is_read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMP(6),
    "action_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" SERIAL NOT NULL,
    "payment_number" VARCHAR(50),
    "student_id" VARCHAR(50) NOT NULL,
    "request_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "payment_status" DEFAULT 'pending',
    "transaction_id" VARCHAR(100),
    "payment_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "requests" (
    "request_id" SERIAL NOT NULL,
    "request_number" VARCHAR(50),
    "student_id" VARCHAR(50) NOT NULL,
    "request_type_id" INTEGER NOT NULL,
    "price_at_request" DECIMAL(10,2),
    "description" TEXT,
    "request_body" JSONB,
    "status" "request_status" DEFAULT 'pending',
    "comments" TEXT,
    "updated_by" VARCHAR(50),
    "processed_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "request_documents" (
    "id" SERIAL NOT NULL,
    "document_link" TEXT NOT NULL,
    "request_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "session_expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "submission_id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_by" VARCHAR(50),
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "complaint_counters" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "complaint_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_counters" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "request_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_counters" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_counters" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_counters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "academic_semesters_semester_code_key" ON "academic_semesters"("semester_code");

-- CreateIndex
CREATE UNIQUE INDEX "courses_course_code_key" ON "courses"("course_code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_name_key" ON "permissions"("permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "request_types_code_key" ON "request_types"("code");

-- CreateIndex
CREATE INDEX "students_program_id_idx" ON "students"("program_id");

-- CreateIndex
CREATE INDEX "students_current_semester_id_idx" ON "students"("current_semester_id");

-- CreateIndex
CREATE INDEX "students_status_idx" ON "students"("status");

-- CreateIndex
CREATE INDEX "military_training_military_training_completed_idx" ON "military_training"("military_training_completed");

-- CreateIndex
CREATE INDEX "student_courses_student_id_idx" ON "student_courses"("student_id");

-- CreateIndex
CREATE INDEX "student_courses_course_id_idx" ON "student_courses"("course_id");

-- CreateIndex
CREATE INDEX "student_courses_semester_id_idx" ON "student_courses"("semester_id");

-- CreateIndex
CREATE INDEX "student_courses_status_idx" ON "student_courses"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_ssn_key" ON "users"("ssn");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_ssn_idx" ON "users"("ssn");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "audit_logs_changed_by_idx" ON "audit_logs"("changed_by");

-- CreateIndex
CREATE INDEX "audit_logs_changed_at_idx" ON "audit_logs"("changed_at");

-- CreateIndex
CREATE INDEX "audit_logs_table_name_idx" ON "audit_logs"("table_name");

-- CreateIndex
CREATE INDEX "college_info_uploaded_by_idx" ON "college_info"("uploaded_by");

-- CreateIndex
CREATE INDEX "college_rules_files_uploaded_by_idx" ON "college_rules_files"("uploaded_by");

-- CreateIndex
CREATE INDEX "college_rules_files_is_active_idx" ON "college_rules_files"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "complaints_complaint_number_key" ON "complaints"("complaint_number");

-- CreateIndex
CREATE INDEX "complaints_student_id_idx" ON "complaints"("student_id");

-- CreateIndex
CREATE INDEX "complaints_handled_by_idx" ON "complaints"("handled_by");

-- CreateIndex
CREATE INDEX "complaints_status_idx" ON "complaints"("status");

-- CreateIndex
CREATE INDEX "complaints_created_at_idx" ON "complaints"("created_at");

-- CreateIndex
CREATE INDEX "complaints_priority_idx" ON "complaints"("priority");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "notifications_expires_at_idx" ON "notifications"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_token_idx" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_user_id_idx" ON "password_resets"("user_id");

-- CreateIndex
CREATE INDEX "password_resets_expires_at_idx" ON "password_resets"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_number_key" ON "payments"("payment_number");

-- CreateIndex
CREATE UNIQUE INDEX "payments_request_id_key" ON "payments"("request_id");

-- CreateIndex
CREATE INDEX "payments_student_id_idx" ON "payments"("student_id");

-- CreateIndex
CREATE INDEX "payments_request_id_idx" ON "payments"("request_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_payment_date_idx" ON "payments"("payment_date");

-- CreateIndex
CREATE UNIQUE INDEX "requests_request_number_key" ON "requests"("request_number");

-- CreateIndex
CREATE INDEX "requests_student_id_idx" ON "requests"("student_id");

-- CreateIndex
CREATE INDEX "requests_request_type_id_idx" ON "requests"("request_type_id");

-- CreateIndex
CREATE INDEX "requests_updated_by_idx" ON "requests"("updated_by");

-- CreateIndex
CREATE INDEX "requests_status_idx" ON "requests"("status");

-- CreateIndex
CREATE INDEX "requests_created_at_idx" ON "requests"("created_at");

-- CreateIndex
CREATE INDEX "request_documents_request_id_idx" ON "request_documents"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_user_id_key" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_counters_year_key" ON "complaint_counters"("year");

-- CreateIndex
CREATE INDEX "complaint_counters_year_idx" ON "complaint_counters"("year");

-- CreateIndex
CREATE UNIQUE INDEX "request_counters_year_key" ON "request_counters"("year");

-- CreateIndex
CREATE INDEX "request_counters_year_idx" ON "request_counters"("year");

-- CreateIndex
CREATE UNIQUE INDEX "user_counters_year_key" ON "user_counters"("year");

-- CreateIndex
CREATE INDEX "user_counters_year_idx" ON "user_counters"("year");

-- CreateIndex
CREATE UNIQUE INDEX "student_counters_year_key" ON "student_counters"("year");

-- CreateIndex
CREATE INDEX "student_counters_year_idx" ON "student_counters"("year");

-- AddForeignKey
ALTER TABLE "academic_programs" ADD CONSTRAINT "academic_programs_academic_staff_id_fkey" FOREIGN KEY ("academic_staff_id") REFERENCES "academic_staff"("staff_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_programs" ADD CONSTRAINT "academic_programs_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("program_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staff" ADD CONSTRAINT "academic_staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_prerequisites" ADD CONSTRAINT "course_prerequisites_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_prerequisites" ADD CONSTRAINT "course_prerequisites_prerequisite_course_id_fkey" FOREIGN KEY ("prerequisite_course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_courses" ADD CONSTRAINT "program_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_courses" ADD CONSTRAINT "program_courses_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("program_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("program_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_current_semester_id_fkey" FOREIGN KEY ("current_semester_id") REFERENCES "academic_semesters"("semester_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academic_staff_id_fkey" FOREIGN KEY ("academic_staff_id") REFERENCES "academic_staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_military_id_fkey" FOREIGN KEY ("military_id") REFERENCES "military_training"("military_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_courses" ADD CONSTRAINT "student_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_courses" ADD CONSTRAINT "student_courses_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "academic_semesters"("semester_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_courses" ADD CONSTRAINT "student_courses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_info" ADD CONSTRAINT "college_info_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "staff"("staff_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_rules_files" ADD CONSTRAINT "college_rules_files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "staff"("staff_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_handled_by_fkey" FOREIGN KEY ("handled_by") REFERENCES "staff"("staff_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_request_type_id_fkey" FOREIGN KEY ("request_type_id") REFERENCES "request_types"("request_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "staff"("staff_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_documents" ADD CONSTRAINT "request_documents_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("request_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_read_by_fkey" FOREIGN KEY ("read_by") REFERENCES "staff"("staff_id") ON DELETE SET NULL ON UPDATE CASCADE;
