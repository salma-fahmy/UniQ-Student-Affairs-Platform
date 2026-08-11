-- 16. INSERT REQUEST TYPES
-- ==============================
-- ==============================
INSERT INTO request_types (code, name, name_ar, price, processing_days, requires_approval, form_schema, is_active, created_at) VALUES
('MIL_EDU', 'Military Education Application', 'إستمارة التقديم للتربية العسكرية', 0.00, 3, TRUE,
'{"fields": [
    {"name": "student_name_quad", "type": "text", "label": "اسم الطالب رباعيا", "required": true},
    {"name": "national_id", "type": "text", "label": "الرقم القومي", "required": true},
    {"name": "faculty", "type": "text", "label": "الكلية", "required": true},
    {"name": "university", "type": "text", "label": "الجامعة", "required": true},
    {"name": "year_group", "type": "text", "label": "الفرقة", "required": true},
    {"name": "department", "type": "text", "label": "القسم", "required": true},
    {"name": "kind", "type": "select", "label": "نوع", "options": ["انثى", "ذكر"], "required": true},
    {"name": "education_system", "type": "select", "label": "نظام التعليم", "options": ["انتظام", "انتساب", "مفتوح"], "required": true},
    {"name": "detailed_address", "type": "textarea", "label": "العنوان تفصيليا", "required": true},
    {"name": "mobile_phone", "type": "text", "label": "رقم التليفون المحمول", "required": true}
]}'::jsonb, TRUE, NOW()),

('ENR_SUSP', 'Enrollment Suspension', 'إيقاف قيد', 0.00, 5, TRUE,
'{"fields": [
    {"name": "faculty", "type": "text", "label": "الكلية", "required": true},
    {"name": "academic_year", "type": "text", "label": "العام الجامعي", "required": true},
    {"name": "student_name", "type": "text", "label": "اسم الطالب", "required": true},
    {"name": "level", "type": "text", "label": "الفرقة / المستوى الدراسي", "required": true},
    {"name": "program", "type": "text", "label": "برنامج / شعبة", "required": true},
    {"name": "suspension_term", "type": "select", "label": "الفصل المطلوب وقف القيد عنه", "options": ["فصل ربيعي", "فصل خريفي", "الفصل الرابع", "الفصل الثامن"], "required": true},
    {"name": "reason", "type": "textarea", "label": "الأسباب", "required": true},
    {"name": "student_phone", "type": "text", "label": "رقم الهاتف", "required": true},
    {"name": "I Agree", "type": "checkbox", "label": "أُقر أنا بأنني غير مقيد بأي كلية اخرى او مقبول في اي كليات او معاهد عسكرية", "required": true}
    
]}'::jsonb, TRUE, NOW()),

('SPC_PRG', 'Special Programs Enrollment', 'طلب التحاق برنامج خاص', 580, 7, TRUE,
'{"fields": [
    {"name": "academic_year", "type": "text", "label": "العام الجامعي", "required": true},
    {"name": "program_name", "type": "select", "label": "اسم البرنامج", "options": ["تحليلات الأعمال", "النظم الذكية", "الأمن السيبراني", "وسائط اعلامية"], "required": true},
    {"name": "student_name", "type": "text", "label": "اسم الطالب", "required": true},
    {"name": "birth_date", "type": "date", "label": "تاريخ الميلاد", "required": true},
    {"name": "national_id", "type": "text", "label": "الرقم القومي", "required": true},
    {"name": "address", "type": "text", "label": "العنوان", "required": true},
    {"name": "mobile_phone", "type": "text", "label": "الهاتف المحمول", "required": true},
    {"name": "email", "type": "text", "label": "البريد الإلكتروني", "required": true},
    {"name": "guardian_name", "type": "text", "label": "اسم ولي الأمر", "required": true},
    {"name": "guardian_phone", "type": "text", "label": "رقم هاتف ولي الأمر", "required": true},
    {"name": "name_en", "type": "text", "label": "الاسم بالإنجليزية", "required": true},
    {"name": "mother_name", "type": "text", "label": "اسم الأم", "required": true},
    {"name": "mother_job", "type": "text", "label": "وظيفة الأم", "required": true},
    {"name": "mother_phone", "type": "text", "label": "رقم هاتف الأم", "required": true},
    {"name": "high_school_type", "type": "select", "label": "نوع شهادة الثانوية العامة", "options": ["ثانوية عامه: علمي علوم", "ثانوية عامه: علمي رياضه", "ثانوية معادلة"], "required": true},
    {"name": "high_school_year", "type": "text", "label": "سنة الثانوية", "required": true},
    {"name": "high_school_name", "type": "text", "label": "اسم المدرسة الثانوية", "required": true},
    {"name": "english_grade", "type": "text", "label": "درجة اللغة الإنجليزية", "required": true},
    {"name": "total_grade", "type": "text", "label": "مجموع الدرجات الكلي", "required": true},
    {"name": "skills", "type": "textarea", "label": "مهارات: لغات مهارات شخصية", "required": false},
    {"name": "hobbies", "type": "textarea", "label": "مواهب وانشطة مميزة", "required": false},
    {"name": "activities", "type": "checkbox_group", "label": "أنشطة", "options": ["موسيقى", "رياضة", "فنون", "جواله"], "required": false}
]}'::jsonb, TRUE, NOW()),

('PUB_PRG', 'Public Programs Enrollment', 'طلب التحاق برنامج عام', 0.00, 7, TRUE,
'{"fields": [
    {"name": "academic_year", "type": "text", "label": "العام الجامعي", "required": true},
    {"name": "program_name", "type": "select", "label": "اسم البرنامج", "options": ["الحوسبة وعلوم البيانات"], "required": true},
    {"name": "student_name", "type": "text", "label": "اسم الطالب", "required": true},
    {"name": "birth_date", "type": "date", "label": "تاريخ الميلاد", "required": true},
    {"name": "national_id", "type": "text", "label": "الرقم القومي", "required": true},
    {"name": "address", "type": "text", "label": "العنوان", "required": true},
    {"name": "mobile_phone", "type": "text", "label": "الهاتف المحمول", "required": true},
    {"name": "email", "type": "text", "label": "البريد الإلكتروني", "required": true},
    {"name": "guardian_name", "type": "text", "label": "اسم ولي الأمر", "required": true},
    {"name": "guardian_phone", "type": "text", "label": "رقم هاتف ولي الأمر", "required": true},
    {"name": "name_en", "type": "text", "label": "الاسم بالإنجليزية", "required": true},
    {"name": "mother_name", "type": "text", "label": "اسم الأم", "required": true},
    {"name": "mother_job", "type": "text", "label": "وظيفة الأم", "required": true},
    {"name": "mother_phone", "type": "text", "label": "رقم هاتف الأم", "required": true},
    {"name": "high_school_type", "type": "select", "label": "نوع شهادة الثانوية العامة", "options": ["ثانوية عامه: علمي علوم", "ثانوية عامه: علمي رياضه", "ثانوية معادلة"], "required": true},
    {"name": "high_school_year", "type": "text", "label": "سنة الثانوية", "required": true},
    {"name": "high_school_name", "type": "text", "label": "اسم المدرسة الثانوية", "required": true},
    {"name": "english_grade", "type": "text", "label": "درجة اللغة الإنجليزية", "required": true},
    {"name": "total_grade", "type": "text", "label": "مجموع الدرجات الكلي", "required": true},
    {"name": "skills", "type": "textarea", "label": "مهارات: لغات مهارات شخصية", "required": false},
    {"name": "hobbies", "type": "textarea", "label": "مواهب وانشطة مميزة", "required": false},
    {"name": "activities", "type": "checkbox_group", "label": "أنشطة", "options": ["موسيقى", "رياضة", "فنون", "جواله"], "required": false}
]}'::jsonb, TRUE, NOW()),

('CRS_REG', 'Course Registration Request', 'طلب تسجيل مقررات دراسية', 100, 2, TRUE,
'{"fields": [
    {"name": "student_name", "type": "text", "label": "اسم الطالب", "required": true},
    {"name": "program", "type": "text", "label": "البرنامج الدراسي", "required": true},
    {"name": "student_id", "type": "text", "label": "الرقم الجامعي", "required": true},
    {"name": "university_email", "type": "text", "label": "الإيميل الجامعي", "required": true},
    {"name": "level", "type": "text", "label": "المستوى الدراسى", "required": true},
    {"name": "completed_hours", "type": "number", "label": "عدد الساعات التي اجتازها الطالب حتي نهاية خريف 2025/2026", "required": true},
    {"name": "registered_hours_current", "type": "number", "label": "عدد الساعات المسجل في الترم الحالي", "required": true},
    {"name": "registered_courses", "type": "textarea", "label": "المواد التي تم تسجيلها (في حالة تسجيل جزء من المواد)", "required": false},
    {"name": "requested_courses", "type": "textarea", "label": "المواد المطلوب تسجيلها (ولم يتمكن الطالب من تسجيلها)", "required": true},
    {"name": "phone", "type": "text", "label": "رقم الهاتف", "required": true}
]}'::jsonb, TRUE, NOW()),

('TUIT_INST', 'Tuition Installment Request', 'طلب تقسيط مصروفات دراسية', 0.00, 5, TRUE,
'{"fields": [
    {"name": "academic_year", "type": "text", "label": "العام الجامعى", "required": true},
    {"name": "total_fees", "type": "number", "label": "اجمالى المصروفات الدراسية", "required": true},
    {"name": "first_installment_amount", "type": "number", "label": "مبلغ الدفعة الأولى", "required": true},
    {"name": "first_installment_date", "type": "date", "label": "تاريخ سداد الدفعة الأولى", "required": true},
    {"name": "second_installment_amount", "type": "number", "label": "مبلغ الدفعة الثانية", "required": true},
    {"name": "second_installment_date", "type": "date", "label": "تاريخ سداد الدفعة الثانية", "required": true},
    {"name": "student_name", "type": "text", "label": "اسم الطالب", "required": true},
    {"name": "level", "type": "text", "label": "المستوى", "required": true},
    {"name": "program", "type": "text", "label": "البرنامج", "required": true},
    {"name": "student_id", "type": "text", "label": "الرقم الجامعى", "required": true},
    {"name": "phone", "type": "text", "label": "رقم الهاتف", "required": true},
    {"name": "national_id", "type": "text", "label": "الرقم القومى", "required": true}
]}'::jsonb, TRUE, NOW()),

('CRS_WTH', 'Course Withdrawal Request', 'طلب سحب مقرر', 100, 3, TRUE,
'{"fields": [
    {"name": "student_name", "type": "text", "label": "اسم الطالب", "required": true},
    {"name": "student_id", "type": "text", "label": "الرقم الجامعي", "required": true},
    {"name": "national_id", "type": "text", "label": "الرقم القومي", "required": true},
    {"name": "level", "type": "text", "label": "المستوي", "required": true},
    {"name": "program", "type": "text", "label": "اسم البرنامج", "required": true},
    {"name": "mobile", "type": "text", "label": "الهاتف المحمول", "required": true},
    {"name": "email", "type": "text", "label": "البريد الإلكتروني الرسمي", "required": true},
    {"name": "cgpa", "type": "number", "label": "CGPA", "required": true},
    {"name": "total_earned_hours", "type": "number", "label": "عدد الساعات المكتسبة الكلي", "required": true},
    {"name": "course_to_withdraw", "type": "text", "label": "المقرر المراد حذفه", "required": true},
    {"name": "hours_before_withdrawal", "type": "number", "label": "عدد الساعات قبل الحذف", "required": true},
    {"name": "hours_after_withdrawal", "type": "number", "label": "عدد الساعات بعد الحذف", "required": true}
]}'::jsonb, TRUE, NOW()),

('MED_EXAM', 'Medical Examination Form', 'استمارة كشف طبي للطلاب الجدد', 0.00, 1, TRUE,
'{"fields": [
    {"name": "student_code", "type": "text", "label": "كود الطالب", "required": true},
    {"name": "student_name", "type": "text", "label": "اسم الطالب", "required": true},
    {"name": "student_type", "type": "text", "label": "نوع الطالب", "required": true},
    {"name": "address", "type": "text", "label": "العنوان", "required": true},
    {"name": "birth_date", "type": "date", "label": "تاريخ الميلاد", "required": true},
    {"name": "national_id", "type": "text", "label": "رقم البطاقة", "required": true},
    {"name": "medical_record_number", "type": "text", "label": "الرقم الطبى", "required": true},
    {"name": "height", "type": "text", "label": "الطول", "required": true},
    {"name": "weight", "type": "text", "label": "الوزن", "required": true},
    {"name": "diseases", "type": "checkbox_group", "label": "الأمراض", "options": ["السكر", "ارتفاع ضغط الدم", "بلهارسيا", "التهاب كبدى", "امراض نفسية", "امراض جلدية", "القلب", "شلل الأطفال", "عيوب خلقية من الولادة", "أمراض الباطنة والقلب", "اخرى"], "required": false},
    {"name": "other_disease", "type": "text", "label": "أمراض أخرى (اذكرها)", "required": false},
    {"name": "disability", "type": "select", "label": "اعاقة ام لا", "options": ["يوجد", "لا يوجد"], "required": true},
    {"name": "medical_tests", "type": "text", "label": "تحاليل طبية (CBC, CRB)", "required": false},
    {"name": "eye_exam", "type": "text", "label": "كشف نظر", "required": false},
    {"name": "previous_surgeries", "type": "select", "label": "هل اجريت عمليات جراحيه من قبل ؟", "options": ["نعم", "لا"], "required": true},
    {"name": "surgery_type", "type": "text", "label": "نوع العمليات التى اجريت", "required": false},
    {"name": "medications", "type": "text", "label": "فى حالة تناول أى ادوية حدد نوع الأدوية", "required": false}
]}'::jsonb, TRUE, NOW()),

('GRD_APL', 'Grade Appeal Response', 'نموذج الرد علي تظلم طالب بخصوص نتيجة امتحان', 100, 7, TRUE,
'{"fields": [
    {"name": "student_name", "type": "text", "label": "اسم الطـــالب", "required": true},
    {"name": "program", "type": "text", "label": "البرنامج", "required": true},
    {"name": "landline", "type": "text", "label": "التليفون الأرضي", "required": false},
    {"name": "level", "type": "text", "label": "المستــــــوي", "required": true},
    {"name": "student_id", "type": "text", "label": "الرقم الجامعي", "required": true},
    {"name": "phone", "type": "text", "label": "الهاتـــــف", "required": true},
    {"name": "email", "type": "text", "label": "البريد الإلكتروني", "required": true},
    {"name": "course_code", "type": "text", "label": "كود المادة", "required": true},
    {"name": "course_name", "type": "text", "label": "اسم المقرر المتظلم منه الطالب", "required": true},
    {"name": "appeal_reason", "type": "textarea", "label": "سبب التظلـــــم", "required": true}
]}'::jsonb, TRUE, NOW()),

('OFF_CERT_EXT', 'Official Certificate Extraction Request', 'طلب مستخرج رسمي للشهادة', 200, 7, TRUE,
'{
  "fields": [
    {"name": "name_ar", "type": "text", "label": "الاسم باللغة العربية", "label_en": "Full Name in Arabic", "required": true},
    {"name": "name_en", "type": "text", "label": "الاسم باللغة الإنجليزية", "label_en": "Full Name in English", "required": true},
    {"name": "program", "type": "text", "label": "البرنامج", "label_en": "Program", "required": true},
    {"name": "graduation_year", "type": "text", "label": "عام", "label_en": "Graduation Year", "required": true},
    {"name": "grade", "type": "text", "label": "بتقدير", "label_en": "Grade", "required": true},
    {"name": "birth_date", "type": "date", "label": "تاريخ الميلاد", "label_en": "Date of Birth", "required": true},
    {"name": "birth_place", "type": "text", "label": "محل الميلاد", "label_en": "Place of Birth", "required": true},
    {"name": "governorate", "type": "text", "label": "محافظة", "label_en": "Governorate", "required": true},
    {"name": "nationality", "type": "text", "label": "الجنسية", "label_en": "Nationality", "required": true},
    {"name": "national_id", "type": "text", "label": "الرقم القومي", "label_en": "National ID", "required": true},
    {"name": "issue_date", "type": "date", "label": "تاريخ الصدور", "label_en": "Issue Date", "required": true},
    {"name": "phone", "type": "text", "label": "رقم التليفون", "label_en": "Phone Number", "required": true},
    {"name": "cert_bachelor_ar", "type": "number", "label": "شهادة البكاريوس باللغة العربية - عدد", "label_en": "Bachelor Certificate in Arabic - Count", "required": false, "default": 0 , "price":200},
    {"name": "cert_bachelor_en", "type": "number", "label": "شهادة البكاريوس باللغة الإنجليزية - عدد", "label_en": "Bachelor Certificate in English - Count", "required": false, "default": 0 , "price":200},
    {"name": "cert_study_en", "type": "number", "label": "إفادة دراسية باللغة الإنجليزية - عدد", "label_en": "Study Certificate in English - Count", "required": false, "default": 0 , "price":200},
    {"name": "cert_grades", "type": "number", "label": "بيان تقديرات - عدد", "label_en": "Grades Report - Count", "required": false, "default": 0 , "price":100},
    {"name": "cert_status_en", "type": "number", "label": "بيان حالة باللغة الإنجليزية - عدد", "label_en": "Status Report in English - Count", "required": false, "default": 0 , "price":100}
  ],
  "receipt": {
    "fields": [
      {"name": "graduate_name", "type": "text", "label": "اسم الخريج", "label_en": "Graduate Name", "required": true},
      {"name": "receipt_date", "type": "date", "label": "تاريخ الاستلام", "label_en": "Receipt Date", "required": true},
      {"name": "received_cert_ar", "type": "number", "label": "عدد الشهادات العربية المستلمة", "label_en": "Received Arabic Certificates Count", "required": false  },
      {"name": "received_study", "type": "number", "label": "عدد الإفادات الدراسية المستلمة", "label_en": "Received Study Certificates Count", "required": false},
      {"name": "received_grades", "type": "number", "label": "عدد بيانات التقديرات المستلمة", "label_en": "Received Grades Reports Count", "required": false},
      {"name": "received_status", "type": "number", "label": "عدد بيانات الحالة المستلمة", "label_en": "Received Status Reports Count", "required": false}
    ]
  }
}'::jsonb, TRUE, NOW());