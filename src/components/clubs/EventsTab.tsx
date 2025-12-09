'use client';

import { useEvents } from '@/lib/hooks/useEvents';
import EventCard from '@/components/events/EventCard';
import CreateEventModal from '@/components/events/CreateEventModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EventsTabProps {
  clubId: string;
  isAdmin: boolean;
}

export default function EventsTab({ clubId, isAdmin }: EventsTabProps) {
  const { data: eventsResponse, isLoading } = useEvents({ clubId }, { page: 1, limit: 10 });
  const events = eventsResponse?.items || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Upcoming Events
        </h2>
        {isAdmin && <CreateEventModal clubId={clubId} />}
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No upcoming events</p>
            <p className="text-sm">Check back later for new events!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <EventCard 
              key={event.eventId} 
              id={event.eventId}
              title={event.title}
              clubName={event.club.name}
              date={new Date(event.eventDate).toLocaleDateString()}
              time={new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              location={event.location}
              attendeeCount={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
