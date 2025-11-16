'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEvent, useEventAttendees, useRsvpEvent, useCancelRsvp } from '@/lib/hooks/useEvents';
import { useAuth } from '@/lib/contexts/AuthContext';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, MapPin, Users, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const { user, isAuthenticated } = useAuth();
  const { data: event, isLoading } = useEvent(eventId);
  const { data: attendees } = useEventAttendees(eventId);
  const { mutate: rsvp, isPending: isRsvping } = useRsvpEvent();
  const { mutate: cancelRsvp, isPending: isCanceling } = useCancelRsvp();
  
  const isRsvped = attendees?.some(a => a.studentId === user?.studentId);

  const handleRsvp = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isRsvped && user) {
      cancelRsvp({ eventId, studentId: user.studentId });
    } else {
      rsvp(eventId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <p>Event not found</p>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold">{event.title}</h1>
                {isRsvped && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    RSVP'd
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground">
                Hosted by {event.club.name}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {eventDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {eventDate.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Attendees</p>
                    <p className="text-sm text-muted-foreground">
                      {event.attendeeCount} attending
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {event.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            )}

            {attendees && attendees.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attendees ({attendees.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attendees.slice(0, 10).map((attendee) => (
                      <div key={attendee.studentId} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {attendee.student.firstName[0]}{attendee.student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {attendee.student.firstName} {attendee.student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {attendee.student.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <Button
                  className="w-full"
                  variant={isRsvped ? "outline" : "default"}
                  onClick={handleRsvp}
                  disabled={isRsvping || isCanceling}
                >
                  {isRsvping || isCanceling
                    ? 'Loading...'
                    : isRsvped
                    ? 'Cancel RSVP'
                    : 'RSVP to Event'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hosted By</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push(`/clubs/${event.clubId}`)}
                >
                  <div className="text-left">
                    <p className="font-medium">{event.club.name}</p>
                    <p className="text-sm text-muted-foreground">{event.club.category}</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
