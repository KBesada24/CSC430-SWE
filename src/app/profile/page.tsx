'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useStudentMemberships } from '@/lib/hooks/useStudent';
import { useUpdateProfile } from '@/lib/hooks/useStudent';
import { MembershipWithClub } from '@/types/api.types';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Calendar, Users } from 'lucide-react';

function ProfileContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: memberships, isLoading: membershipsLoading } = useStudentMemberships(user?.studentId || '');
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateProfile(
        { id: user.studentId, data: formData },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    }
  };

  const activeMemberships = memberships?.filter((m: MembershipWithClub) => m.status === 'active') || [];
  const pendingMemberships = memberships?.filter((m: MembershipWithClub) => m.status === 'pending') || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-2xl">
                      {user?.firstName[0]}{user?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user?.firstName} {user?.lastName}</CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.firstName} {user?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Clubs */}
          <Card>
            <CardHeader>
              <CardTitle>My Clubs ({activeMemberships.length})</CardTitle>
              <CardDescription>Clubs you are currently a member of</CardDescription>
            </CardHeader>
            <CardContent>
              {membershipsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : activeMemberships.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-4">You haven't joined any clubs yet</p>
                  <Button onClick={() => router.push('/')}>
                    Explore Clubs
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeMemberships.map((membership: MembershipWithClub) => (
                    <div
                      key={membership.clubId}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => router.push(`/clubs/${membership.clubId}`)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {membership.club.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{membership.club.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {membership.club.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Applications */}
          {pendingMemberships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications ({pendingMemberships.length})</CardTitle>
                <CardDescription>Club memberships awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingMemberships.map((membership: MembershipWithClub) => (
                    <div
                      key={membership.clubId}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer opacity-75"
                      onClick={() => router.push(`/clubs/${membership.clubId}`)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {membership.club.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{membership.club.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {membership.club.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
