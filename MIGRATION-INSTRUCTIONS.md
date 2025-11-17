# Database Migration Instructions

## Issue: Cannot Create Multiple Clubs

**Error:** `duplicate key value violates unique constraint "clubs_admin_student_id_key"`

**Cause:** The `admin_student_id` column in the `clubs` table has a UNIQUE constraint that prevents students from being admins of multiple clubs.

**Solution:** Remove the UNIQUE constraint from the `admin_student_id` column.

## How to Apply the Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the following SQL:

```sql
ALTER TABLE public.clubs DROP CONSTRAINT IF EXISTS clubs_admin_student_id_key;
```

4. Click "Run" to execute the migration
5. Verify the constraint is removed by trying to create a second club

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

This will apply all pending migrations including the new one.

### Option 3: Manual SQL Execution

Connect to your database using any PostgreSQL client and run:

```sql
ALTER TABLE public.clubs DROP CONSTRAINT IF EXISTS clubs_admin_student_id_key;
```

## Verification

After applying the migration, verify it worked by:

1. Log into your application
2. Create a club (if you haven't already)
3. Try to create a second club
4. The second club should be created successfully without errors

## What This Changes

- **Before:** Each student could only be an admin of ONE club
- **After:** Students can be admins of MULTIPLE clubs
- **Note:** The foreign key relationship is preserved, so admin_student_id still references the students table

## Rollback (if needed)

If you need to rollback this change (not recommended):

```sql
-- This will fail if any student is already admin of multiple clubs
ALTER TABLE public.clubs ADD CONSTRAINT clubs_admin_student_id_key UNIQUE (admin_student_id);
```
