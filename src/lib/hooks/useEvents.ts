import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api/events';
import { EventFilters, Pagination } from '@/types/api.types';
import { toast } from 'sonner';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters?: EventFilters, pagination?: Pagination) =>
    [...eventKeys.lists(), { filters, pagination }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  attendees: (id: string) => [...eventKeys.detail(id), 'attendees'] as const,
};

// Fetch events with filters
export function useEvents(filters?: EventFilters, pagination?: Pagination) {
  return useQuery({
    queryKey: eventKeys.list(filters, pagination),
    queryFn: () => eventsApi.getEvents(filters, pagination),
  });
}

// Fetch single event
export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getEvent(id),
    enabled: !!id,
  });
}

// Fetch event attendees
export function useEventAttendees(eventId: string) {
  return useQuery({
    queryKey: eventKeys.attendees(eventId),
    queryFn: () => eventsApi.getAttendees(eventId),
    enabled: !!eventId,
  });
}

// RSVP to event mutation
export function useRsvpEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventsApi.rsvpEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.attendees(eventId) });
      toast.success('RSVP successful!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to RSVP');
    },
  });
}

// Cancel RSVP mutation
export function useCancelRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, studentId }: { eventId: string; studentId: string }) =>
      eventsApi.cancelRsvp(eventId, studentId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.attendees(eventId) });
      toast.success('RSVP canceled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel RSVP');
    },
  });
}

// Create event mutation
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('Event created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    },
  });
}

// Update event mutation
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      eventsApi.updateEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('Event updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update event');
    },
  });
}
