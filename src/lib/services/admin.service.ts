/**
 * Admin Service
 * Handles administrative operations like club approval and rejection
 */

import { ClubRepository } from '@/lib/repositories/club.repository';
import { StudentRepository } from '@/lib/repositories/student.repository';
import { EmailService } from './email.service';

export type ClubStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface PendingClub {
  clubId: string;
  name: string;
  description: string | null;
  category: string;
  coverPhotoUrl: string | null;
  adminStudentId: string | null;
  createdAt: string | null;
  adminName?: string;
  adminEmail?: string;
}

export class AdminService {
  private clubRepository = new ClubRepository();
  private studentRepository = new StudentRepository();
  private emailService = new EmailService();

  /**
   * Get all pending clubs for approval
   */
  async getPendingClubs(): Promise<PendingClub[]> {
    const pendingClubs = await this.clubRepository.findByStatus('pending');
    
    // Enrich with admin info
    const enrichedClubs: PendingClub[] = await Promise.all(
      pendingClubs.map(async (club) => {
        let adminName: string | undefined;
        let adminEmail: string | undefined;
        
        if (club.admin_student_id) {
          const admin = await this.studentRepository.findById(club.admin_student_id);
          if (admin) {
            adminName = `${admin.first_name} ${admin.last_name}`;
            adminEmail = admin.email;
          }
        }
        
        return {
          clubId: club.club_id,
          name: club.name,
          description: club.description,
          category: club.category,
          coverPhotoUrl: club.cover_photo_url,
          adminStudentId: club.admin_student_id,
          createdAt: club.created_at,
          adminName,
          adminEmail,
        };
      })
    );
    
    return enrichedClubs;
  }

  /**
   * Approve a club
   */
  async approveClub(clubId: string, adminId: string): Promise<void> {
    // Verify the admin has permission
    const isAdmin = await this.studentRepository.isUniversityAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Only university admins can approve clubs');
    }

    // Verify club exists
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new Error('Club not found');
    }

    // Update club status
    await this.clubRepository.updateStatus(clubId, 'approved');

    if (club?.admin_student_id) {
      const clubAdmin = await this.studentRepository.findById(club.admin_student_id);
      if (clubAdmin) {
        // If the user is currently just a 'student', promote them to 'club_admin'
        if (clubAdmin.role === 'student') {
          await this.studentRepository.updateRole(club.admin_student_id, 'club_admin');
        }
        
        await this.emailService.sendClubApprovalEmail(clubAdmin.email, club.name);
      }
    }
  }


  /**
   * Reject a club
   */
  async rejectClub(clubId: string, adminId: string, reason: string): Promise<void> {
    // Verify the admin has permission
    const isAdmin = await this.studentRepository.isUniversityAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Only university admins can reject clubs');
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error('Rejection reason is required');
    }

    // Verify club exists
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new Error('Club not found');
    }

    // Update club status
    await this.clubRepository.updateStatus(clubId, 'rejected');

    if (club?.admin_student_id) {
      const clubAdmin = await this.studentRepository.findById(club.admin_student_id);
      if (clubAdmin) {
        await this.emailService.sendClubRejectionEmail(clubAdmin.email, club.name, reason);
      }
    }
  }


  /**
   * Check if a student is a university admin
   */
  async checkAdminAccess(studentId: string): Promise<boolean> {
    return this.studentRepository.isUniversityAdmin(studentId);
  }

  /**
   * Deactivate an approved club
   */
  async deactivateClub(clubId: string, adminId: string): Promise<void> {
    // Verify the admin has permission
    const isAdmin = await this.studentRepository.isUniversityAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Only university admins can deactivate clubs');
    }

    // Verify club exists
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new Error('Club not found');
    }

    if (club.status !== 'approved') {
      throw new Error('Only approved clubs can be deactivated');
    }

    // Update club status to deactivated (using 'suspended' as per existing type)
    await this.clubRepository.updateStatus(clubId, 'suspended');

    // Get club and admin info for email
    if (club?.admin_student_id) {
      const clubAdmin = await this.studentRepository.findById(club.admin_student_id);
      if (clubAdmin) {
        await this.emailService.sendClubDeactivationEmail(clubAdmin.email, club.name);
      }
    }
  }

  /**
   * Get all approved/active clubs
   */
  async getActiveClubs(): Promise<PendingClub[]> {
    const activeClubs = await this.clubRepository.findByStatus('approved');
    
    // Enrich with admin info
    const enrichedClubs: PendingClub[] = await Promise.all(
      activeClubs.map(async (club) => {
        let adminName: string | undefined;
        let adminEmail: string | undefined;
        
        if (club.admin_student_id) {
          const admin = await this.studentRepository.findById(club.admin_student_id);
          if (admin) {
            adminName = `${admin.first_name} ${admin.last_name}`;
            adminEmail = admin.email;
          }
        }
        
        return {
          clubId: club.club_id,
          name: club.name,
          description: club.description,
          category: club.category,
          coverPhotoUrl: club.cover_photo_url,
          adminStudentId: club.admin_student_id,
          createdAt: club.created_at,
          adminName,
          adminEmail,
        };
      })
    );
    
    return enrichedClubs;
  }
}

