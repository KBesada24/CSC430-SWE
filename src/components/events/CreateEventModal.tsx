'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateEvent } from '@/lib/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, Plus } from 'lucide-react';

interface CreateEventModalProps {
  clubId: string;
}

interface EventFormData {
  title: string;
  eventDate: string;
  eventTime: string;
  location: string;
  description?: string;
}

export default function CreateEventModal({ clubId }: CreateEventModalProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createEvent, isPending } = useCreateEvent();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormData>();

  const onSubmit = (data: EventFormData) => {
    // Combine date and time into ISO string
    // Treat the input date/time as UTC to avoid timezone shifts
    // Appending 'Z' tells Date constructor to parse as UTC
    const eventDateObj = new Date(`${data.eventDate}T${data.eventTime}:00Z`);
    
    // Validate date
    if (isNaN(eventDateObj.getTime())) {
      toast.error('Invalid date or time selected');
      return;
    }

    const eventDateTime = eventDateObj.toISOString();
    
    createEvent(
      {
        title: data.title,
        eventDate: eventDateTime,
        location: data.location,
        description: data.description,
        clubId,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
          toast.success('Event created successfully');
        },
        onError: (error: any) => {
          console.error("Failed to create event:", error);
          toast.error(error.message || 'Failed to create event');
        }
      }
    );
  };

  // Get tomorrow's date as default minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create New Event
          </DialogTitle>
          <DialogDescription>
            Create a new event for your club members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                min={minDate}
                {...register('eventDate', { required: 'Date is required' })}
              />
              {errors.eventDate && (
                <p className="text-sm text-destructive">{errors.eventDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTime">Time</Label>
              <Input
                id="eventTime"
                type="time"
                {...register('eventTime', { required: 'Time is required' })}
              />
              {errors.eventTime && (
                <p className="text-sm text-destructive">{errors.eventTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter location"
              {...register('location', { required: 'Location is required' })}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter event description"
              rows={3}
              {...register('description')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
