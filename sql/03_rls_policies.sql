-- This file contains the policies that Will be applied on tables as RLS . 

-- 1- make the academic staff only see the withdraw request on requests table 
-- Your RLS policy is correct, keep it as is


ALTER USER postgres NOBYPASSRLS;

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Force RLS even for the table owner
ALTER TABLE requests FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS request_access_policy ON requests;

CREATE POLICY request_access_policy
ON requests
FOR SELECT
USING (
    CASE COALESCE(current_setting('app.role', true), '')
        WHEN 'academic_staff' THEN
            request_type_id IN (
                SELECT request_type_id
                FROM request_types
                WHERE code IN ('CRS_WTH', 'CRS_REG')
            )
        ELSE TRUE
    END
);


-- ── INSERT (student only) ─────────────────────────────────────────────────────
CREATE POLICY request_insert_policy
ON requests
FOR INSERT
WITH CHECK (
    COALESCE(current_setting('app.role', true), '') = 'student'
);

-- ── UPDATE (affairs_staff, academic_staff, admin only) ────────────────────────
CREATE POLICY request_update_policy
ON requests
FOR UPDATE
USING (
    COALESCE(current_setting('app.role', true), '') IN (
        'affairs_staff',
        'academic_staff',
        'admin'
    )
)
WITH CHECK (
    COALESCE(current_setting('app.role', true), '') IN (
        'affairs_staff',
        'academic_staff',
        'admin'
    )
);

-- ── DELETE (affairs_staff, academic_staff, admin only) ────────────────────────
CREATE POLICY request_delete_policy
ON requests
FOR DELETE
USING (
    COALESCE(current_setting('app.role', true), '') IN (
        'affairs_staff',
        'academic_staff',
        'admin'
    )
);




-- GRANT SELECT ON request_types TO postgres;

-- -- Simulate academic_staff
-- SET app.role = 'academic_staff';
-- SELECT r.request_number, rt.code 
-- FROM requests r
-- JOIN request_types rt ON r.request_type_id = rt.request_type_id;
-- -- Should return ONLY CRS_WTH and CRS_REG rows

-- -- Simulate another role
-- SET app.role = 'admin';
-- SELECT r.request_number, rt.code 
-- FROM requests r
-- JOIN request_types rt ON r.request_type_id = rt.request_type_id;
-- -- Should return ALL rows



-- select *  from request_types ; 


