-- ==============================
-- 21. INSERT COLLEGE RULES FILE
-- ==============================

INSERT INTO college_rules_files (file_url, file_name, file_size, mime_type, title, description, uploaded_by, uploaded_at, updated_at, version, is_active)
VALUES 
('/files/scholarship-guide-2024.pdf', 'Scholarship_Guide_2024.pdf', 1200000, 'application/pdf', 'Scholarship and Financial Aid Guide 2024', 'Information about available scholarships and financial aid opportunities for CS students.', 'khaled-abdelrahman-1983-027', NOW(), NOW(), 2, TRUE);

-- ==============================
-- 22. INSERT COLLEGE INFO
-- ==============================

INSERT INTO college_info (name, name_ar, title, dean_name, contact_email, contact_phone, address, logo_url, hero_image_url, vision, vision_ar, mission, mission_ar, description, description_ar, uploaded_by, updated_at)
VALUES (
    'Faculty of Computers and Data Science',
    'كلية الحاسبات وعلوم البيانات',
    'Faculty of Computers and Data Science - Excellence in Computing Education',
    'Prof. Ahmed Abdullah',
    'info@cs.alexu.edu.eg',
    '+20 3 12345678',
    'Alexandria University, Azarita, Alexandria, Egypt',
    '/images/cs-logo.png',
    '/images/cs-hero.jpg',
    'To be a leading faculty in computer science education and research regionally and internationally.',
    'أن تكون كلية رائدة في تعليم وبحوث علوم الحاسب على المستوى الإقليمي والدولي.',
    'To provide high-quality education, foster innovation, and produce graduates capable of competing in the global market.',
    'تقديم تعليم عالي الجودة، تعزيز الابتكار، وتخريج كوادر قادرة على المنافسة في السوق العالمي.',
    'The Faculty of Computers and Data Science offers comprehensive programs in various computing disciplines including Artificial Intelligence, Data Science, Cybersecurity, and Software Engineering.',
    'تقدم كلية علوم الحاسب برامج شاملة في مختلف تخصصات الحوسبة بما في ذلك الذكاء الاصطناعي، علم البيانات، الأمن السيبراني، وهندسة البرمجيات.',
    'hossam-mahmoud-1985-025',
    NOW()
);