-- Remove UNIQUE constraint from admin_student_id to allow students to admin multiple clubs
ALTER TABLE public.clubs DROP CONSTRAINT IF EXISTS clubs_admin_student_id_key;

-- The column should still reference students but without the unique constraint
-- The foreign key constraint remains intact
