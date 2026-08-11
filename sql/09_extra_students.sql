-- ==============================
-- EXTRA STUDENTS (طلاب إضافيون للبرامج المختلفة)
-- 22010025 → 22010039 — موزعين على 6 برامج
-- ملاحظة: ALTER TYPE تم نقله للـ migration
-- ملاحظة: requests والـ complaints موجودة في test-data/02_requests_complaints.sql
-- ==============================

INSERT INTO users (user_id, first_name, second_name, third_name, fourth_name, email, password, ssn, birth, phone, address, photo_url, is_active, created_at, updated_at, role_id)
VALUES
('22010025', 'Ahmed', 'Sami', 'Mohamed', 'Hassan', 'cds.ahmedsami22025@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG',  'SSN0115', '2002-01-15', '+20123456701', '25 Smouha, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010026', 'Nadia', 'Tarek', 'Ali', 'Ibrahim', 'cds.nadiatarek22026@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN05454', '2001-06-22', '+20123456702', '12 Miami, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010027', 'Hassan', 'Ramy', 'Sayed', 'Mostafa', 'cds.hassanramy22027@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN0247', '2003-08-10', '+20123456703', '30 Sporting, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010028', 'Laila', 'Fouad', 'Hassan', 'Ahmed', 'cds.lailafouad22028@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG',  'SSN0221', '2002-12-05', '+20123456704', '8 Sidi Bishr, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010029', 'Yassin', 'Waleed', 'Kamal', 'Said', 'cds.yassinwaleed22029@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN0249', '2001-04-18', '+20123456705', '15 Roushdy, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010030', 'Amira', 'Samir', 'Nabil', 'Hussein', 'cds.amirasamir22030@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN05455', '2003-03-14', '+20123456706', '20 Kafr Abdou, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010031', 'Khaled', 'Adel', 'Mohamed', 'Fathi', 'cds.khaledadel22031@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN0887', '2002-07-25', '+20123456707', '5 San Stefano, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010032', 'Mona', 'Ehab', 'Tawfik', 'Ali', 'cds.monaehab22032@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG',         'SSN05445', '2001-09-30', '+20123456708', '18 Louran, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010033', 'Ibrahim', 'Nader', 'Hassan', 'Omar', 'cds.ibrahimnader22033@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN03203', '2003-11-22', '+20123456709', '10 Zizinia, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010034', 'Samar', 'Gamal', 'Ahmed', 'Nour', 'cds.samargamal22034@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG',      'SSN0341', '2002-05-08', '+20123456710', '22 Saba Pasha, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010035', 'Mustafa', 'Hisham', 'Ibrahim', 'Sherif', 'cds.mustafahisham22035@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN03345', '2001-02-17', '+20123456711', '28 Glym, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010036', 'Dina', 'Ashraf', 'Sayed', 'Hassan', 'cds.dinaashraf22036@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN03446', '2003-06-29', '+20123456712', '14 Stanley, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010037', 'Tamer', 'Rashad', 'Ali', 'Mostafa', 'cds.tamerrashad22037@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN03327', '2002-10-13', '+20123456713', '6 Fleming, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010038', 'Rania', 'Kareem', 'Fouad', 'Nabil', 'cds.raniakareem22038@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN03824', '2001-12-04', '+20123456714', '17 Shatby, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010039', 'Wael', 'Sameh', 'Hassan', 'Adel', 'cds.waelsameh22039@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN03249', '2002-08-20', '+20123456715', '9 Camp Cesar, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1);


-- Intelligent Systems (1 student)
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010025', 'active', 0, '2020-09-01', 'general_secondary_science', 345, 'El Nasr Girls School', 'Egypt', 95, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Intelligent Systems' AND s.is_current = TRUE;

-- Healthcare Informatics and Data Analytics (2 students)
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010026', 'active', 0, '2019-09-01', 'steam', 350, 'Alexandria STEM', 'Egypt', 92, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Healthcare Informatics and Data Analytics' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010027', 'active', 2500, '2020-09-01', 'american_diploma', 341, 'Alexandria House', 'Egypt', 90, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Healthcare Informatics and Data Analytics' AND s.is_current = TRUE;

-- Business Analytics (3 students)
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010028', 'active', 0, '2021-09-01', 'general_secondary_math', 345, 'El Nasr Girls School', 'Egypt', 93, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Business Analytics' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010029', 'active', 0, '2020-09-01', 'IGCSE', 345, 'Victoria College', 'Egypt', 94, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Business Analytics' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010030', 'active', 5000, '2021-09-01', 'IB', 322, 'ACS Alexandria', 'Egypt', 96, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Business Analytics' AND s.is_current = TRUE;

-- Computing and Data Sciences (4 students)
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010031', 'active', 0, '2019-09-01', 'general_secondary_math', 345, 'Riyadh School', 'Saudi Arabia', 88, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010032', 'active', 17500, '2020-09-01', 'steam', 345, 'Alexandria STEM', 'Egypt', 93, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010033', 'active', 0, '2021-09-01', 'general_secondary_science', 345, 'Riyadh School', 'Kuwait', 89, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010034', 'active', 0, '2019-09-01', 'general_secondary_math', 350, 'Saint Marc College', 'Egypt', 88, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

-- Cybersecurity (3 students)
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010035', 'active', 10000, '2020-09-01', 'arab_equivalent', 354, 'Alexandria Secondary', 'Egypt', 91, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Cybersecurity' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010036', 'active', 8850, '2020-09-01', 'IGCSE', 340, 'New Ramses College', 'Egypt', 90, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Cybersecurity' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010037', 'active', 0, '2020-09-01', 'general_secondary_science', 342, 'El Manar School', 'Egypt', 86, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Cybersecurity' AND s.is_current = TRUE;

-- Media Analytics (2 students)
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010038', 'active', 2500, '2021-09-01', 'american_diploma', 387, 'Alexandria House', 'Egypt', 94, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Media Analytics' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010039', 'active', 0, '2020-09-01', 'general_secondary_math', 345, 'Victoria College', 'Egypt', 87, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Media Analytics' AND s.is_current = TRUE;

-- ============================================================
-- ⚠️  تأكد قبل التنفيذ:
-- migration 20260601000000_unify_request_status يشيل:
--   pending_doctor_approval في request_status enum
--   accepted, rejected في complaint_status enum
