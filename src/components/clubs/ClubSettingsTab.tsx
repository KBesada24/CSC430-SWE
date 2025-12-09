'use client';

import { useForm } from 'react-hook-form';
import { useUpdateClub } from '@/lib/hooks/useClubs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClubDetails } from '@/types/api.types';
import { Loader2 } from 'lucide-react';

interface ClubSettingsTabProps {
  club: ClubDetails;
}

interface ClubSettingsFormData {
  name: string;
  description: string;
  category: string;
  coverPhotoUrl: string;
}

export default function ClubSettingsTab({ club }: ClubSettingsTabProps) {
  const { mutate: updateClub, isPending } = useUpdateClub();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClubSettingsFormData>({
    defaultValues: {
      name: club.name,
      description: club.description || '',
      category: club.category,
      coverPhotoUrl: club.coverPhotoUrl || '',
    },
  });

  const onSubmit = (data: ClubSettingsFormData) => {
    updateClub({
      id: club.clubId,
      data: {
        ...data,
        description: data.description || undefined,
        coverPhotoUrl: data.coverPhotoUrl || undefined,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Club Settings</CardTitle>
          <CardDescription>
            Update your club's profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Club Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Club name is required' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register('category', { required: 'Category is required' })}
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                {...register('description')}
                placeholder="Describe your club..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverPhotoUrl">Cover Photo URL</Label>
              <Input
                id="coverPhotoUrl"
                {...register('coverPhotoUrl')}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                Provide a direct link to an image for your club banner.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
