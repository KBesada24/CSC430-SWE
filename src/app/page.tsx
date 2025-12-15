'use client';

import React, { useRef, useCallback } from 'react';
import { Calendar, Search, TrendingUp, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import ClubCard from "@/components/clubs/ClubCard";
import ClubFilters from "@/components/clubs/ClubFilters";
import StatsCard from "@/components/dashboard/StatsCard";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClubs } from "@/lib/hooks/useClubs";
import { useEvents } from "@/lib/hooks/useEvents";
import { usePlatformStats, useStudentStats } from "@/lib/hooks/useStats";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Page() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [heroSearchInput, setHeroSearchInput] = React.useState<string>('');
  const clubsSectionRef = useRef<HTMLElement>(null);
  
  // Debounce the hero search input by 300ms
  const debouncedHeroSearch = useDebounce(heroSearchInput, 300);
  
  // Sync debounced hero search to the main search query
  React.useEffect(() => {
    setSearchQuery(debouncedHeroSearch);
  }, [debouncedHeroSearch]);

  // Scroll to clubs section and focus on browsing
  const handleExploreClubs = useCallback(() => {
    clubsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  // Fetch data
  const { data: clubsData, isLoading: clubsLoading } = useClubs(
    { category: selectedCategory || undefined, search: searchQuery || undefined },
    { page: 1, limit: 6 }
  );
  
  const { data: eventsData, isLoading: eventsLoading } = useEvents(
    { upcoming: true },
    { page: 1, limit: 3 }
  );
  
  const { data: platformStats } = usePlatformStats();
  const { data: studentStats } = useStudentStats(user?.studentId || '');

  const clubs = clubsData?.items || [];
  const events = eventsData?.items || [];
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Discover Your Community
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Join clubs, attend events, and connect with students who share your passions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for clubs..."
                  className="pl-10 h-12"
                  value={heroSearchInput}
                  onChange={(e) => setHeroSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setSearchQuery(heroSearchInput);
                    }
                  }}
                />
              </div>
              <Button size="lg" className="h-12" onClick={handleExploreClubs}>
                Explore Clubs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Clubs"
            value={platformStats?.totalClubs.toString() || '0'}
            description="Across all categories"
            icon={Users}
            trend={platformStats?.trends ? { 
              value: platformStats.trends.clubsChange, 
              isPositive: platformStats.trends.clubsChange >= 0 
            } : undefined}
          />
          <StatsCard
            title="Total Members"
            value={platformStats?.totalMembers.toLocaleString() || '0'}
            description="Students engaged"
            icon={TrendingUp}
            trend={platformStats?.trends ? { 
              value: platformStats.trends.membersChange, 
              isPositive: platformStats.trends.membersChange >= 0 
            } : undefined}
          />
          <StatsCard
            title="Upcoming Events"
            value={platformStats?.upcomingEvents.toString() || '0'}
            description="This month"
            icon={Calendar}
            trend={platformStats?.trends ? { 
              value: platformStats.trends.eventsChange, 
              isPositive: platformStats.trends.eventsChange >= 0 
            } : undefined}
          />
          {isAuthenticated && (
            <StatsCard
              title="Your Clubs"
              value={studentStats?.clubCount.toString() || '0'}
              description="Memberships"
              icon={Users}
            />
          )}
        </div>
      </section>

      {/* Main Content */}
      <section ref={clubsSectionRef} className="container px-4 py-8">
        <Tabs defaultValue="clubs" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="clubs">Browse Clubs</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          </TabsList>

          <TabsContent value="clubs" className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">All Clubs</h2>
              </div>
              <ClubFilters onFilterChange={setSelectedCategory} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clubsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : (
                clubs.map((club) => (
                  <ClubCard
                    key={club.clubId}
                    id={club.clubId}
                    name={club.name}
                    category={club.category}
                    description={club.description || ''}
                    memberCount={club.memberCount}
                    coverImage={club.coverPhotoUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Button variant="outline">View Calendar</Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : (
                events.map((event) => (
                  <EventCard
                    key={event.eventId}
                    id={event.eventId}
                    title={event.title}
                    clubName={event.club.name}
                    date={new Date(event.eventDate).toLocaleDateString()}
                    time={new Date(event.eventDate).toLocaleTimeString()}
                    location={event.location}
                    attendeeCount={0}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}