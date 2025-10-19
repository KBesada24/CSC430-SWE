"use client";

import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventCardProps {
  id: string;
  title: string;
  clubName: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
  maxAttendees?: number;
  isRsvped?: boolean;
}

export default function EventCard({
  title = "Sample Event",
  clubName = "Sample Club",
  date = "Jan 1, 2024",
  time = "10:00 AM",
  location = "Main Hall",
  attendeeCount = 0,
  maxAttendees,
  isRsvped = false,
}: EventCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{clubName}</p>
          </div>
          {isRsvped && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              RSVP'd
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>
            {attendeeCount} {maxAttendees ? `/ ${maxAttendees}` : ""} attending
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant={isRsvped ? "outline" : "default"}>
          {isRsvped ? "Cancel RSVP" : "RSVP"}
        </Button>
      </CardFooter>
    </Card>
  );
}