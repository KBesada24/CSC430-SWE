import { EventRepository, EventFilters, Pagination } from '@/lib/repositories/event.repository';
import { ClubRepository } from '@/lib/repositories/club.repository';
import { RsvpRepository } from '@/lib/repositories/rsvp.repository';
import { StudentRepository } from '@/lib/repositories/student.repository';
import { NotificationService } from './notification.service';
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from '@/lib/utils/error-handler';
import { PaginatedResponse } from '@/lib/utils/api-response';
import { EventListItem, EventDetails, AttendeeWithStudent } from '@/types/api.types';

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

export class EventService {
  private eventRepository: EventRepository;
  private clubRepository: ClubRepository;
  private rsvpRepository: RsvpRepository;
  private studentRepository: StudentRepository;
  private notificationService: NotificationService;

  constructor() {
    this.eventRepository = new EventRepository();
    this.clubRepository = new ClubRepository();
    this.rsvpRepository = new RsvpRepository();
    this.studentRepository = new StudentRepository();
    this.notificationService = new NotificationService();
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
          eventId: event.event_id || (event as any).id,
          title: event.title,
          eventDate: event.event_date,
          location: event.location,
          description: event.description,
          clubId: event.club_id,
          createdAt: event.created_at,
          club: {
            clubId: club.club_id,
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
  async getById(id: string): Promise<EventDetails> {
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
      eventId: event.event_id || (event as any).id,
      title: event.title,
      eventDate: event.event_date,
      location: event.location,
      description: event.description,
      clubId: event.club_id,
      createdAt: event.created_at,
      club: {
        clubId: club.club_id,
        name: club.name,
        category: club.category,
      },
      attendeeCount: attendeeCount,
    };
  }

  /**
   * Creates a new event with date validation
   */
  async create(data: CreateEventDto): Promise<EventDetails> {
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

    // Notify members
    try {
      await this.notificationService.notifyClubMembers(
        data.clubId,
        'New Event!',
        `New event "${data.title}" has been scheduled for ${new Date(data.eventDate).toLocaleDateString()}.`,
        'event_invite',
        { eventId: event.event_id, clubId: data.clubId }
      );
    } catch (e) {
      console.error('Failed to send notifications:', e);
      // Don't fail the request if notification fails
    }

    return {
      eventId: event.event_id || (event as any).id,
      title: event.title,
      eventDate: event.event_date,
      location: event.location,
      description: event.description,
      clubId: event.club_id,
      createdAt: event.created_at,
      club: {
        clubId: club.club_id,
        name: club.name,
        category: club.category,
      },
      attendeeCount: 0,
    };
  }

  /**
   * Updates an event with date validation
   */
  async update(id: string, data: UpdateEventDto): Promise<EventDetails> {
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
      eventId: updatedEvent.event_id || (updatedEvent as any).id,
      title: updatedEvent.title,
      eventDate: updatedEvent.event_date,
      location: updatedEvent.location,
      description: updatedEvent.description,
      clubId: updatedEvent.club_id,
      createdAt: updatedEvent.created_at,
      club: {
        clubId: club.club_id,
        name: club.name,
        category: club.category,
      },
      attendeeCount: attendeeCount,
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
          studentId: rsvp.student_id,
          eventId: rsvp.event_id,
          createdAt: rsvp.created_at,
          student: {
            studentId: student.student_id,
            email: student.email,
            firstName: student.first_name,
            lastName: student.last_name,
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
      studentId: rsvp.student_id,
      eventId: rsvp.event_id,
      createdAt: rsvp.created_at,
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
