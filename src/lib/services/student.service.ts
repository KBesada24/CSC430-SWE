import { StudentRepository } from '@/lib/repositories/student.repository';
import { MembershipRepository } from '@/lib/repositories/membership.repository';
import { RsvpRepository } from '@/lib/repositories/rsvp.repository';
import { ClubRepository } from '@/lib/repositories/club.repository';
import { EventRepository } from '@/lib/repositories/event.repository';
import { NotFoundError } from '@/lib/utils/error-handler';

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface StudentProfile {
  student_id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string | null;
}

export interface MembershipWithClub {
  student_id: string;
  club_id: string;
  status: string;
  created_at: string | null;
  club: {
    club_id: string;
    name: string;
    description: string | null;
    category: string;
    cover_photo_url: string | null;
    admin_student_id: string | null;
    created_at: string | null;
  };
}

export interface EventWithClub {
  event_id: string;
  title: string;
  event_date: string;
  location: string;
  description: string | null;
  club_id: string;
  created_at: string;
  club: {
    club_id: string;
    name: string;
    category: string;
  };
}

export class StudentService {
  private studentRepository: StudentRepository;
  private membershipRepository: MembershipRepository;
  private rsvpRepository: RsvpRepository;
  private clubRepository: ClubRepository;
  private eventRepository: EventRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
    this.membershipRepository = new MembershipRepository();
    this.rsvpRepository = new RsvpRepository();
    this.clubRepository = new ClubRepository();
    this.eventRepository = new EventRepository();
  }

  /**
   * Retrieves student profile by ID (without password)
   */
  async getById(id: string): Promise<StudentProfile> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError('Student');
    }

    return {
      student_id: student.student_id,
      email: student.email,
      first_name: student.first_name,
      last_name: student.last_name,
      created_at: student.created_at,
    };
  }

  /**
   * Updates student profile information
   */
  async update(id: string, data: UpdateStudentDto): Promise<StudentProfile> {
    // Check if student exists
    const existingStudent = await this.studentRepository.findById(id);
    if (!existingStudent) {
      throw new NotFoundError('Student');
    }

    // Prepare update data
    const updateData: any = {};
    if (data.firstName !== undefined) {
      updateData.first_name = data.firstName;
    }
    if (data.lastName !== undefined) {
      updateData.last_name = data.lastName;
    }
    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    // Update student
    const updatedStudent = await this.studentRepository.update(id, updateData);

    return {
      student_id: updatedStudent.student_id,
      email: updatedStudent.email,
      first_name: updatedStudent.first_name,
      last_name: updatedStudent.last_name,
      created_at: updatedStudent.created_at,
    };
  }

  /**
   * Gets all club memberships for a student
   */
  async getMemberships(studentId: string): Promise<MembershipWithClub[]> {
    // Check if student exists
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student');
    }

    // Get memberships
    const memberships = await this.membershipRepository.findByStudent(studentId);

    // Fetch club details for each membership
    const membershipsWithClubs = await Promise.all(
      memberships.map(async (membership) => {
        const club = await this.clubRepository.findById(membership.club_id);
        if (!club) {
          throw new NotFoundError('Club');
        }

        return {
          student_id: membership.student_id,
          club_id: membership.club_id,
          status: membership.status,
          created_at: membership.created_at,
          club: {
            club_id: club.club_id,
            name: club.name,
            description: club.description,
            category: club.category,
            cover_photo_url: club.cover_photo_url,
            admin_student_id: club.admin_student_id,
            created_at: club.created_at,
          },
        };
      })
    );

    return membershipsWithClubs;
  }

  /**
   * Gets all upcoming events that the student has RSVP'd to
   */
  async getUpcomingEvents(studentId: string): Promise<EventWithClub[]> {
    // Check if student exists
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student');
    }

    // Get all RSVPs for the student
    const rsvps = await this.rsvpRepository.findByStudent(studentId);

    // Fetch event and club details for each RSVP
    const eventsWithClubs = await Promise.all(
      rsvps.map(async (rsvp) => {
        const event = await this.eventRepository.findById(rsvp.event_id);
        if (!event) {
          return null; // Skip if event was deleted
        }

        // Only include upcoming events
        if (new Date(event.event_date) < new Date()) {
          return null;
        }

        const club = await this.clubRepository.findById(event.club_id);
        if (!club) {
          return null; // Skip if club was deleted
        }

        return {
          event_id: event.event_id,
          title: event.title,
          event_date: event.event_date,
          location: event.location,
          description: event.description,
          club_id: event.club_id,
          created_at: event.created_at,
          club: {
            club_id: club.club_id,
            name: club.name,
            category: club.category,
          },
        };
      })
    );

    // Filter out null values and return
    return eventsWithClubs.filter((event): event is EventWithClub => event !== null);
  }
}
