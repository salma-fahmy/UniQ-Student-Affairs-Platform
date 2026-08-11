-- ==============================
-- COMPLETE DATABASE SEED SCRIPT (CORRECTED FOR STRING PRIMARY KEYS)
-- For Computer Science Faculty Management System
-- ==============================

-- ==============================
-- 1. INSERT ROLES
-- ==============================
INSERT INTO roles (role_name, description, created_at) VALUES
('student', 'Regular student with access to courses, grades, and requests', NOW()),
('academic_staff', 'Teaching staff with access to courses, grades, and student data', NOW()),
('affairs_staff', 'Administrative staff handling student affairs and requests', NOW()),
('admin', 'System administrator with full access', NOW());

-- ==============================
-- 2. INSERT PERMISSIONS
-- ==============================
INSERT INTO permissions (permission_name, description, created_at) VALUES
('create:user', 'Create new users', NOW()),
('read:user', 'View user information', NOW()),
('update:user', 'Update user information', NOW()),
('delete:user', 'Delete users', NOW()),
('create:student', 'Create student records', NOW()),
('read:student', 'View student information', NOW()),
('update:student', 'Update student information', NOW()),
('delete:student', 'Delete student records', NOW()),
('create:course', 'Create courses', NOW()),
('read:course', 'View courses', NOW()),
('update:course', 'Update courses', NOW()),
('delete:course', 'Delete courses', NOW()),
('create:program', 'Create programs', NOW()),
('read:program', 'View programs', NOW()),
('update:program', 'Update programs', NOW()),
('delete:program', 'Delete programs', NOW()),
('create:enrollment', 'Create enrollments', NOW()),
('read:enrollment', 'View enrollments', NOW()),
('update:enrollment', 'Update enrollments', NOW()),
('delete:enrollment', 'Delete enrollments', NOW()),
('create:grade', 'Create grades', NOW()),
('read:grade', 'View grades', NOW()),
('update:grade', 'Update grades', NOW()),
('delete:grade', 'Delete grades', NOW()),
('create:request', 'Create requests', NOW()),
('read:request', 'View requests', NOW()),
('update:request', 'Update requests', NOW()),
('delete:request', 'Delete requests', NOW()),
('create:payment', 'Create payments', NOW()),
('read:payment', 'View payments', NOW()),
('update:payment', 'Update payments', NOW()),
('delete:payment', 'Delete payments', NOW()),
('create:complaint', 'Create complaints', NOW()),
('read:complaint', 'View complaints', NOW()),
('update:complaint', 'Update complaints', NOW()),
('delete:complaint', 'Delete complaints', NOW()),
('read:reports', 'View reports', NOW()),
('export:data', 'Export data', NOW());

-- ==============================
-- 3. INSERT ROLE_PERMISSIONS
-- ==============================

-- Student permissions
INSERT INTO role_permissions (role_id, permission_id, assigned_at)
SELECT r.role_id, p.permission_id, NOW()
FROM roles r, permissions p
WHERE r.role_name = 'student' 
AND p.permission_name IN (
    'read:user', 'update:user',
    'read:student', 'update:student',
    'read:course',
    'read:program',
    'read:enrollment', 'create:enrollment', 'delete:enrollment',
    'read:grade',
    'create:request', 'read:request',
    'read:payment', 'create:payment',
    'create:complaint', 'read:complaint'
);

-- Academic staff permissions
INSERT INTO role_permissions (role_id, permission_id, assigned_at)
SELECT r.role_id, p.permission_id, NOW()
FROM roles r, permissions p
WHERE r.role_name = 'academic_staff' 
AND p.permission_name IN (
    'read:user', 'update:user',
    'read:student',
    'create:course', 'read:course', 'update:course',
    'read:program',
    'read:enrollment', 'update:enrollment',
    'create:grade', 'read:grade', 'update:grade',
    'read:request', 'update:request',
    'read:request',
    'read:complaint', 'update:complaint',
    'read:reports'
);

-- Affairs staff permissions
INSERT INTO role_permissions (role_id, permission_id, assigned_at)
SELECT r.role_id, p.permission_id, NOW()
FROM roles r, permissions p
WHERE r.role_name = 'affairs_staff' 
AND p.permission_name IN (
    'create:user', 'read:user', 'update:user',
    'create:student', 'read:student', 'update:student',
    'read:course',
    'read:program',
    'read:enrollment', 'update:enrollment',
    'read:grade',
    'read:request', 'update:request',
    'read:payment', 'update:payment',
    'read:complaint', 'update:complaint',
    'read:reports', 'export:data'
);

-- Admin permissions (all)
INSERT INTO role_permissions (role_id, permission_id, assigned_at)
SELECT r.role_id, p.permission_id, NOW()
FROM roles r, permissions p
WHERE r.role_name = 'admin';