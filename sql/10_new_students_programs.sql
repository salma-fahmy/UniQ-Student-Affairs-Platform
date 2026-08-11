-- =============================================================================
-- NEW SEED: COURSE PREREQUISITES 
-- =============================================================================


INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00108' AND p.course_code = '02-24-00105'  -- Data Structures <- Programming I
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00109' AND p.course_code = '02-24-00103'  -- Intro AI <- Intro Computer Systems
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00110' AND p.course_code = '02-24-00105'  -- Programming II <- Programming I
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00201' AND p.course_code = '02-24-00106'  -- Prob & Stats II <- Prob & Stats I
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00202' AND p.course_code = '02-24-00105'  -- Intro Databases <- Programming I
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00203' AND p.course_code = '02-24-00101'  -- Numerical Computations <- Linear Algebra
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00204' AND p.course_code = '02-24-00108'  -- Cloud Computing <- Data Structures
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00205' AND p.course_code = '02-24-00109'  -- Machine Learning <- Intro AI
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00206' AND p.course_code = '02-24-00201'  -- Data Mining <- Prob & Stats II
ON CONFLICT DO NOTHING;

-- Faculty Elective prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00301' AND p.course_code = '02-24-00110'  -- Software Engineering <- Programming II
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00303' AND p.course_code = '02-24-00108'  -- Algorithm Design <- Data Structures
ON CONFLICT DO NOTHING;

-- Distributed Processing <- Intro Computer Systems + Data Structures
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00304' AND p.course_code IN ('02-24-00103','02-24-00108')
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00305' AND p.course_code = '02-24-00105'  -- Mobile Programming <- Programming I
ON CONFLICT DO NOTHING;

INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00306' AND p.course_code = '02-24-00105'  -- Web Programming <- Programming I
ON CONFLICT DO NOTHING;

-- Operating Systems <- Intro Computer Systems + Programming I
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00307' AND p.course_code IN ('02-24-00103','02-24-00105')
ON CONFLICT DO NOTHING;

-- Computer Networks <- Intro Computer Systems + Programming I
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, created_at)
SELECT c.course_id, p.course_id, NOW()
FROM courses c, courses p
WHERE c.course_code = '02-24-00308' AND p.course_code IN ('02-24-00103','02-24-00105')
ON CONFLICT DO NOTHING;


-- =============================================================================
-- NEW SEED: STUDENTS ACROSS ALL PROGRAMS, ALL LEVELS
-- =============================================================================

INSERT INTO users (user_id, first_name, second_name, third_name, fourth_name, email, password, ssn, birth, phone, address, photo_url, is_active, created_at, updated_at, role_id)
VALUES
-- CDS: Level 1 (enrolled in Sem1 courses only)
('22020001','Layla','Hossam','Nasser','Emad','cds.layla.new25001@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST001','2004-03-10','+20100200001','1 Smouha, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- CDS: Level 2 (completed Sem1+2)
('22020002','Omar','Saeed','Hamdy','Nour','cds.omar.new25002@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST002','2003-07-22','+20100200002','2 Miami, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- CDS: Level 3 (completed 4 semesters)
('22020003','Sara','Adel','Mahmoud','Hassan','cds.sara.new25003@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST003','2002-01-15','+20100200003','3 Sporting, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- CDS: Level 4 / Graduated
('22020004','Ramy','Fathy','Ibrahim','Salah','cds.ramy.new25004@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST004','2001-11-05','+20100200004','4 Kafr Abdou, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- CDS: New (no courses yet)
('22020005','Nadia','Wael','Said','Gomaa','cds.nadia.new25005@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST005','2005-05-20','+20100200005','5 Stanley, Alexandria',NULL,TRUE,NOW(),NOW(),1),

-- Business Analytics: Level 1
('22020011','Khaled','Nabil','Hassan','Fouad','ba.khaled.new25001@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST011','2004-08-14','+20100200011','11 Sidi Bishr, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Business Analytics: Level 2
('22020012','Mona','Kareem','Ali','Sayed','ba.mona.new25002@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST012','2003-04-09','+20100200012','12 Roushdy, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Business Analytics: Level 3
('22020013','Amr','Tarek','Gomaa','Hussein','ba.amr.new25003@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST013','2002-12-25','+20100200013','13 San Stefano, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Business Analytics: Level 4 Graduated
('22020014','Rana','Sherif','Mostafa','Ahmed','ba.rana.new25004@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST014','2001-09-18','+20100200014','14 Glym, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Business Analytics: New (no courses)
('22020015','Hana','Ramzy','Adel','Fares','ba.hana.new25005@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST015','2005-02-28','+20100200015','15 Zizinia, Alexandria',NULL,TRUE,NOW(),NOW(),1),

-- Intelligent Systems: Level 1
('22020021','Youssef','Sameh','Riad','Tawfik','is.youssef.new25001@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST021','2004-06-01','+20100200021','21 Cleopatra, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Intelligent Systems: Level 2
('22020022','Salma','Ehab','Kamal','Mansour','is.salma.new25002@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST022','2003-10-17','+20100200022','22 Saba Pasha, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Intelligent Systems: Level 3
('22020023','Islam','Hany','Farouk','Ibrahim','is.islam.new25003@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST023','2002-07-30','+20100200023','23 Louran, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Intelligent Systems: Level 4
('22020024','Dalia','Ahmed','Saber','Nasser','is.dalia.new25004@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST024','2001-03-12','+20100200024','24 Agami, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Intelligent Systems: New
('22020025','Zeinab','Mostafa','Helmy','Sawi','is.zeinab.new25005@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST025','2005-08-03','+20100200025','25 Agouza, Giza',NULL,TRUE,NOW(),NOW(),1),

-- Media Analytics: Level 1
('22020031','Hassan','Wael','Tamer','Fawzy','ma.hassan.new25001@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST031','2004-01-19','+20100200031','31 Bolkly, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Media Analytics: Level 2
('22020032','Nour','Amr','Sayed','Khatab','ma.nour.new25002@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST032','2003-05-24','+20100200032','32 Moharrem Bek, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Media Analytics: Level 3
('22020033','Mariam','Gamal','Aly','Halim','ma.mariam.new25003@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST033','2002-09-07','+20100200033','33 Shatby, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Media Analytics: Level 4
('22020034','Tarek','Magdy','Hosny','Rizk','ma.tarek.new25004@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST034','2001-12-31','+20100200034','34 Victoria, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Media Analytics: New
('22020035','Heba','Osama','Taha','Salem','ma.heba.new25005@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST035','2005-04-16','+20100200035','35 Camp Cesar, Alexandria',NULL,TRUE,NOW(),NOW(),1),

-- Healthcare Informatics: Level 1
('22020041','Basma','Tarek','Nada','Amin','hida.basma.new25001@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST041','2004-11-02','+20100200041','41 Fleming, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Healthcare Informatics: Level 2
('22020042','Mohamed','Sherif','Hazem','Gabr','hida.mohamed.new25002@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST042','2003-08-15','+20100200042','42 El Ibrahimiya, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Healthcare Informatics: Level 3
('22020043','Ghada','Ayman','Lotfy','Khalil','hida.ghada.new25003@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST043','2002-04-28','+20100200043','43 Gianaclis, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Healthcare Informatics: Level 4
('22020044','Karim','Bassem','Samir','Khalifa','hida.karim.new25004@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST044','2001-01-08','+20100200044','44 Mandara, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Healthcare Informatics: New
('22020045','Farah','Nasser','Riad','Barakat','hida.farah.new25005@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST045','2005-06-11','+20100200045','45 El Maamoura, Alexandria',NULL,TRUE,NOW(),NOW(),1),

-- Cybersecurity: Level 1
('22020051','Mahmoud','Hisham','Ragab','Farhat','cy.mahmoud.new25001@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST051','2004-09-23','+20100200051','51 Rushdy, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Cybersecurity: Level 2
('22020052','Noha','Sameh','Wagih','Attia','cy.noha.new25002@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST052','2003-02-04','+20100200052','52 El Wardian, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Cybersecurity: Level 3
('22020053','Alaa','Fady','Medhat','Morsi','cy.alaa.new25003@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST053','2002-06-17','+20100200053','53 Muharam Bek, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Cybersecurity: Level 4
('22020054','Eman','Ramy','Tharwat','Abdalla','cy.eman.new25004@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST054','2001-10-29','+20100200054','54 Bab Sharq, Alexandria',NULL,TRUE,NOW(),NOW(),1),
-- Cybersecurity: New
('22020055','Samy','Lotfy','Emad','Yones','cy.samy.new25005@alexu.edu.eg','$2b$10$wsBnDlh58g7f4ipkFUKFP.zqpkQ5AH64ur7RatP6pMHQVynen2NEG','SSNTEST055','2005-12-06','+20100200055','55 El Attarin, Alexandria',NULL,TRUE,NOW(),NOW(),1);


-- =============================================================================
-- INSERT STUDENTS TABLE
-- =============================================================================

-- --- CDS ---
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020001','active',0,'2024-09-01','general_secondary_science',345,'El Nasr Girls School','Egypt',92,NOW(),NOW(),p.program_id,s.semester_id,NULL,'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s WHERE p.program_name_en='Computing and Data Sciences' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020002','active',0,'2023-09-01','steam',352,'Alexandria STEM','Egypt',94,NOW(),NOW(),p.program_id,s.semester_id,NULL,'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s WHERE p.program_name_en='Computing and Data Sciences' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020003','active',0,'2022-09-01','IGCSE',344,'Victoria College','Egypt',96,NOW(),NOW(),p.program_id,s.semester_id,NULL,'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s WHERE p.program_name_en='Computing and Data Sciences' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020004','graduated',0,'2021-09-01','general_secondary_math',350,'Riyadh School','Saudi Arabia',90,NOW(),NOW(),p.program_id,NULL,NULL,'ahmed-abdullah-1975-016'
FROM programs p WHERE p.program_name_en='Computing and Data Sciences';

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020005','active',0,'2024-09-01','IB',325,'ACS Alexandria','Egypt',95,NOW(),NOW(),p.program_id,s.semester_id,NULL,'ahmed-abdullah-1975-016'
FROM programs p, academic_semesters s WHERE p.program_name_en='Computing and Data Sciences' AND s.is_current=TRUE;

-- --- Business Analytics ---
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020011','active',0,'2024-09-01','general_secondary_science',340,'El Manar School','Egypt',88,NOW(),NOW(),p.program_id,s.semester_id,NULL,'sarah-johnson-1980-017'
FROM programs p, academic_semesters s WHERE p.program_name_en='Business Analytics' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020012','active',3600,'2023-09-01','american_diploma',385,'Alexandria House','Egypt',91,NOW(),NOW(),p.program_id,s.semester_id,NULL,'sarah-johnson-1980-017'
FROM programs p, academic_semesters s WHERE p.program_name_en='Business Analytics' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020013','active',0,'2022-09-01','general_secondary_math',346,'Saint Marc College','Egypt',89,NOW(),NOW(),p.program_id,s.semester_id,NULL,'sarah-johnson-1980-017'
FROM programs p, academic_semesters s WHERE p.program_name_en='Business Analytics' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020014','graduated',0,'2021-09-01','IGCSE',343,'New Ramses College','Egypt',93,NOW(),NOW(),p.program_id,NULL,NULL,'sarah-johnson-1980-017'
FROM programs p WHERE p.program_name_en='Business Analytics';

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020015','active',0,'2024-09-01','general_secondary_science',338,'Riyadh School','Kuwait',87,NOW(),NOW(),p.program_id,s.semester_id,NULL,'sarah-johnson-1980-017'
FROM programs p, academic_semesters s WHERE p.program_name_en='Business Analytics' AND s.is_current=TRUE;

-- --- Intelligent Systems ---
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020021','active',0,'2024-09-01','steam',349,'Alexandria STEM','Egypt',93,NOW(),NOW(),p.program_id,s.semester_id,NULL,'nadia-ibrahim-1976-021'
FROM programs p, academic_semesters s WHERE p.program_name_en='Intelligent Systems' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020022','active',0,'2023-09-01','general_secondary_math',347,'El Nasr Girls School','Egypt',90,NOW(),NOW(),p.program_id,s.semester_id,NULL,'nadia-ibrahim-1976-021'
FROM programs p, academic_semesters s WHERE p.program_name_en='Intelligent Systems' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020023','active',5400,'2022-09-01','IB',320,'ACS Alexandria','Egypt',95,NOW(),NOW(),p.program_id,s.semester_id,NULL,'nadia-ibrahim-1976-021'
FROM programs p, academic_semesters s WHERE p.program_name_en='Intelligent Systems' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020024','graduated',0,'2021-09-01','general_secondary_science',351,'Victoria College','Egypt',92,NOW(),NOW(),p.program_id,NULL,NULL,'nadia-ibrahim-1976-021'
FROM programs p WHERE p.program_name_en='Intelligent Systems';

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020025','active',0,'2024-09-01','american_diploma',390,'Alexandria House','Egypt',96,NOW(),NOW(),p.program_id,s.semester_id,NULL,'nadia-ibrahim-1976-021'
FROM programs p, academic_semesters s WHERE p.program_name_en='Intelligent Systems' AND s.is_current=TRUE;

-- --- Media Analytics ---
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020031','active',0,'2024-09-01','general_secondary_science',336,'El Manar School','Egypt',85,NOW(),NOW(),p.program_id,s.semester_id,NULL,'hoda-mahmoud-1981-023'
FROM programs p, academic_semesters s WHERE p.program_name_en='Media Analytics' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020032','active',2400,'2023-09-01','IGCSE',342,'New Ramses College','Egypt',91,NOW(),NOW(),p.program_id,s.semester_id,NULL,'hoda-mahmoud-1981-023'
FROM programs p, academic_semesters s WHERE p.program_name_en='Media Analytics' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020033','active',0,'2022-09-01','general_secondary_math',344,'Saint Marc College','Egypt',88,NOW(),NOW(),p.program_id,s.semester_id,NULL,'hoda-mahmoud-1981-023'
FROM programs p, academic_semesters s WHERE p.program_name_en='Media Analytics' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020034','graduated',0,'2021-09-01','american_diploma',380,'Alexandria House','Egypt',94,NOW(),NOW(),p.program_id,NULL,NULL,'hoda-mahmoud-1981-023'
FROM programs p WHERE p.program_name_en='Media Analytics';

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020035','active',0,'2024-09-01','steam',348,'Alexandria STEM','Egypt',93,NOW(),NOW(),p.program_id,s.semester_id,NULL,'hoda-mahmoud-1981-023'
FROM programs p, academic_semesters s WHERE p.program_name_en='Media Analytics' AND s.is_current=TRUE;

-- --- Healthcare Informatics ---
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020041','active',0,'2024-09-01','general_secondary_science',343,'El Nasr Girls School','Egypt',90,NOW(),NOW(),p.program_id,s.semester_id,NULL,'mahmoud-elsayed-1972-018'
FROM programs p, academic_semesters s WHERE p.program_name_en='Healthcare Informatics and Data Analytics' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020042','active',0,'2023-09-01','IB',324,'ACS Alexandria','Egypt',94,NOW(),NOW(),p.program_id,s.semester_id,NULL,'mahmoud-elsayed-1972-018'
FROM programs p, academic_semesters s WHERE p.program_name_en='Healthcare Informatics and Data Analytics' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020043','active',7200,'2022-09-01','american_diploma',383,'Alexandria House','Egypt',92,NOW(),NOW(),p.program_id,s.semester_id,NULL,'mahmoud-elsayed-1972-018'
FROM programs p, academic_semesters s WHERE p.program_name_en='Healthcare Informatics and Data Analytics' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020044','graduated',0,'2021-09-01','general_secondary_math',349,'Saint Marc College','Egypt',89,NOW(),NOW(),p.program_id,NULL,NULL,'mahmoud-elsayed-1972-018'
FROM programs p WHERE p.program_name_en='Healthcare Informatics and Data Analytics';

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020045','active',0,'2024-09-01','steam',351,'Alexandria STEM','Egypt',95,NOW(),NOW(),p.program_id,s.semester_id,NULL,'mahmoud-elsayed-1972-018'
FROM programs p, academic_semesters s WHERE p.program_name_en='Healthcare Informatics and Data Analytics' AND s.is_current=TRUE;

-- --- Cybersecurity ---
INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020051','active',0,'2024-09-01','general_secondary_science',341,'Riyadh School','Saudi Arabia',88,NOW(),NOW(),p.program_id,s.semester_id,NULL,'karim-mostafa-1982-020'
FROM programs p, academic_semesters s WHERE p.program_name_en='Cybersecurity' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020052','active',9000,'2023-09-01','IGCSE',340,'Victoria College','Egypt',91,NOW(),NOW(),p.program_id,s.semester_id,NULL,'karim-mostafa-1982-020'
FROM programs p, academic_semesters s WHERE p.program_name_en='Cybersecurity' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020053','active',0,'2022-09-01','general_secondary_math',346,'El Manar School','Egypt',87,NOW(),NOW(),p.program_id,s.semester_id,NULL,'karim-mostafa-1982-020'
FROM programs p, academic_semesters s WHERE p.program_name_en='Cybersecurity' AND s.is_current=TRUE;

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020054','graduated',0,'2021-09-01','american_diploma',387,'Alexandria House','Egypt',93,NOW(),NOW(),p.program_id,NULL,NULL,'karim-mostafa-1982-020'
FROM programs p WHERE p.program_name_en='Cybersecurity';

INSERT INTO students (student_id, status, fees_due, enrollment_date, secondary_qualification, secondary_grade, secondary_school, country, secondary_english_grade, created_at, updated_at, program_id, current_semester_id, military_id, academic_staff_id)
SELECT '22020055','active',0,'2024-09-01','IB',323,'ACS Alexandria','Egypt',96,NOW(),NOW(),p.program_id,s.semester_id,NULL,'karim-mostafa-1982-020'
FROM programs p, academic_semesters s WHERE p.program_name_en='Cybersecurity' AND s.is_current=TRUE;


-- =============================================================================
-- STUDENT COURSES
--
-- Grading system (Article 9):
--   work (coursework) + mid_term + final = total
--   final ranges between 50-70 out of 100 total
--   Regulatory fail (F): less than 30% of written exam (i.e. less than 15 if final max=50)
--
-- Grade calculated from total score:
--   A: 90%+ | A-: 85-89 | B+: 80-84 | B: 75-79 | B-: 70-74
--   C+: 65-69 | C: 60-64 | C-: 56-59 | D+: 53-55 | D: 50-52 | F: below 50%
--
-- Distribution: work max=20, mid_term max=10, final max=70 (total=100)
-- =============================================================================

-- ---------------------------------------------------------
-- 22020001 - CDS - Level 1 (currently in first semester, no completed courses)
-- ---------------------------------------------------------
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020001', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00101','02-24-00102','02-24-00103','02-24-00104','02-24-00105','02-00-00001')
AND s.is_current = TRUE;

-- ---------------------------------------------------------
-- 22020002 - CDS - Level 2 (completed Sem1+Sem2, enrolled in Sem3)
-- ---------------------------------------------------------
-- Completed Semester 1 (F2023)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 18, 62, 9, 'A', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00101' AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 16, 58, 8, 'A-', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00102' AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 15, 55, 9, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00103' AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 14, 53, 8, 'B', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00104' AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00105' AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 2, 0, 0, 'S', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-00-00001' AND s.semester_code='F2023';

-- Completed Semester 2 (S2024)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00106' AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 15, 53, 7, 'B', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00107' AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 14, 52, 8, 'B', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00108' AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 13, 50, 7, 'B-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00109' AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 16, 55, 8, 'A-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00110' AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 2, 0, 0, 'S', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-00-00002' AND s.semester_code='S2024';

-- Currently enrolled Semester 3 (F2024 - current)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020002', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00201','02-24-00202','02-24-00203','02-24-01201','02-24-01202')
AND s.is_current = TRUE;

-- ---------------------------------------------------------
-- 22020003 - CDS - Level 3 (completed 4 semesters, ~68 credit hours)
-- ---------------------------------------------------------
-- Sem1 completed (F2022)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 18, 64, 8, 'A', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00101' AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00102' AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00103' AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 15, 55, 9, 'A-', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00104' AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 19, 65, 9, 'A', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00105' AND s.semester_code='F2022';
-- Sem2 (S2023)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 17, 59, 8, 'A-', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00106' AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 16, 56, 9, 'A-', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00108' AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 15, 53, 8, 'B+', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00110' AND s.semester_code='S2023';
-- Sem3 (F2023)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00201' AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00202' AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00203' AND s.semester_code='F2023';
-- Sem4 (S2024)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00204' AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00205' AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code='02-24-00206' AND s.semester_code='S2024';
-- Currently Enrolled Sem5 (F2024)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020003', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-01301','02-24-01302','02-24-01303')
AND s.is_current = TRUE;

-- ---------------------------------------------------------
-- 22020004 - CDS - Level 4 / GRADUATED (140+ credit hours)
-- ---------------------------------------------------------
-- Core faculty courses completed across past semesters
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020004', c.course_id, s.semester_id, 18, 62, 9, 'A', 'completed', '2021-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00102','02-24-00103','02-24-00104','02-24-00105') AND s.semester_code='F2021';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020004', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2022-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00106','02-24-00107','02-24-00108','02-24-00109','02-24-00110') AND s.semester_code='S2022';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020004', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00201','02-24-00202','02-24-00203','02-24-01201','02-24-01202') AND s.semester_code='F2022';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020004', c.course_id, s.semester_id, 16, 56, 8, 'A-', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00204','02-24-00205','02-24-00206','02-24-01203','02-24-01204') AND s.semester_code='S2023';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020004', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-01301','02-24-01302','02-24-01303') AND s.semester_code='F2023';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020004', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-01304','02-24-01305','02-24-01306') AND s.semester_code='S2024';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020004', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2024-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-01401','02-24-01402','02-24-01403','02-24-01404') AND s.semester_code='F2024';

INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020004', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2024-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-01405','02-24-01406','02-24-01407','02-24-01408') AND s.semester_code='F2024';

-- ---------------------------------------------------------
-- 22020005 - CDS - NEW (registered, no courses assigned yet)
-- No student_courses inserts needed
-- ---------------------------------------------------------

-- ---------------------------------------------------------
-- Business Analytics - Level 1 (22020011)
-- ---------------------------------------------------------
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020011', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00101','02-24-00102','02-24-00103','02-24-00104','02-24-00105','02-00-00001')
AND s.is_current = TRUE;

-- Business Analytics - Level 2 (22020012) - completed Sem1+2
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020012', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00101','02-24-00102','02-24-00103','02-24-00104','02-24-00105') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020012', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00106','02-24-00107','02-24-00108','02-24-00109','02-24-00110') AND s.semester_code='S2024';
-- BA-specific Sem3 enrolled
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020012', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00201','02-24-00202','02-24-02201','02-24-02202')
AND s.is_current = TRUE;

-- Business Analytics - Level 3 (22020013)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020013', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00105') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020013', c.course_id, s.semester_id, 15, 53, 8, 'B+', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00109','02-24-00110') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020013', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00201','02-24-02201','02-24-02202') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020013', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00204','02-24-00205','02-24-02204') AND s.semester_code='S2024';
-- Sem5 enrolled
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020013', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-02301','02-24-02302','02-24-02303')
AND s.is_current = TRUE;

-- Business Analytics - Level 4 Graduated (22020014)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020014', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2021-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00102','02-24-00105') AND s.semester_code='F2021';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020014', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2022-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00110','02-24-02201') AND s.semester_code='S2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020014', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00201','02-24-02202','02-24-02203') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020014', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00204','02-24-00205','02-24-02204') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020014', c.course_id, s.semester_id, 15, 53, 8, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-02301','02-24-02302','02-24-02303') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020014', c.course_id, s.semester_id, 16, 56, 8, 'A-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-02304','02-24-02305','02-24-02306') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020014', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2024-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-02401','02-24-02402','02-24-02403','02-24-02404') AND s.semester_code='F2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020014', c.course_id, s.semester_id, 16, 58, 9, 'A', 'completed', '2024-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-02405','02-24-02406','02-24-02407','02-24-02408') AND s.semester_code='F2024';

-- ---------------------------------------------------------
-- Intelligent Systems Level 1 (22020021)
-- ---------------------------------------------------------
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020021', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00101','02-24-00102','02-24-00103','02-24-00104','02-24-00105','02-00-00001')
AND s.is_current = TRUE;

-- IS Level 2 (22020022)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020022', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00103','02-24-00104','02-24-00105') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020022', c.course_id, s.semester_id, 15, 54, 7, 'B+', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00109','02-24-00110') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020022', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00201','02-24-00203','02-24-03201','02-24-03202') AND s.is_current=TRUE;

-- IS Level 3 (22020023)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020023', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00105','02-24-00109') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020023', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00110','02-24-03201') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020023', c.course_id, s.semester_id, 15, 53, 8, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00205','02-24-03203','02-24-03204') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020023', c.course_id, s.semester_id, 14, 51, 7, 'B-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00204','02-24-00206') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020023', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-03301','02-24-03302','02-24-03303') AND s.is_current=TRUE;

-- IS Level 4 Graduated (22020024)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020024', c.course_id, s.semester_id, 18, 63, 9, 'A', 'completed', '2021-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00103','02-24-00105','02-24-00109') AND s.semester_code='F2021';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020024', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2022-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00110','02-24-03201','02-24-03202') AND s.semester_code='S2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020024', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00205','02-24-03203','02-24-03204','02-24-00204') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020024', c.course_id, s.semester_id, 16, 56, 8, 'A-', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-03301','02-24-03302','02-24-03303') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020024', c.course_id, s.semester_id, 15, 54, 7, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-03304','02-24-03305','02-24-03306') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020024', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-03401','02-24-03402','02-24-03403','02-24-03404') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020024', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2024-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-03405','02-24-03406','02-24-03407','02-24-03408') AND s.semester_code='F2024';

-- ---------------------------------------------------------
-- Media Analytics Level 1 (22020031)
-- ---------------------------------------------------------
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020031', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00101','02-24-00102','02-24-00103','02-24-00104','02-24-00105','02-00-00001')
AND s.is_current = TRUE;

-- MA Level 2 (22020032)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020032', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00103','02-24-00104','02-24-00105') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020032', c.course_id, s.semester_id, 15, 53, 7, 'B+', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00110','02-24-04201','02-24-04202') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020032', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00201','02-24-00203','02-24-04203','02-24-04204') AND s.is_current=TRUE;

-- MA Level 3 (22020033)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020033', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00105','02-24-00104') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020033', c.course_id, s.semester_id, 14, 51, 7, 'B-', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-04201','02-24-04202') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020033', c.course_id, s.semester_id, 15, 53, 7, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00205','02-24-04203','02-24-04204') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020033', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00204','02-24-00206') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020033', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-04301','02-24-04302','02-24-04303') AND s.is_current=TRUE;

-- MA Level 4 Graduated (22020034)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020034', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2021-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00103','02-24-00105','02-24-04201') AND s.semester_code='F2021';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020034', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2022-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00110','02-24-04202','02-24-04203') AND s.semester_code='S2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020034', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00205','02-24-04301','02-24-04302','02-24-04303') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020034', c.course_id, s.semester_id, 15, 53, 7, 'B+', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-04304','02-24-04305','02-24-04306') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020034', c.course_id, s.semester_id, 16, 56, 8, 'A-', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-04401','02-24-04402','02-24-04403','02-24-04404') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020034', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-04405','02-24-04406','02-24-04407','02-24-04408') AND s.semester_code='S2024';

-- ---------------------------------------------------------
-- Healthcare Informatics Level 1 (22020041)
-- ---------------------------------------------------------
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020041', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00101','02-24-00102','02-24-00103','02-24-00104','02-24-00105','02-00-00001')
AND s.is_current = TRUE;

-- HIDA Level 2 (22020042)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020042', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00103','02-24-00105','02-24-05201','02-24-05202') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020042', c.course_id, s.semester_id, 14, 51, 7, 'B-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00109','02-24-00110') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020042', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00201','02-24-05203','02-24-05204') AND s.is_current=TRUE;

-- HIDA Level 3 (22020043)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020043', c.course_id, s.semester_id, 16, 56, 8, 'A-', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00105','02-24-05201','02-24-05202') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020043', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-05203','02-24-05204') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020043', c.course_id, s.semester_id, 15, 53, 7, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00205','02-24-00204','02-24-00206') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020043', c.course_id, s.semester_id, 13, 50, 7, 'B-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-05301','02-24-05302','02-24-05303') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020043', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-05304','02-24-05305','02-24-05306') AND s.is_current=TRUE;

-- HIDA Level 4 Graduated (22020044)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020044', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2021-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00105','02-24-05201','02-24-05202','02-24-00101') AND s.semester_code='F2021';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020044', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2022-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-05203','02-24-05204','02-24-00110') AND s.semester_code='S2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020044', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00205','02-24-00204','02-24-05301','02-24-05302') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020044', c.course_id, s.semester_id, 15, 53, 7, 'B+', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-05303','02-24-05304','02-24-05305') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020044', c.course_id, s.semester_id, 16, 56, 8, 'A-', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-05306','02-24-05401','02-24-05402','02-24-05403') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020044', c.course_id, s.semester_id, 17, 59, 9, 'A', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-05404','02-24-05405','02-24-05406','02-24-05407','02-24-05408') AND s.semester_code='S2024';

-- ---------------------------------------------------------
-- Cybersecurity Level 1 (22020051)
-- ---------------------------------------------------------
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020051', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00101','02-24-00102','02-24-00103','02-24-00104','02-24-00105','02-00-00001')
AND s.is_current = TRUE;

-- Cyber Level 2 (22020052)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020052', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00103','02-24-00105','02-24-06201','02-24-00107') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020052', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00109','02-24-00110','02-24-06202') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020052', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-00201','02-24-00203','02-24-06203','02-24-00307') AND s.is_current=TRUE;

-- Cyber Level 3 (22020053)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020053', c.course_id, s.semester_id, 17, 59, 9, 'A', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00103','02-24-00105','02-24-06201') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020053', c.course_id, s.semester_id, 16, 56, 8, 'A-', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00110','02-24-06202','02-24-00107') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020053', c.course_id, s.semester_id, 15, 53, 7, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00205','02-24-00204','02-24-06203','02-24-00307') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020053', c.course_id, s.semester_id, 14, 51, 7, 'B-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00308','02-24-00206') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, created_at, updated_at)
SELECT '22020053', c.course_id, s.semester_id, 0, 0, 0, 'I', 'enrolled', NOW(), NOW()
FROM courses c, academic_semesters s
WHERE c.course_code IN ('02-24-06302','02-24-06303','02-24-06304') AND s.is_current=TRUE;

-- Cyber Level 4 Graduated (22020054)
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020054', c.course_id, s.semester_id, 18, 63, 9, 'A', 'completed', '2021-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00101','02-24-00103','02-24-00105','02-24-06201','02-24-00107') AND s.semester_code='F2021';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020054', c.course_id, s.semester_id, 16, 57, 8, 'A-', 'completed', '2022-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00108','02-24-00110','02-24-06202','02-24-00109') AND s.semester_code='S2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020054', c.course_id, s.semester_id, 15, 54, 8, 'B+', 'completed', '2022-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00205','02-24-00204','02-24-06203','02-24-00307') AND s.semester_code='F2022';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020054', c.course_id, s.semester_id, 14, 52, 7, 'B', 'completed', '2023-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-00308','02-24-06302','02-24-06303') AND s.semester_code='S2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020054', c.course_id, s.semester_id, 15, 53, 7, 'B+', 'completed', '2023-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-06304','02-24-06305','02-24-06306') AND s.semester_code='F2023';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020054', c.course_id, s.semester_id, 16, 56, 8, 'A-', 'completed', '2024-05-30', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-06401','02-24-06402','02-24-06403','02-24-06404') AND s.semester_code='S2024';
INSERT INTO student_courses (student_id, course_id, semester_id, work, final, mid_term, grade, status, completion_date, created_at, updated_at)
SELECT '22020054', c.course_id, s.semester_id, 17, 60, 9, 'A', 'completed', '2024-12-20', NOW(), NOW()
FROM courses c, academic_semesters s WHERE c.course_code IN ('02-24-06405','02-24-06406','02-24-06407','02-24-06408') AND s.semester_code='F2024';


-- =============================================================================
-- UPDATE graduation_date for graduated students (Article 22)
-- =============================================================================
UPDATE students SET graduation_date='2024-12-20', status='graduated'
WHERE student_id IN ('22020004','22020014','22020024','22020034','22020044','22020054');