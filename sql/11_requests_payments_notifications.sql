-- ==============================
-- 11. REQUESTS + PAYMENTS + NOTIFICATIONS
-- ==============================

-- ==============================
-- REQUESTS
-- ==============================
INSERT INTO requests (request_number, student_id, request_type_id, price_at_request, description, request_body, status, created_at)
VALUES
('REQ-2024-001', '22010001', 10, 200.00, 'Need official transcript for graduate school application', '{"student_name": "Rahma Ramadan", "level": "Level 4", "program": "Computer Science"}'::jsonb, 'accepted', NOW()),
('REQ-2024-002', '22010006', 9,  100.00, 'Appeal for CS203 grade', '{"course_code": "CS203", "course_name": "Data Structures", "appeal_reason": "Incorrect grading"}'::jsonb, 'pending', NOW()),
('REQ-2024-003', '22010007', 7,  100.00, 'Withdraw from CS103', '{"course_to_withdraw": "CS103", "cgpa": 3.02, "total_earned_hours": 72}'::jsonb, 'accepted', NOW()),
('REQ-2024-004', '22010004', 10, 200.00, 'Graduation application for Fall 2024', '{"student_name": "Reem Rafik", "program": "Cybersecurity", "cgpa": "3.72"}'::jsonb, 'pending', NOW()),
('REQ-2024-005', '22010009', 1,  0.00,   'Military education application', '{"student_name_quad": "Omar Hassan Ahmed Ali", "faculty": "Computers and Data Science"}'::jsonb, 'accepted', NOW()),
('REQ-2024-006', '22010002', 10, 200.00, 'Need for visa application', '{"student_name": "Ziad Mohamed", "level": "Level 4", "program": "Artificial Intelligence"}'::jsonb, 'accepted', NOW()),
('REQ-2024-007', '22010008', 2,  0.00,   'Medical leave for Spring 2025', '{"reason": "Medical leave required for surgery recovery", "suspension_term": "spring"}'::jsonb, 'pending', NOW()),
('REQ-2024-008', '22010010', 3,  580.00, 'Transfer to Cybersecurity program', '{"program_name": "Cybersecurity", "student_name": "Mariam Ahmed"}'::jsonb, 'pending', NOW()),
('REQ-2024-009', '22010011', 5,  100.00, 'Course registration for Spring 2026', '{"student_name": "Youssef Mostafa", "completed_hours": 90}'::jsonb, 'accepted', NOW()),
('REQ-2024-010', '22010012', 6,  0.00,   'Tuition fee installment plan for Fall 2024', '{"academic_year": "2024-2025", "total_fees": 45000}'::jsonb, 'accepted', NOW()),
-- 2026 requests (doctor approval testing)
('REQ-2026-001', '22010007', 5,  100.00, 'Course registration request', '{"course_code": "CS401"}'::jsonb, 'pending', NOW()),
('REQ-2026-002', '22010007', 7,  100.00, 'Course withdrawal request', '{"course_to_withdraw": "CS301"}'::jsonb, 'pending', NOW()),
('REQ-2026-003', '22010025', 5,  100.00, 'Register for CS101', '{"course_code": "CS101"}'::jsonb, 'pending', NOW()),
('REQ-2026-004', '22010007', 5,  100.00, 'Re-upload request', '{"student_name": "Osama"}'::jsonb, 'resubmit', NOW()),
('REQ-2026-005', '22010007', 10, 200.00, 'Graduation certificate', '{"year": "2025"}'::jsonb, 'pending', NOW()),
-- REQ-2026-006: OFF_CERT_EXT test request
('REQ-2026-006', '22010001', (SELECT request_type_id FROM request_types WHERE code = 'OFF_CERT_EXT'), 200.00, 'Official certificate extraction request', '{"name_ar": "رحمة رمضان", "name_en": "Rahma Ramadan", "program": "Computer Science", "graduation_year": "2025", "grade": "Excellent", "national_id": "12345678901234", "phone": "01012345678", "cert_bachelor_ar": 1, "cert_bachelor_en": 1}'::jsonb, 'pending', NOW())
ON CONFLICT (request_number) DO NOTHING;

-- ==============================
-- 18. INSERT PAYMENTS
-- ==============================

-- Payment for Rahma's certificate
INSERT INTO payments (payment_number, student_id, request_id, amount, status, transaction_id, payment_date, created_at)
SELECT 'PAY-2024-001', s.student_id, r.request_id, r.price_at_request, 'paid'::payment_status, 'TXN' || floor(random() * 1000000)::text, '2024-09-15 10:35:00', NOW()
FROM students s
JOIN requests r ON s.student_id = r.student_id
WHERE s.student_id = '22010001'
AND r.request_number = 'REQ-2024-001';

-- Payment for Osama's request
INSERT INTO payments (payment_number, student_id, request_id, amount, status, transaction_id, payment_date, created_at)
SELECT 'PAY-2024-002', s.student_id, r.request_id, r.price_at_request, 'paid'::payment_status, 'TXN' || floor(random() * 1000000)::text, '2024-09-18 09:50:00', NOW()
FROM students s
JOIN requests r ON s.student_id = r.student_id
WHERE s.student_id = '22010007'
AND r.request_number = 'REQ-2024-003';

-- Payment for Omar's request
INSERT INTO payments (payment_number, student_id, request_id, amount, status, transaction_id, payment_date, created_at)
SELECT 'PAY-2024-003', s.student_id, r.request_id, r.price_at_request, 'paid'::payment_status, 'TXN' || floor(random() * 1000000)::text, '2024-09-10 13:35:00', NOW()
FROM students s
JOIN requests r ON s.student_id = r.student_id
WHERE s.student_id = '22010009'
AND r.request_number = 'REQ-2024-005';

-- Payment for Ziad's certificate
INSERT INTO payments (payment_number, student_id, request_id, amount, status, transaction_id, payment_date, created_at)
SELECT 'PAY-2024-004', s.student_id, r.request_id, r.price_at_request, 'paid'::payment_status, 'TXN' || floor(random() * 1000000)::text, '2024-09-05 09:35:00', NOW()
FROM students s
JOIN requests r ON s.student_id = r.student_id
WHERE s.student_id = '22010002'
AND r.request_number = 'REQ-2024-006';

-- Payment for Youssef's request
INSERT INTO payments (payment_number, student_id, request_id, amount, status, transaction_id, payment_date, created_at)
SELECT 'PAY-2024-005', s.student_id, r.request_id, r.price_at_request, 'paid'::payment_status, 'TXN' || floor(random() * 1000000)::text, '2024-09-19 14:35:00', NOW()
FROM students s
JOIN requests r ON s.student_id = r.student_id
WHERE s.student_id = '22010011'
AND r.request_number = 'REQ-2024-009';

-- ==============================
-- 20. INSERT NOTIFICATIONS
-- ==============================

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010001', 'Request Approved', 'Your certificate request has been approved and processed. You can pick it up from the student affairs office.', 'request_update', FALSE, '/requests/REQ-2024-001', NOW(), NOW() + INTERVAL '30 days');

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010006', 'Grade Appeal Received', 'Your grade appeal has been received and is being reviewed by the academic committee.', 'request_update', FALSE, '/requests/REQ-2024-002', NOW(), NOW() + INTERVAL '30 days');

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010007', 'Request Approved', 'Your request has been approved and processed.', 'request_update', FALSE, '/requests/REQ-2024-003', NOW(), NOW() + INTERVAL '30 days');

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010004', 'Graduation Application Submitted', 'Your graduation application has been submitted and is pending review. You will be notified once processed.', 'request_update', FALSE, '/requests/REQ-2024-004', NOW(), NOW() + INTERVAL '30 days');

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010002', 'Request Approved', 'Your certificate of enrollment has been processed and is ready for pickup.', 'request_update', FALSE, '/requests/REQ-2024-006', NOW(), NOW() + INTERVAL '30 days');

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010007', 'New Grade Posted', 'Your grade for CS102 has been posted. Check your grades page for details.', 'course_update', FALSE, '/grades', NOW(), NOW() + INTERVAL '60 days');

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010005', 'Welcome to CS Faculty', 'Welcome to the Faculty of Computers and Data Science! Please complete your profile and review the academic calendar.', 'announcement', FALSE, '/profile', NOW(), NOW() + INTERVAL '90 days');

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010011', 'Tuition Payment Reminder', 'Your tuition payment for Fall 2024 is due by October 15th. Please make your payment to avoid late fees.', 'payment', FALSE, '/payments', NOW(), NOW() + INTERVAL '21 days');

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010007', 'Complaint Update', 'Your complaint (CMP-2024-004) has been assigned to a staff member and is being processed.', 'complaint', FALSE, '/complaints/CMP-2024-004', NOW(), NOW() + INTERVAL '30 days');

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at, expires_at)
VALUES ('22010010', 'Complaint Accepted', 'Your complaint about the CS201 textbook has been accepted and resolved.', 'complaint', FALSE, '/complaints/CMP-2024-002', NOW(), NOW() + INTERVAL '30 days');


-- Counters
INSERT INTO request_counters (year, sequence)
SELECT
    CAST(SPLIT_PART(request_number, '-', 2) AS INTEGER) AS year,
    MAX(CAST(SPLIT_PART(request_number, '-', 3) AS INTEGER)) AS sequence
FROM requests
WHERE request_number ~ '^REQ-\d{4}-\d+$'
GROUP BY CAST(SPLIT_PART(request_number, '-', 2) AS INTEGER)
ON CONFLICT (year) DO UPDATE SET sequence = EXCLUDED.sequence;