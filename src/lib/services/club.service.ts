import { ClubRepository, ClubFilters, Pagination } from '@/lib/repositories/club.repository';
import { MembershipRepository, MembershipStatus } from '@/lib/repositories/membership.repository';
import { EventRepository } from '@/lib/repositories/event.repository';
import { StudentRepository } from '@/lib/repositories/student.repository';
import {
  NotFoundError,
  ConflictError,
} from '@/lib/utils/error-handler';
import { PaginatedResponse } from '@/lib/utils/api-response';

export interface CreateClubDto {
  name: string;
  description?: string;
  category: string;
  coverPhotoUrl?: string;
}

export interface UpdateClubDto {
  name?: string;
  description?: string;
  category?: string;
  coverPhotoUrl?: string;
}

export interface ClubWithDetails {
  club_id: string;
  name: string;
  description: string | null;
  category: string;
  cover_photo_url: string | null;
  admin_student_id: string | null;
  created_at: string | null;
  member_count: number;
  next_event: {
    event_id: string;
    title: string;
    event_date: string;
    location: string;
  } | null;
}

export interface ClubListItem {
  club_id: string;
  name: string;
  description: string | null;
  category: string;
  cover_photo_url: string | null;
  admin_student_id: string | null;
  created_at: string | null;
  member_count: number;
}

export interface MemberWithStudent {
  student_id: string;
  club_id: string;
  status: string;
  created_at: string | null;
  student: {
    student_id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export class ClubService {
  private clubRepository: ClubRepository;
  private membershipRepository: MembershipRepository;
  private eventRepository: EventRepository;
  private studentRepository: StudentRepository;

  constructor() {
    this.clubRepository = new ClubRepository();
    this.membershipRepository = new MembershipRepository();
    this.eventRepository = new EventRepository();
    this.studentRepository = new StudentRepository();
  }

  /**
   * Gets all clubs with filtering, search, and pagination
   */
  async getAll(
    filters: ClubFilters,
    pagination: Pagination
  ): Promise<PaginatedResponse<ClubListItem>> {
    const { clubs, total } = await this.clubRepository.findAll(filters, pagination);

    // Add member count to each club
    const clubsWithCounts = await Promise.all(
      clubs.map(async (club) => {
        const memberCount = await this.clubRepository.getMemberCount(club.club_id);
        return {
          club_id: club.club_id,
          name: club.name,
          description: club.description,
          category: club.category,
          cover_photo_url: club.cover_photo_url,
          admin_student_id: club.admin_student_id,
          created_at: club.created_at,
          member_count: memberCount,
        };
      })
    );

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      items: clubsWithCounts,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Gets a club by ID with member count and next event
   */
  async getById(id: string): Promise<ClubWithDetails> {
    const club = await this.clubRepository.findById(id);
    if (!club) {
      throw new NotFoundError('Club');
    }

    // Get member count
    const memberCount = await this.clubRepository.getMemberCount(id);

    // Get next event
    const nextEventData = await this.clubRepository.getNextEvent(id);
    const nextEvent = nextEventData
      ? {
          event_id: nextEventData.event_id,
          title: nextEventData.title,
          event_date: nextEventData.event_date,
          location: nextEventData.location,
        }
      : null;

    return {
      club_id: club.club_id,
      name: club.name,
      description: club.description,
      category: club.category,
      cover_photo_url: club.cover_photo_url,
      admin_student_id: club.admin_student_id,
      created_at: club.created_at,
      member_count: memberCount,
      next_event: nextEvent,
    };
  }

  /**
   * Creates a new club with the specified admin
   */
  async create(data: CreateClubDto, adminId: string): Promise<ClubWithDetails> {
    const club = await this.clubRepository.create({
      name: data.name,
      description: data.description || null,
      category: data.category,
      cover_photo_url: data.coverPhotoUrl || null,
      admin_student_id: adminId,
    });

    try {
      // Create active membership for admin
      await this.membershipRepository.create(adminId, club.club_id);
      await this.membershipRepository.updateStatus(adminId, club.club_id, 'active');

      // Upgrade user to club_admin role if they're just a regular student
      const student = await this.studentRepository.findById(adminId);
      if (student && student.role === 'student') {
        await this.studentRepository.updateRole(adminId, 'club_admin');
      }

      return {
        club_id: club.club_id,
        name: club.name,
        description: club.description,
        category: club.category,
        cover_photo_url: club.cover_photo_url,
        admin_student_id: club.admin_student_id,
        created_at: club.created_at,
        member_count: 1, // Admin is the first member
        next_event: null,
      };
    } catch (error) {
      // Rollback: delete the created club (and cascading memberships)
      console.error('Club creation failed, rolling back:', error);
      try {
        await this.delete(club.club_id);
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
      throw error;
    }
  }

  /**
   * Updates club information
   */
  async update(id: string, data: UpdateClubDto): Promise<ClubWithDetails> {
    const club = await this.clubRepository.findById(id);
    if (!club) {
      throw new NotFoundError('Club');
    }

    // Prepare update data
    const updateData: any = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.category !== undefined) {
      updateData.category = data.category;
    }
    if (data.coverPhotoUrl !== undefined) {
      updateData.cover_photo_url = data.coverPhotoUrl;
    }

    const updatedClub = await this.clubRepository.update(id, updateData);

    // Get member count and next event
    const memberCount = await this.clubRepository.getMemberCount(id);
    const nextEventData = await this.clubRepository.getNextEvent(id);
    const nextEvent = nextEventData
      ? {
          event_id: nextEventData.event_id,
          title: nextEventData.title,
          event_date: nextEventData.event_date,
          location: nextEventData.location,
        }
      : null;

    return {
      club_id: updatedClub.club_id,
      name: updatedClub.name,
      description: updatedClub.description,
      category: updatedClub.category,
      cover_photo_url: updatedClub.cover_photo_url,
      admin_student_id: updatedClub.admin_student_id,
      created_at: updatedClub.created_at,
      member_count: memberCount,
      next_event: nextEvent,
    };
  }

  /**
   * Deletes a club and cascades to memberships and events
   */
  async delete(id: string): Promise<void> {
    const club = await this.clubRepository.findById(id);
    if (!club) {
      throw new NotFoundError('Club');
    }

    // Delete all events for this club (RSVPs will cascade via DB constraints)
    const events = await this.eventRepository.findByClubId(id);
    await Promise.all(events.map((event) => this.eventRepository.delete(event.event_id)));

    // Delete all memberships for this club
    const memberships = await this.membershipRepository.findByClub(id);
    await Promise.all(
      memberships.map((membership) =>
        this.membershipRepository.delete(membership.student_id, id)
      )
    );

    // Delete the club
    await this.clubRepository.delete(id);
  }

  /**
   * Checks if a student is the admin of a club
   */
  async isAdmin(clubId: string, studentId: string): Promise<boolean> {
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundError('Club');
    }

    return club.admin_student_id === studentId;
  }

  /**
   * Gets all members of a club with optional status filter
   */
  async getMembers(clubId: string, status?: MembershipStatus): Promise<MemberWithStudent[]> {
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundError('Club');
    }

    const memberships = await this.membershipRepository.findByClub(clubId, status);

    // Fetch student details for each membership
    const membersWithStudents = await Promise.all(
      memberships.map(async (membership) => {
        const student = await this.studentRepository.findById(membership.student_id);
        if (!student) {
          throw new NotFoundError('Student');
        }

        return {
          student_id: membership.student_id,
          club_id: membership.club_id,
          status: membership.status,
          created_at: membership.created_at,
          student: {
            student_id: student.student_id,
            email: student.email,
            first_name: student.first_name,
            last_name: student.last_name,
          },
        };
      })
    );

    return membersWithStudents;
  }

  /**
   * Adds a member to a club (creates pending membership)
   */
  async addMember(clubId: string, studentId: string) {
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundError('Club');
    }

    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student');
    }

    // Check if membership already exists
    const existingMembership = await this.membershipRepository.findByStudentAndClub(
      studentId,
      clubId
    );
    if (existingMembership) {
      throw new ConflictError('Student is already a member or has a pending request');
    }

    // Create pending membership
    const membership = await this.membershipRepository.create(studentId, clubId);

    return {
      student_id: membership.student_id,
      club_id: membership.club_id,
      status: membership.status,
      created_at: membership.created_at,
    };
  }

  /**
   * Updates membership status (approve/reject)
   */
  async updateMemberStatus(
    clubId: string,
    studentId: string,
    status: MembershipStatus
  ) {
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundError('Club');
    }

    const membership = await this.membershipRepository.findByStudentAndClub(studentId, clubId);
    if (!membership) {
      throw new NotFoundError('Membership');
    }

    const updatedMembership = await this.membershipRepository.updateStatus(
      studentId,
      clubId,
      status
    );

    return {
      student_id: updatedMembership.student_id,
      club_id: updatedMembership.club_id,
      status: updatedMembership.status,
      created_at: updatedMembership.created_at,
    };
  }

  /**
   * Removes a member from a club
   */
  async removeMember(clubId: string, studentId: string): Promise<void> {
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundError('Club');
    }

    const membership = await this.membershipRepository.findByStudentAndClub(studentId, clubId);
    if (!membership) {
      throw new NotFoundError('Membership');
    }

    await this.membershipRepository.delete(studentId, clubId);
  }
}
