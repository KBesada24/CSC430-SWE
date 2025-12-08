'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, Users, Ban, Building2 } from 'lucide-react';
import { usePendingClubs, useApproveClub, useRejectClub, useActiveClubs, useDeactivateClub } from '@/lib/hooks/useAdmin';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: pendingClubs, isLoading: clubsLoading, error } = usePendingClubs();
  const { data: activeClubs, isLoading: activeClubsLoading } = useActiveClubs();
  const { mutate: approveClub, isPending: isApproving } = useApproveClub();
  const { mutate: rejectClub, isPending: isRejecting } = useRejectClub();
  const { mutate: deactivateClub, isPending: isDeactivating } = useDeactivateClub();
  
  const [rejectReason, setRejectReason] = React.useState('');
  const [selectedClubId, setSelectedClubId] = React.useState<string | null>(null);
  const [rejectingClubId, setRejectingClubId] = React.useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = React.useState(false);
  const [deactivatingClubs, setDeactivatingClubs] = React.useState<Set<string>>(new Set());
  const [approvingClubId, setApprovingClubId] = React.useState<string | null>(null);

  // Redirect if not authenticated or not an admin
  React.useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'university_admin') {
        router.push('/dashboard'); // or a forbidden page
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleApprove = (clubId: string) => {
    setApprovingClubId(clubId);
    approveClub(clubId, {
      onSettled: () => {
        setApprovingClubId(null);
      }
    });
  };

  const handleRejectClick = (clubId: string) => {
    setRejectReason('');
    setSelectedClubId(clubId);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedClubId && rejectReason.trim()) {
      setRejectingClubId(selectedClubId);
      rejectClub(
        { clubId: selectedClubId, reason: rejectReason },
        {
          onSuccess: () => {
            setRejectDialogOpen(false);
            setRejectReason('');
            setSelectedClubId(null);
          },
          onSettled: () => {
             setRejectingClubId(null);
          }
        }
      );
    }
  };

  const handleDeactivateClick = (clubId: string) => {
    setSelectedClubId(clubId);
    setDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = () => {
    if (selectedClubId) {
      const clubId = selectedClubId;
      setDeactivatingClubs(prev => new Set(prev).add(clubId));
      deactivateClub(clubId, {
        onSuccess: () => {
          setDeactivateDialogOpen(false);
          setSelectedClubId(null);
        },
        onSettled: () => {
          setDeactivatingClubs(prev => {
            const next = new Set(prev);
            next.delete(clubId);
            return next;
          });
        }
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage club approvals and platform settings
          </p>
        </div>

        <div className="space-y-8">
          {/* Pending Clubs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Club Approvals
              </CardTitle>
              <CardDescription>
                Review and approve or reject new club applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clubsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You don&apos;t have admin access or there was an error loading pending clubs.</p>
                </div>
              ) : pendingClubs && pendingClubs.length > 0 ? (
                <div className="space-y-4">
                  {pendingClubs.map((club) => (
                    <div
                      key={club.clubId}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{club.name}</h3>
                          <Badge variant="outline">{club.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {club.description || 'No description provided'}
                        </p>
                        {club.adminName && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Requested by: {club.adminName}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(club.clubId)}
                          disabled={isApproving && approvingClubId === club.clubId}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Dialog 
                          open={rejectDialogOpen && selectedClubId === club.clubId} 
                          onOpenChange={(open) => {
                            setRejectDialogOpen(open);
                            if (!open) setRejectReason('');
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectClick(club.clubId)}
                              disabled={rejectingClubId === club.clubId}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Club Application</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting &quot;{club.name}&quot;. This will be sent to the applicant via email.
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              placeholder="Enter rejection reason..."
                              value={rejectReason}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectReason(e.target.value)}
                              className="min-h-[100px]"
                            />
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleRejectConfirm}
                                disabled={!rejectReason.trim() || rejectingClubId === club.clubId}
                              >
                                Reject Club
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending club applications</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Clubs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Active Clubs
              </CardTitle>
              <CardDescription>
                Manage approved clubs. Deactivate clubs that violate policies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeClubsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : activeClubs && activeClubs.length > 0 ? (
                <div className="space-y-4">
                  {activeClubs.map((club) => (
                    <div
                      key={club.clubId}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{club.name}</h3>
                          <Badge variant="outline">{club.category}</Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {club.description || 'No description provided'}
                        </p>
                        {club.adminName && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Admin: {club.adminName}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={deactivateDialogOpen && selectedClubId === club.clubId} onOpenChange={setDeactivateDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeactivateClick(club.clubId)}
                              disabled={deactivatingClubs.has(club.clubId)}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Deactivate
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Deactivate Club</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to deactivate &quot;{club.name}&quot;? This club will no longer be visible to students.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeactivateConfirm}
                                disabled={isDeactivating}
                              >
                                Deactivate Club
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active clubs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

