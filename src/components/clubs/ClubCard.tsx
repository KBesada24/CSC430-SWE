"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ClubCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  memberCount: number;
  coverImage: string;
  nextEvent?: {
    title: string;
    date: string;
  };
  isJoined?: boolean;
}

export default function ClubCard({
  name = "Sample Club",
  category = "Academic",
  description = "Join us for exciting activities and events!",
  memberCount = 0,
  coverImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  nextEvent,
  isJoined = false,
}: ClubCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{memberCount}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      {nextEvent && (
        <CardContent className="pb-3">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-4 w-4 mt-0.5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{nextEvent.title}</p>
              <p className="text-xs text-muted-foreground">{nextEvent.date}</p>
            </div>
          </div>
        </CardContent>
      )}

      <CardFooter className="pt-3">
        <Button className="w-full" variant={isJoined ? "outline" : "default"}>
          {isJoined ? "View Club" : "Join Club"}
        </Button>
      </CardFooter>
    </Card>
  );
}