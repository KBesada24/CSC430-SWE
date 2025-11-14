import { EventRepository, EventFilters, Pagination } from '@/lib/repositories/event.repository';
import { ClubRepository } from '@/lib/repositories/club.repository';
import { RsvpRepository } from '@/lib/repositories/rsvp.repository';
import { StudentRepository } from '@/lib/repositories/student.repository';
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from '@/lib/utils/error-handler';
import { PaginatedResponse } from '@/lib/utils/api-response';

export interface CreateEventDto {
  title: string;
  eventDate: string;
  location: string;
  description?: string;
  clubId: string;
}

export interface UpdateEventDto {
  title?: string;
  eventDate?: string;
  location?: string;
  description?: string;
}

export interface EventWithDetails {
  event_id: string;
  title: string;
  event_date: string;
  location: string;
  description: string | null;
  club_id: string;
  created_at: string | null;
  club: {
    club_id: string;
    name: string;
    category: string;
  };
  attendee_count: number;
}

export interface EventListItem {
  event_id: string;
  title: string;
  event_date: string;
  location: string;
  description: string | null;
  club_id: string;
  created_at: string | null;
  club: {
    club_id: string;
    name: string;
    category: string;
  };
}

export interface AttendeeWithStudent {
  student_id: string;
  event_id: string;
  created_at: string | null;
  student: {
    student_id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export class EventService {
  private eventRepository: EventRepository;
  private clubRepository: ClubRepository;
  private rsvpRepository: RsvpRepository;
  private studentRepository: StudentRepository;

  constructor() {
    this.eventRepository = new EventRepository();
    this.clubRepository = new ClubRepository();
    this.rsvpRepository = new RsvpRepository();
    this.studentRepository = new StudentRepository();
  }

  /**
   * Gets all events with filtering and pagination
   */
  async getAll(
    filters: EventFilters,
    pagination: Pagination
  ): Promise<PaginatedResponse<EventListItem>> {
    const { events, total } = await this.eventRepository.findAll(filters, pagination);

    // Add club details to each event
    const eventsWithClubs = await Promise.all(
      events.map(async (event) => {
        const club = await this.clubRepository.findById(event.club_id);
        if (!club) {
          throw new NotFoundError('Club');
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

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      items: eventsWithClubs,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Gets an event by ID with club info and attendee count
   */
  async getById(id: string): Promise<EventWithDetails> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError('Event');
    }

    const club = await this.clubRepository.findById(event.club_id);
    if (!club) {
      throw new NotFoundError('Club');
    }

    const attendeeCount = await this.eventRepository.getAttendeeCount(id);

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
      attendee_count: attendeeCount,
    };
  }

  /**
   * Creates a new event with date validation
   */
  async create(data: CreateEventDto): Promise<EventWithDetails> {
    // Validate event date is in the future
    if (!this.validateEventDate(data.eventDate)) {
      throw new ValidationError('Event date must be in the future');
    }

    // Check if club exists
    const club = await this.clubRepository.findById(data.clubId);
    if (!club) {
      throw new NotFoundError('Club');
    }

    const event = await this.eventRepository.create({
      title: data.title,
      event_date: data.eventDate,
      location: data.location,
      description: data.description || null,
      club_id: data.clubId,
    });

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
      attendee_count: 0,
    };
  }

  /**
   * Updates an event with date validation
   */
  async update(id: string, data: UpdateEventDto): Promise<EventWithDetails> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError('Event');
    }

    // Validate event date if provided
    if (data.eventDate && !this.validateEventDate(data.eventDate)) {
      throw new ValidationError('Event date must be in the future');
    }

    // Prepare update data
    const updateData: any = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.eventDate !== undefined) {
      updateData.event_date = data.eventDate;
    }
    if (data.location !== undefined) {
      updateData.location = data.location;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    const updatedEvent = await this.eventRepository.update(id, updateData);

    const club = await this.clubRepository.findById(updatedEvent.club_id);
    if (!club) {
      throw new NotFoundError('Club');
    }

    const attendeeCount = await this.eventRepository.getAttendeeCount(id);

    return {
      event_id: updatedEvent.event_id,
      title: updatedEvent.title,
      event_date: updatedEvent.event_date,
      location: updatedEvent.location,
      description: updatedEvent.description,
      club_id: updatedEvent.club_id,
      created_at: updatedEvent.created_at,
      club: {
        club_id: club.club_id,
        name: club.name,
        category: club.category,
      },
      attendee_count: attendeeCount,
    };
  }

  /**
   * Deletes an event and cascades to RSVPs
   */
  async delete(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError('Event');
    }

    // Delete all RSVPs for this event
    const rsvps = await this.rsvpRepository.findByEvent(id);
    await Promise.all(
      rsvps.map((rsvp) => this.rsvpRepository.delete(rsvp.student_id, id))
    );

    // Delete the event
    await this.eventRepository.delete(id);
  }

  /**
   * Validates that an event date is in the future
   */
  validateEventDate(date: string): boolean {
    const eventDate = new Date(date);
    const now = new Date();
    return eventDate > now;
  }

  /**
   * Gets all attendees for an event
   */
  async getAttendees(eventId: string): Promise<AttendeeWithStudent[]> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event');
    }

    const rsvps = await this.rsvpRepository.findByEvent(eventId);

    // Fetch student details for each RSVP
    const attendeesWithStudents = await Promise.all(
      rsvps.map(async (rsvp) => {
        const student = await this.studentRepository.findById(rsvp.student_id);
        if (!student) {
          throw new NotFoundError('Student');
        }

        return {
          student_id: rsvp.student_id,
          event_id: rsvp.event_id,
          created_at: rsvp.created_at,
          student: {
            student_id: student.student_id,
            email: student.email,
            first_name: student.first_name,
            last_name: student.last_name,
          },
        };
      })
    );

    return attendeesWithStudents;
  }

  /**
   * Adds an RSVP for a student to an event
   */
  async addRsvp(eventId: string, studentId: string) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event');
    }

    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student');
    }

    // Check if RSVP already exists
    const existingRsvp = await this.rsvpRepository.findByStudentAndEvent(studentId, eventId);
    if (existingRsvp) {
      throw new ConflictError('Student has already RSVP\'d to this event');
    }

    const rsvp = await this.rsvpRepository.create(studentId, eventId);

    return {
      student_id: rsvp.student_id,
      event_id: rsvp.event_id,
      created_at: rsvp.created_at,
    };
  }

  /**
   * Removes an RSVP for a student from an event
   */
  async removeRsvp(eventId: string, studentId: string): Promise<void> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event');
    }

    const rsvp = await this.rsvpRepository.findByStudentAndEvent(studentId, eventId);
    if (!rsvp) {
      throw new NotFoundError('RSVP');
    }

    await this.rsvpRepository.delete(studentId, eventId);
  }
}
