-- ==============================
-- 12. COMPLAINTS
-- ==============================

INSERT INTO complaints (complaint_number, student_id, complaint_type, complaint_text, status, priority, created_at)
VALUES
('CMP-2024-002', '22010010', 'academic',        'The textbook for CS201 is out of stock in the bookstore.',                                                                             'accepted',    'low',    NOW()),
('CMP-2024-003', '22010011', 'administrative',  'Delay in processing my transcript request.',                                                                                          'open',        'high',   NOW()),
('CMP-2024-004', '22010006', 'academic',        'CS302 class schedule conflicts with another required course.',                                                                        'in_progress', 'high',   NOW()),
('CMP-2024-006', '22010002', 'academic',        'Project requirements for CS303 changed one week before deadline.',                                                                   'open',        'high',   NOW()),
('CMP-2024-007', '22010004', 'administrative',  'Student ID card not working for accessing the research lab.',                                                                        'in_progress', 'medium', NOW()),
('CMP-2026-004', '22010007', 'doctor_complaint','The doctor repeatedly marked me absent despite attendance records.',                                                                  'open',        'high',   NOW()),
('CMP-2026-006', '22010012', 'financial',       'Tuition payment was submitted and confirmed by the bank but still shows as unpaid in the student portal.',                           'open',        'high',   NOW()),
('CMP-2026-007', '22010008', 'financial',       'Installment plan request was rejected without explanation despite meeting all eligibility requirements.',                             'in_progress', 'medium', NOW()),
('CMP-2026-008', '22010010', 'financial',       'An incorrect fee amount was charged to my account that does not match the official tuition schedule.',                               'open',        'high',   NOW())
ON CONFLICT (complaint_number) DO NOTHING;

-- Update counters
INSERT INTO complaint_counters (year, sequence) VALUES (2024, 7), (2026, 8)
ON CONFLICT (year) DO UPDATE SET sequence = EXCLUDED.sequence;
