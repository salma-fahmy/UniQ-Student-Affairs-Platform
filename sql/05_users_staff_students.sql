
-- ==============================
-- 4. INSERT USERS
-- ==============================

-- Students (role_id = 1)
INSERT INTO users (user_id, first_name, second_name, third_name, fourth_name, email, password, ssn, birth, phone, address, photo_url, is_active, created_at, updated_at, role_id)
VALUES
('22010001','Rahma'  ,'Ramadan', 'Hassan', 'Abdelgany', 'cds.rahmaramadan23114@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN001', '2002-05-15', '+20123456789', '25 Smouha, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010002', 'Ziad', 'Mohamed', 'Ibrahim', 'Shalaby', 'cds.ziadmohamed23134@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN002', '2001-03-22', '+20198765432', '22 Alexandria Road, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010003', 'Esra', 'Mostafa', 'Ibrahim', 'Ahmed', 'cds.esraamostafa23052@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN003', '2002-11-10', '+20111222333', '15 Miami, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010004', 'Reem', 'Rafik', 'Nagib', 'Elsayed', 'cds.reemrafik23129@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN004', '2000-07-08', '+20144556677', '8 San Stefano, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010005', 'Salma', 'Fahmy', 'Hassan', 'Hassan', 'cds.salmafahmy23150@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN005', '2003-09-30', '+20199887766', '12 Sidi Bishr, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010006', 'Sabah', 'Ahmed', 'Mohamed', 'Abdelsalam', 'cds.sabahahmed23171@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN006', '2002-12-05', '+20155667788', '7 Sporting, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010007', 'Osama', 'Mohamed', 'Abdelshafy', 'Fouad', 'cds.osamamohamed23050@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN007', '2001-08-18', '+20166778899', '3 Roushdy, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010008', 'Nour', 'Khaled', 'Ahmed', 'Hassan', 'cds.nour.khaled21001@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN008', '2000-01-15', '+20177889900', '10 Cleopatra, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', FALSE, NOW(), NOW(), 1),
('22010009', 'Omar', 'Hassan', 'Ali', 'Mohamed', 'cds.omar.hassan24001@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN009', '2003-06-20', '+20188990011', '5 Saba Pasha, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010010', 'Mariam', 'Ahmed', 'Said', 'Ibrahim', 'cds.mariam.ahmed23003@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN010', '2002-04-12', '+20199001122', '20 Gianaclis, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', FALSE, NOW(), NOW(), 1),
('22010011', 'Youssef', 'Mostafa', 'Kamal', 'Hassan', 'cds.youssef.mostafa22002@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN011', '2001-11-28', '+20200112233', '14 Stanley, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010012', 'Fatima', 'Tarek', 'Hassan', 'Ali', 'cds.fatima.tarek22005@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN012', '2001-09-15', '+20211223344', '25 Kafr Abdou, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010013', 'Ali', 'Hussein', 'Mohamed', 'Sayed', 'cds.ali.hussein23007@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN013', '2002-07-20', '+20222334455', '18 Louran, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010014', 'Hana', 'Sherif', 'Ahmed', 'Mostafa', 'cds.hana.sherif24008@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN014', '2003-03-12', '+20233445566', '7 Zizinia, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1),
('22010015', 'Karim', 'Wael', 'Ibrahim', 'Hassan', 'cds.karim.wael22009@alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN015', '2001-11-08', '+20244556677', '14 Sidi Gaber, Alexandria', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 1);

-- Academic Staff (role_id = 2)
INSERT INTO users (user_id, first_name, second_name, third_name, fourth_name, email, password, ssn, birth, phone, address, photo_url, is_active, created_at, updated_at, role_id)
VALUES
('ahmed-abdullah-1975-016', 'Ahmed', 'Abdullah', 'Saleh', 'Mohamed', 'ahmed.abdullah@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN016', '1975-08-20', '+20110222333', '25 Nasr City, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 2),
('sarah-johnson-1980-017', 'Sarah', 'Johnson', 'Ahmed', 'Ali', 'sarah.johnson@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN017', '1980-03-15', '+20111822334', '12 Zamalek, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 2),
('mahmoud-elsayed-1972-018', 'Mahmoud', 'El-Sayed', 'Hassan', 'Ibrahim', 'mahmoud.elsayed@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN018', '1972-11-05', '+20133222444', '8 Maadi, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 2),
('layla-hassan-1978-019', 'Layla', 'Hassan', 'Mohamed', 'Ahmed', 'layla.hassan@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN019', '1978-06-25', '+20148556677', '5 Heliopolis, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 2),
('karim-mostafa-1982-020', 'Karim', 'Mostafa', 'Sayed', 'Ali', 'karim.mostafa@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN020', '1982-09-12', '+20155767788', '10 Dokki, Giza', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 2),
('nadia-ibrahim-1976-021', 'Nadia', 'Ibrahim', 'Fawzy', 'Hassan', 'nadia.ibrahim@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN021', '1976-04-18', '+20156778899', '15 Mohandessin, Giza', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 2),
('tamer-hassan-1979-022', 'Tamer', 'Hassan', 'Mohamed', 'Elsayed', 'tamer.hassan@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN022', '1979-11-30', '+20117889900', '3 Agouza, Giza', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 2),
('hoda-mahmoud-1981-023', 'Hoda', 'Mahmoud', 'Abdelrahman', 'Sayed', 'hoda.mahmoud@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN023', '1981-07-22', '+20178990011', '20 Shubra, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 2),
('sameh-farouk-1974-024', 'Sameh', 'Farouk', 'Ahmed', 'Ali', 'sameh.farouk@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN024', '1974-09-14', '+20159001122', '7 Nasr City, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 2);

-- Affairs Staff (role_id = 3)
INSERT INTO users (user_id, first_name, second_name, third_name, fourth_name, email, password, ssn, birth, phone, address, photo_url, is_active, created_at, updated_at, role_id)
VALUES
('hossam-mahmoud-1985-025', 'Hossam', 'Mahmoud', 'Ahmed', 'Eid', 'hossam.mahmoud@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN025', '1985-04-10', '+20111222335', '20 Mohandessin, Giza', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 3),
('mona-youssef-1988-026', 'Mona', 'Youssef', 'Saad', 'El-Din', 'mona.youssef@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN026', '1988-12-03', '+20122333444', '15 Helwan, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 3),
('khaled-abdelrahman-1983-027', 'Khaled', 'Abdelrahman', 'Tawfik', 'Hassan', 'khaled.abdelrahman@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN027', '1983-07-18', '+20133444555', '3 Shubra, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 3),
('amira-hassan-1986-028', 'Amira', 'Hassan', 'Ahmed', 'Mahmoud', 'amira.hassan@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN028', '1986-02-25', '+20144555666', '12 Dokki, Giza', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 3),
('yasser-mostafa-1984-029', 'Yasser', 'Mostafa', 'Kamal', 'Eid', 'yasser.mostafa@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN029', '1984-08-14', '+20155666777', '8 Maadi, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 3);

-- Admin (role_id = 4)
INSERT INTO users (user_id, first_name, second_name, third_name, fourth_name, email, password, ssn, birth, phone, address, photo_url, is_active, created_at, updated_at, role_id)
VALUES
('admin-system-1980-030', 'Admin', 'System', 'CS', 'Faculty', 'admin@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN030', '1980-01-01', '+20100123456', '1 CS Faculty Building, Cairo', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 4),
('super-admin-1975-031', 'Super', 'Admin', 'Root', 'User', 'super.admin@cs.alexu.edu.eg', '$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG', 'SSN031', '1975-06-15', '+20111223344', 'Admin Office, CS Faculty', 'https://res.cloudinary.com/di1l2qchp/image/upload/avatar-photo_gswvqo_ilrzo7.webp', TRUE, NOW(), NOW(), 4);


-- ==============================
-- 5. INSERT STAFF
-- ==============================

-- Academic Staff (9 records)
INSERT INTO staff (staff_id, job_title, hire_date, department, created_at) VALUES
('ahmed-abdullah-1975-016', 'Professor', '2010-09-01', 'Computer Science', NOW()),
('sarah-johnson-1980-017', 'Associate Professor', '2012-01-15', 'Computer Science', NOW()),
('mahmoud-elsayed-1972-018', 'Professor', '2008-03-10', 'Computer Science', NOW()),
('layla-hassan-1978-019', 'Assistant Professor', '2015-09-01', 'Computer Science', NOW()),
('karim-mostafa-1982-020', 'Associate Professor', '2013-08-15', 'Computer Science', NOW()),
('nadia-ibrahim-1976-021', 'Professor', '2009-05-20', 'Artificial Intelligence', NOW()),
('tamer-hassan-1979-022', 'Assistant Professor', '2016-11-10', 'Computer Science', NOW()),
('hoda-mahmoud-1981-023', 'Associate Professor', '2011-08-01', 'Information Systems', NOW()),
('sameh-farouk-1974-024', 'Professor', '2007-02-15', 'Data Science', NOW());

-- Affairs Staff (5 records)
INSERT INTO staff (staff_id, job_title, hire_date, department, created_at) VALUES
('hossam-mahmoud-1985-025', 'Student Affairs Officer', '2018-06-01', 'CS Faculty', NOW()),
('mona-youssef-1988-026', 'Senior Student Affairs Officer', '2016-03-15', 'CS Faculty', NOW()),
('khaled-abdelrahman-1983-027', 'Financial Affairs Officer', '2019-01-10', 'CS Faculty', NOW()),
('amira-hassan-1986-028', 'Academic Advisor', '2020-09-01', 'CS Faculty', NOW()),
('yasser-mostafa-1984-029', 'Examinations Officer', '2017-11-15', 'CS Faculty', NOW());

-- Admin Staff (2 records)
INSERT INTO staff (staff_id, job_title, hire_date, department, created_at) VALUES
('admin-system-1980-030', 'System Administrator', '2020-01-01', 'CS Faculty IT', NOW()),
('super-admin-1975-031', 'IT Director', '2018-05-15', 'CS Faculty IT', NOW());


-- ==============================
-- 6. INSERT ACADEMIC STAFF DETAILS
-- ==============================

INSERT INTO academic_staff (staff_id, academic_rank, specialization, office_location, office_hours) VALUES
('ahmed-abdullah-1975-016', 'Professor', 'Artificial Intelligence', 'CS Building, Room 101', 'Sunday-Tuesday 10:00-12:00'),
('sarah-johnson-1980-017', 'Associate Professor', 'Database Systems', 'CS Building, Room 102', 'Monday-Wednesday 13:00-15:00'),
('mahmoud-elsayed-1972-018', 'Professor', 'Computer Networks', 'CS Building, Room 103', 'Sunday-Thursday 09:00-11:00'),
('layla-hassan-1978-019', 'Assistant Professor', 'Web Development', 'CS Building, Room 104', 'Tuesday-Thursday 14:00-16:00'),
('karim-mostafa-1982-020', 'Associate Professor', 'Cybersecurity', 'CS Building, Room 105', 'Monday-Wednesday 11:00-13:00'),
('nadia-ibrahim-1976-021', 'Professor', 'Machine Learning', 'CS Building, Room 106', 'Sunday-Tuesday 11:00-13:00'),
('tamer-hassan-1979-022', 'Assistant Professor', 'Software Engineering', 'CS Building, Room 107', 'Monday-Thursday 15:00-17:00'),
('hoda-mahmoud-1981-023', 'Associate Professor', 'Information Systems', 'CS Building, Room 108', 'Tuesday-Thursday 10:00-12:00'),
('sameh-farouk-1974-024', 'Professor', 'Big Data Analytics', 'CS Building, Room 109', 'Sunday-Wednesday 13:00-15:00');


-- ==============================
-- 7. INSERT STUDENTS
-- ==============================
-- Note: academic_staff_id is required (NOT NULL in schema)
-- Using 'ahmed-abdullah-1975-016' as default academic advisor for all students

-- ==============================
-- 7. INSERT STUDENTS
-- ==============================
-- Using 'ahmed-abdullah-1975-016' as default academic advisor for all students
-- Using 'Computing and Data Sciences' as default program
-- Using current semester as current_semester_id

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010001', 'active', 0, '2020-09-01', 'general_secondary_science', 345, 'El Nasr Girls School', 'Egypt', 95, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010002', 'active', 0, '2019-09-01', 'steam', 350, 'Alexandria STEM', 'Egypt', 92, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010003', 'active', 0, '2020-09-01', 'IGCSE', 345, 'Victoria College', 'Egypt', 94, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010004', 'active', 4520, '2020-09-01', 'american_diploma', 341, 'Alexandria House', 'Egypt', 90, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010005', 'active', 0, '2021-09-01', 'general_secondary_science', 345, 'El Nasr Girls School', 'Egypt', 93, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010006', 'active', 0, '2020-09-01', 'IB', 322, 'ACS Alexandria', 'Egypt', 96, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010007', 'active', 0, '2019-09-01', 'general_secondary_math', 345, 'Riyadh School', 'Saudi Arabia', 88, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010008', 'active', 17500, '2020-09-01', 'steam', 345, 'Alexandria STEM', 'Egypt', 93, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010009', 'active', 0, '2021-09-01', 'general_secondary_science', 345, 'Riyadh School', 'Kuwait', 89, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010010', 'active', 10000, '2020-09-01', 'arab_equivalent', 354, 'Alexandria Secondary', 'Egypt', 91, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010011', 'active', 0, '2020-09-01', 'general_secondary_math', 345, 'Victoria College', 'Egypt', 87, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010012', 'active', 8850, '2020-09-01', 'IGCSE', 340, 'New Ramses College', 'Egypt', 90, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010013', 'active', 0, '2020-09-01', 'general_secondary_science', 342, 'El Manar School', 'Egypt', 86, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010014', 'active', 2500, '2021-09-01', 'american_diploma', 387, 'Alexandria House', 'Egypt', 94, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22010015', 'active', 0, '2019-09-01', 'general_secondary_math', 350, 'Saint Marc College', 'Egypt', 88, NOW(), NOW(), p.program_id, s.semester_id, NULL, 'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s
WHERE p.program_name_en = 'Computing and Data Sciences' AND s.is_current = TRUE;
