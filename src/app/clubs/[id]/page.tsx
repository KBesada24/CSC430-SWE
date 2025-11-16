'use client';

import { useParams, useRouter } from 'next/navigation';
import { useClub, useClubMembers, useJoinClub, useLeaveClub } from '@/lib/hooks/useClubs';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useStudentMemberships } from '@/lib/hooks/useStudent';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = params.id as string;
  
  const { user, isAuthenticated } = useAuth();
  const { data: club, isLoading } = useClub(clubId);
  const { data: members } = useClubMembers(clubId, 'active');
  const { data: memberships } = useStudentMemberships(user?.studentId || '');
  const { mutate: joinClub, isPending: isJoining } = useJoinClub();
  const { mutate: leaveClub, isPending: isLeaving } = useLeaveClub();
  
  const isJoined = memberships?.some(m => m.clubId === clubId && m.status === 'active');
  const isAdmin = club?.adminStudentId === user?.studentId;

  const handleJoinLeave = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isJoined && user) {
      leaveClub({ clubId, studentId: user.studentId });
    } else {
      joinClub(clubId);
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

  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <p>Club not found</p>
        </div>
      </div>
    );
  }

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

        {/* Cover Image */}
        <div className="relative h-64 rounded-lg overflow-hidden mb-8">
          <img
            src={club.coverPhotoUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'}
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur">
              {club.category}
            </Badge>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{club.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{club.memberCount} members</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {club.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            {club.nextEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Next Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{club.nextEvent.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(club.nextEvent.eventDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {club.nextEvent.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {members && members.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Members ({members.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.slice(0, 10).map((member) => (
                      <div key={member.studentId} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.student.firstName[0]}{member.student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {member.student.firstName} {member.student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.student.email}
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
                  variant={isJoined ? "outline" : "default"}
                  onClick={handleJoinLeave}
                  disabled={isJoining || isLeaving}
                >
                  {isJoining || isLeaving
                    ? 'Loading...'
                    : isJoined
                    ? 'Leave Club'
                    : 'Join Club'}
                </Button>
                {isAdmin && (
                  <Button className="w-full mt-2" variant="secondary">
                    Manage Club
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
