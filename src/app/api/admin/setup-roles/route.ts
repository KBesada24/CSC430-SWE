import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { JwtPayload } from '@/lib/utils/jwt';

/**
 * GET /api/admin/setup-roles
 * Migration script to upgrade existing club admins to 'club_admin' role
 */
async function setupRolesHandler(request: NextRequest, student: JwtPayload) {
  // Check for admin role
  // Note: We use the role from the token for speed, but for critical ops 
  // you might want to re-fetch from DB. Since this is a setup script, token is fine.
  // We need to cast or check the property since JwtPayload might not strictly have it typed in all contexts yet,
  // but we added it to the type definition earlier.
  const role = (student as any).role;
  
  if (role !== 'university_admin') {
     return errorResponse('AUTHORIZATION_ERROR', 'Admin access required', 403);
  }

  const supabase = createServerClient();
  
  // 1. Get all clubs and their admins
  const { data: clubs, error: clubsError } = await supabase
    .from('clubs')
    .select('club_id, name, admin_student_id');

  if (clubsError) {
    throw new Error(`Failed to fetch clubs: ${clubsError.message}`);
  }

  const results = {
    totalClubs: clubs.length,
    updatedAdmins: 0,
    alreadyAdmins: 0,
    errors: [] as string[],
  };

  // 2. Iterate and update roles
  // 2. Deduplicate admin student IDs
  const uniqueAdminIds = [...new Set(clubs.map(c => c.admin_student_id).filter((id): id is string => !!id))];
  
  // 3. Fetch all admin students in a single query
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('student_id, role')
    .in('student_id', uniqueAdminIds);
  
  if (studentsError) {
    throw new Error(`Failed to fetch students: ${studentsError.message}`);
  }
  
  // 4. Filter students who need role update
  const studentsToUpdate = students.filter(s => s.role === 'student');
  results.alreadyAdmins = students.length - studentsToUpdate.length;
  
  // 5. Batch update roles
  if (studentsToUpdate.length > 0) {
    const { error: updateError } = await supabase
      .from('students')
      .update({ role: 'club_admin' })
      .in('student_id', studentsToUpdate.map(s => s.student_id));
    
    if (updateError) {
      results.errors.push(`Failed to update roles: ${updateError.message}`);
    } else {
      results.updatedAdmins = studentsToUpdate.length;
    }
  }

  return successResponse(results);
}

export const POST = withErrorHandler(setupRolesHandler);
