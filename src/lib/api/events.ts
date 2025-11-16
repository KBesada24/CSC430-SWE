/**
 * Events API
 */

import apiClient from './client';
import {
  EventListItem,
  EventDetails,
  CreateEventDto,
  UpdateEventDto,
  EventFilters,
  Pagination,
  PaginatedResponse,
  AttendeeWithStudent,
  RsvpDto,
} from '@/types/api.types';

export const eventsApi = {
  /**
   * Get all events with filters and pagination
   */
  getEvents: async (
    filters?: EventFilters,
    pagination?: Pagination
  ): Promise<PaginatedResponse<EventListItem>> => {
    const params = new URLSearchParams();
    
    if (filters?.clubId) params.append('clubId', filters.clubId);
    if (filters?.upcoming !== undefined) params.append('upcoming', filters.upcoming.toString());
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    const queryString = params.toString();
    return apiClient.get(`/events${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get event by ID
   */
  getEvent: async (id: string): Promise<EventDetails> => {
    return apiClient.get(`/events/${id}`);
  },

  /**
   * Create a new event
   */
  createEvent: async (data: CreateEventDto): Promise<EventDetails> => {
    return apiClient.post('/events', data);
  },

  /**
   * Update an event
   */
  updateEvent: async (id: string, data: UpdateEventDto): Promise<EventDetails> => {
    return apiClient.patch(`/events/${id}`, data);
  },

  /**
   * Delete an event
   */
  deleteEvent: async (id: string): Promise<void> => {
    return apiClient.delete(`/events/${id}`);
  },

  /**
   * Get event attendees
   */
  getAttendees: async (eventId: string): Promise<AttendeeWithStudent[]> => {
    const response = await apiClient.get<{ attendees: AttendeeWithStudent[] }>(
      `/events/${eventId}/rsvps`
    );
    return response.attendees;
  },

  /**
   * RSVP to an event
   */
  rsvpEvent: async (eventId: string): Promise<RsvpDto> => {
    return apiClient.post(`/events/${eventId}/rsvps`);
  },

  /**
   * Cancel RSVP
   */
  cancelRsvp: async (eventId: string, studentId: string): Promise<void> => {
    return apiClient.delete(`/events/${eventId}/rsvps/${studentId}`);
  },
};
