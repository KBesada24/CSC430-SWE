-- Run these queries in Supabase SQL Editor to debug the issue

-- 1. Check if the constraint still exists
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'clubs' 
AND table_schema = 'public';

-- 2. Check the exact constraint name
SELECT conname as constraint_name
FROM pg_constraint
WHERE conrelid = 'public.clubs'::regclass;

-- 3. Try to remove the constraint with the exact name
ALTER TABLE public.clubs DROP CONSTRAINT IF EXISTS clubs_admin_student_id_key;

-- 4. Also try alternative constraint names
ALTER TABLE public.clubs DROP CONSTRAINT IF EXISTS clubs_admin_student_id_unique;
ALTER TABLE public.clubs DROP CONSTRAINT IF EXISTS admin_student_id_unique;

-- 5. Verify the column definition
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'clubs' 
AND column_name = 'admin_student_id';

-- 6. Check for unique indexes (constraints can be implemented as indexes)
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'clubs'
AND schemaname = 'public';
