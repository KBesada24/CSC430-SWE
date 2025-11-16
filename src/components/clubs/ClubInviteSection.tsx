'use client';

import { useState } from 'react';
import { useClubInvite } from '@/lib/hooks/useClubs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ClubInviteSectionProps {
  clubId: string;
}

export default function ClubInviteSection({ clubId }: ClubInviteSectionProps) {
  const [copied, setCopied] = useState(false);
  const { data: invite, isLoading } = useClubInvite(clubId);

  const handleCopy = async () => {
    if (!invite?.inviteUrl) return;

    try {
      // Try using the Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(invite.inviteUrl);
      } else {
        // Fallback for browsers without Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = invite.inviteUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      toast.success('Invite link copied to clipboard!');
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy invite link');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Share Invite Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!invite) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Invite Link</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={invite.inviteUrl}
            readOnly
            className="font-mono text-sm"
          />
          <Button
            onClick={handleCopy}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Share this link with others to invite them to join your club
        </p>
      </CardContent>
    </Card>
  );
}
