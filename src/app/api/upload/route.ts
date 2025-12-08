import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { createServerClient } from '@/lib/supabase/server';
import { successResponse } from '@/lib/utils/api-response';

async function uploadHandler(request: NextRequest, student: { studentId: string; email: string }) {
  console.log("Upload API called by user:", student.studentId); // Debug log
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB
    throw new Error('File size must be less than 5MB');
  }

  const supabase = createServerClient();
  const fileExt = file.name.split('.').pop();
  // Organize files by student ID to prevent name collisions and organize storage
  const fileName = `covers/${student.studentId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from('club-assets')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    console.error('Supabase upload error:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('club-assets')
    .getPublicUrl(fileName);

  return successResponse({ url: publicUrl });
}

export const POST = withErrorHandler(withAuth(uploadHandler));
