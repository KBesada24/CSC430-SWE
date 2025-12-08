-- Migration: Add admin role and club status for EagleConnect R2
-- This migration adds:
-- 1. Role column to students table (student, club_admin, university_admin)
-- 2. Status column to clubs table (pending, approved, rejected, suspended)

-- Add role to students table (multiple students can be university_admin)
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student' NOT NULL
CHECK (role IN ('student', 'club_admin', 'university_admin'));

-- Add status to clubs table
ALTER TABLE public.clubs
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved' NOT NULL
CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));

-- Index for filtering clubs by status
CREATE INDEX IF NOT EXISTS idx_clubs_status ON public.clubs(status);

-- Index for filtering students by role
CREATE INDEX IF NOT EXISTS idx_students_role ON public.students(role);

-- Note: Existing clubs default to 'approved' to maintain current behavior
-- New clubs created after this migration will need explicit approval
