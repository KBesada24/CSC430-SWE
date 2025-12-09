-- Create reviews table
create table public.reviews (
  review_id uuid not null default gen_random_uuid(),
  club_id uuid not null references public.clubs(club_id) on delete cascade,
  student_id uuid not null references public.students(student_id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone not null default now(),
  constraint reviews_pkey primary key (review_id)
);

-- Create messages table for club chat
create table public.messages (
  message_id uuid not null default gen_random_uuid(),
  club_id uuid not null references public.clubs(club_id) on delete cascade,
  student_id uuid not null references public.students(student_id) on delete cascade,
  content text not null,
  created_at timestamp with time zone not null default now(),
  constraint messages_pkey primary key (message_id)
);

-- Create notifications table
create table public.notifications (
  notification_id uuid not null default gen_random_uuid(),
  student_id uuid not null references public.students(student_id) on delete cascade,
  type text not null check (type in ('event_invite', 'membership_update', 'chat_mention')),
  title text not null,
  message text not null,
  read boolean not null default false,
  metadata jsonb,
  created_at timestamp with time zone not null default now(),
  constraint notifications_pkey primary key (notification_id)
);

-- Enable RLS
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Policies for reviews
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = student_id);

-- Policies for messages (simplified: any authenticated user for now, strictly should be club members)
create policy "Club members can view messages"
  on public.messages for select
  using (exists (
    select 1 from public.memberships
    where memberships.club_id = messages.club_id
    and memberships.student_id = auth.uid()
    and memberships.status = 'active'
  ));

create policy "Club members can insert messages"
  on public.messages for insert
  with check (exists (
    select 1 from public.memberships
    where memberships.club_id = messages.club_id
    and memberships.student_id = auth.uid()
    and memberships.status = 'active'
  ));

-- Policies for notifications
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = student_id);

create policy "Service role can create notifications"
  on public.notifications for insert
  with check (true); -- Usually restricted to service role or specific triggers

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;
