import { Calendar, Search, TrendingUp, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import ClubCard from "@/components/clubs/ClubCard";
import ClubFilters from "@/components/clubs/ClubFilters";
import StatsCard from "@/components/dashboard/StatsCard";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockClubs = [
  {
    id: "1",
    name: "Computer Science Society",
    category: "Technology",
    description: "Learn, code, and innovate together. Weekly workshops and hackathons.",
    memberCount: 245,
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    nextEvent: {
      title: "Web Development Workshop",
      date: "Tomorrow, 6:00 PM",
    },
  },
  {
    id: "2",
    name: "Photography Club",
    category: "Arts",
    description: "Capture moments, share stories. Monthly photo walks and exhibitions.",
    memberCount: 128,
    coverImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    nextEvent: {
      title: "Campus Photo Walk",
      date: "This Saturday, 9:00 AM",
    },
  },
  {
    id: "3",
    name: "Debate Society",
    category: "Academic",
    description: "Sharpen your argumentation skills. Weekly debates on current affairs.",
    memberCount: 89,
    coverImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
  },
  {
    id: "4",
    name: "Basketball Team",
    category: "Sports",
    description: "Join our competitive basketball team. Practice sessions every week.",
    memberCount: 56,
    coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    nextEvent: {
      title: "Practice Session",
      date: "Every Monday & Thursday",
    },
  },
  {
    id: "5",
    name: "Cultural Exchange",
    category: "Cultural",
    description: "Celebrate diversity through food, music, and traditions from around the world.",
    memberCount: 312,
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    nextEvent: {
      title: "International Food Festival",
      date: "Next Friday, 5:00 PM",
    },
  },
  {
    id: "6",
    name: "Entrepreneurship Club",
    category: "Professional",
    description: "Build your startup dreams. Mentorship, networking, and pitch competitions.",
    memberCount: 167,
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
  },
];

const mockEvents = [
  {
    id: "1",
    title: "Web Development Workshop",
    clubName: "Computer Science Society",
    date: "Tomorrow",
    time: "6:00 PM - 8:00 PM",
    location: "Tech Lab 101",
    attendeeCount: 45,
    maxAttendees: 50,
    isRsvped: true,
  },
  {
    id: "2",
    title: "Campus Photo Walk",
    clubName: "Photography Club",
    date: "This Saturday",
    time: "9:00 AM - 12:00 PM",
    location: "Main Campus",
    attendeeCount: 23,
  },
  {
    id: "3",
    title: "International Food Festival",
    clubName: "Cultural Exchange",
    date: "Next Friday",
    time: "5:00 PM - 9:00 PM",
    location: "Student Center",
    attendeeCount: 156,
    maxAttendees: 200,
  },
];

export default function Page() {
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
                />
              </div>
              <Button size="lg" className="h-12">
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
            value="127"
            description="Across all categories"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Members"
            value="3,847"
            description="Students engaged"
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Upcoming Events"
            value="24"
            description="This month"
            icon={Calendar}
          />
          <StatsCard
            title="Your Clubs"
            value="5"
            description="Memberships"
            icon={Users}
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 py-8">
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
              <ClubFilters />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockClubs.map((club) => (
                <ClubCard key={club.id} {...club} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Button variant="outline">View Calendar</Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}