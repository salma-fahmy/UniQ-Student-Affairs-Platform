-- ==============================
-- 8. INSERT PROGRAM
-- ==============================
-- ==============================
-- INSERT PROGRAMS (Fixed to include credit_hour_price)
-- ==============================

INSERT INTO programs (
    program_name_en, 
    program_name_ar, 
    program_type, 
    tuition_fees, 
    credit_hour_price, 
    is_active, 
    program_description_en,
    program_description_ar,
    program_benefits_en,
    program_benefits_ar,
    student_skills_en  ,
    student_skills_ar,
    created_at
) VALUES
(
    'Intelligent Systems', 
    'النظم الذكية', 
    'Bachelor', 
    15000.00, 
    900.00, 
    TRUE,
    'Focuses on the design and development of smart, AI-driven systems that can perceive, reason, learn, and act autonomously. It blends computer science, artificial intelligence, and robotics.',
    'يركز على تصميم وتطوير أنظمة ذكية مدعومة بالذكاء الاصطناعي يمكنها الإدراك والاستدلال والتعلم والعمل بشكل مستقل، ويمزج بين علوم الحاسب والذكاء الاصطناعي والروبوتات.',
    'Prepares for cutting-edge careers in AI, robotics, and automation. Hands-on experience with machine learning, NLP, and computer vision. High industry demand across multiple sectors.',
    'يؤهل لمهن متطورة في الذكاء الاصطناعي والروبوتات والأتمتة. خبرة عملية في التعلم الآلي ومعالجة اللغات الطبيعية والرؤية الحاسوبية. طلب صناعي مرتفع عبر قطاعات متعددة.',
    'Strong programming, algorithmic thinking, and problem-solving skills. Ability to build self-improving models and design autonomous agents.',
    'مهارات برمجة قوية وتفكير خوارزمي وحل المشكلات. القدرة على بناء نماذج ذاتية التحسين وتصميم وكلاء مستقلين.',
    NOW()
),
(
    'Healthcare Informatics and Data Analytics', 
    'تحليلات ومعلوماتية الرعاية الصحية', 
    'Bachelor', 
    18000.00, 
    600.00, 
    TRUE,
    'Interdisciplinary program merging healthcare knowledge with data science to improve patient outcomes and operational efficiency. Covers management and analysis of complex medical data.',
    'برنامج متعدد التخصصات يدمج المعرفة الصحية مع علوم البيانات لتحسين نتائج المرضى والكفاءة التشغيلية. يغطي إدارة وتحليل البيانات الطبية المعقدة.',
    'Positions graduates at the intersection of healthcare and data science. Direct impact on public health. Opportunities in hospitals, insurance, government, and biotech.',
    'يضع الخريجين في ملتقى الرعاية الصحية وعلوم البيانات. تأثير مباشر على الصحة العامة. فرص في المستشفيات والتأمين والحكومة والتكنولوجيا الحيوية.',
    'Expertise in medical terminology, health data standards, statistical analysis, and data visualization. Ethical reasoning and technical proficiency in SQL, Python, and health informatics platforms.',
    'خبرة في المصطلحات الطبية ومعايير البيانات الصحية والتحليل الإحصائي وتصور البيانات. تفكير أخلاقي وكفاءة تقنية في SQL وPython ومنصات معلوماتية الصحة.',
    NOW()
),
(
    'Business Analytics', 
    'تحليلات الأعمال', 
    'Bachelor', 
    15000.00, 
    900.00, 
    TRUE,
    'Teaches students how to leverage data to solve complex business problems, optimize operations, and drive strategic decisions. Combines statistics, data mining, and business intelligence.',
    'يعلم الطلاب كيفية الاستفادة من البيانات لحل مشاكل الأعمال المعقدة وتحسين العمليات ودفع القرارات الاستراتيجية. يجمع بين الإحصاء واستخراج البيانات وذكاء الأعمال.',
    'Versatile career paths in consulting, finance, marketing, and supply chain. Direct influence on company profitability. Strong blend of technical and soft skills valued by global employers.',
    'مسارات مهنية متنوعة في الاستشارات والمالية والتسويق وسلسلة التوريد. تأثير مباشر على ربحية الشركة. مزيج قوي من المهارات التقنية والشخصية.',
    'Analytical and quantitative abilities, predictive modeling, dashboard creation. Business acumen and data storytelling skills for presenting recommendations clearly to stakeholders.',
    'قدرات تحليلية وكمية ونمذجة تنبؤية وإنشاء لوحات المعلومات. فطنة تجارية ومهارات سرد البيانات لتقديم التوصيات بوضوح لأصحاب المصلحة.',
    NOW()
),
(
    'Computing and Data Sciences', 
    'الحوسبة وعلوم البيانات', 
    'Bachelor', 
    4321.00, 
    300.00, 
    TRUE,
    'Foundational program exploring core computing principles and the complete data science lifecycle, from programming and databases to advanced machine learning and big data technologies.',
    'برنامج تأسيسي يستكشف مبادئ الحوسبة الأساسية ودورة حياة علوم البيانات الكاملة، من البرمجة وقواعد البيانات إلى التعلم الآلي المتقدم وتقنيات البيانات الضخمة.',
    'Affordable entry point into high-demand tech and data science roles. Flexible foundation applicable to any industry. Balanced curriculum covering software development and analytical modeling.',
    'نقطة دخول ميسورة إلى أدوار تقنية وعلوم البيانات عالية الطلب. أساس مرن قابل للتطبيق في أي صناعة. منهج متوازن يغطي تطوير البرمجيات والنمذجة التحليلية.',
    'Robust coding skills, mathematical foundations in statistics and linear algebra, and ability to handle large-scale datasets. Systematic problem-solving and model deployment capabilities.',
    'مهارات برمجة قوية وأسس رياضية في الإحصاء والجبر الخطي والقدرة على التعامل مع مجموعات البيانات واسعة النطاق. حل منهجي للمشكلات وقدرات نشر النماذج.',
    NOW()
),
(
    'Cybersecurity', 
    'الأمن السيبراني', 
    'Bachelor', 
    42000.00, 
    900.00, 
    TRUE,
    'Specialized program training students to protect digital assets, networks, and systems from cyber threats. Covers offensive and defensive security, cryptography, ethical hacking, and risk management.',
    'برنامج متخصص يدرب الطلاب على حماية الأصول الرقمية والشبكات والأنظمة من التهديدات السيبرانية. يغطي الأمن الهجومي والدفاعي والتشفير والاختراق الأخلاقي وإدارة المخاطر.',
    'Extremely high industry demand with global talent shortage and excellent salary potential. Work in any sector. Dynamic field with clear certification pathways.',
    'طلب صناعي مرتفع للغاية مع نقص عالمي في المواهب وإمكانات رواتب ممتازة. العمل في أي قطاع. مجال ديناميكي مع مسارات شهادات مهنية واضحة.',
    'Deep technical skills in network security, penetration testing, and forensics. Adversarial thinking, analytical investigation, and risk assessment capabilities with ethical and legal context.',
    'مهارات تقنية عميقة في أمن الشبكات واختبار الاختراق والأدلة الجنائية. تفكير خصمي وتحقيق تحليلي وقدرات تقييم المخاطر مع سياق أخلاقي وقانوني.',
    NOW()
),
(
    'Media Analytics', 
    'تحليلات الوسائط الإعلامية', 
    'Bachelor', 
    18000.00, 
    600.00, 
    TRUE,
    'Sits at the crossroads of media studies, digital communication, and data science. Empowers students to measure audience behavior, assess content performance, and generate strategic insights.',
    'يقع عند تقاطع دراسات الوسائط والاتصال الرقمي وعلوم البيانات. يمكن الطلاب من قياس سلوك الجمهور وتقييم أداء المحتوى وتوليد رؤى استراتيجية.',
    'Unique specialization for digital media, advertising, and entertainment. Skills to drive engagement and monetization. Fuses creativity with analytical talent for data-informed storytelling.',
    'تخصص فريد للوسائط الرقمية والإعلان والترفيه. مهارات لدفع المشاركة وتحقيق الدخل. يدمج الإبداع مع المواهب التحليلية لسرد قصصي قائم على البيانات.',
    'Sentiment analysis, audience journey tracking, A/B testing for content. Proficiency in social listening tools, web analytics, and data visualization with strategic communications skills.',
    'تحليل المشاعر وتتبع رحلة الجمهور واختبار A/B للمحتوى. إتقان أدوات الاستماع الاجتماعي وتحليلات الويب وتصور البيانات مع مهارات اتصالات استراتيجية.',
    NOW()
);
-- ==============================
-- 9. INSERT ACADEMIC SEMESTER
-- ==============================
INSERT INTO academic_semesters (semester_name, semester_code, academic_year, start_date, end_date, is_current, registration_start, registration_end, created_at) VALUES
('Fall Semester 2024', 'F2024', '2024-2025', '2024-09-01', '2024-12-20', TRUE, '2024-08-01', '2024-08-30', NOW()),
('Spring Semester 2024', 'S2024', '2023-2024', '2024-02-01', '2024-05-30', FALSE, '2024-01-01', '2024-01-30', NOW()),
('Fall Semester 2023', 'F2023', '2023-2024', '2023-09-01', '2023-12-20', FALSE, '2023-08-01', '2023-08-30', NOW()),
('Spring Semester 2023', 'S2023', '2022-2023', '2023-02-01', '2023-05-30', FALSE, '2023-01-01', '2023-01-30', NOW()),
('Fall Semester 2022', 'F2022', '2022-2023', '2022-09-01', '2022-12-20', FALSE, '2022-08-01', '2022-08-30', NOW()),
('Spring Semester 2022', 'S2022', '2021-2022', '2022-02-01', '2022-05-30', FALSE, '2022-01-01', '2022-01-30', NOW()),
('Fall Semester 2021', 'F2021', '2021-2022', '2021-09-01', '2021-12-20', FALSE, '2021-08-01', '2021-08-30', NOW());
