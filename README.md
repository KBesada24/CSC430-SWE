# 🦅 EagleConnect

**Student Club Discovery & Membership Platform**

EagleConnect is a modern web application that enables students to discover, join, and manage campus clubs. It centralizes club information into one intuitive system where students can browse clubs, filter by category, join communities, and track their memberships.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)

---

## ✨ Features

### For Students

- **🔍 Browse & Search Clubs** - Discover clubs with real-time search and category filtering
- **📝 Join Clubs** - Request membership or join clubs instantly via invite links
- **👤 Profile Management** - View and manage your club memberships
- **💬 Club Chat** - Real-time messaging within club communities
- **📅 Events** - View and RSVP to upcoming club events
- **🔔 Notifications** - Stay updated on club activities and membership status

### For Club Admins

- **🏠 Club Management** - Create and manage club profiles with cover images
- **👥 Member Management** - Approve, reject, or remove members
- **📨 Invite Links** - Generate shareable invite links for your club
- **📊 Analytics** - View club statistics and member engagement

### For University Admins

- **✅ Club Approval** - Review and approve new club registrations
- **📈 Platform Stats** - Monitor platform-wide statistics
- **🛡️ Moderation** - Oversee all clubs and activities

---

## 🛠 Tech Stack

### Frontend

| Technology          | Purpose                           |
| ------------------- | --------------------------------- |
| **Next.js 14**      | React framework with App Router   |
| **TypeScript**      | Type-safe JavaScript              |
| **Tailwind CSS**    | Utility-first CSS framework       |
| **Radix UI**        | Accessible component primitives   |
| **React Query**     | Server state management & caching |
| **React Hook Form** | Form handling with Zod validation |
| **Lucide Icons**    | Beautiful icon library            |
| **Sonner**          | Toast notifications               |

### Backend

| Technology             | Purpose                              |
| ---------------------- | ------------------------------------ |
| **Next.js API Routes** | RESTful API endpoints                |
| **Supabase**           | PostgreSQL database & authentication |
| **JWT**                | Secure token-based authentication    |
| **Zod**                | Schema validation                    |
| **bcrypt**             | Password hashing                     |

### Infrastructure

| Technology   | Purpose                                       |
| ------------ | --------------------------------------------- |
| **Supabase** | Hosted PostgreSQL with real-time capabilities |
| **Vercel**   | Recommended hosting platform                  |

---

## 🏗 Architecture

EagleConnect follows a **3-tier layered architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │ Components  │  │   React Query       │  │
│  │  (Next.js)  │  │  (Radix UI) │  │   (Data Fetching)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ API Routes  │  │  Services   │  │    Middleware       │  │
│  │  (/api/*)   │  │  (Business  │  │  (Auth, Validation) │  │
│  │             │  │   Logic)    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │Repositories │  │  Supabase   │  │    PostgreSQL       │  │
│  │(Data Access)│  │   Client    │  │     Database        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

- **Repository Pattern** - Abstracts database operations
- **Service Layer** - Encapsulates business logic
- **Middleware Chain** - Auth, validation, and error handling
- **React Query** - Client-side caching and server state sync

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/eagleconnect.git
   cd eagleconnect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your Supabase credentials (see [Environment Variables](#-environment-variables))

4. **Run database migrations**

   ```bash
   # Apply migrations via Supabase dashboard or CLI
   npx supabase db push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Node Environment
NODE_ENV=development
```

### Where to find these values:

- **Supabase URL & Keys**: Supabase Dashboard → Settings → API
- **JWT Secret**: Generate a secure random string (64+ characters recommended)

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── admin/             # Admin dashboard
│   ├── api/               # API route handlers
│   │   ├── auth/          # Authentication endpoints
│   │   ├── clubs/         # Club CRUD & membership
│   │   ├── events/        # Event management
│   │   ├── notifications/ # Notification system
│   │   ├── stats/         # Analytics endpoints
│   │   └── students/      # Student profile
│   ├── clubs/             # Club pages ([id], create)
│   ├── events/            # Events listing
│   ├── invites/           # Invite link handling
│   └── profile/           # User profile
│
├── components/            # React components
│   ├── auth/              # Auth-related components
│   ├── clubs/             # Club cards, filters, chat
│   ├── dashboard/         # Stats cards
│   ├── events/            # Event cards
│   ├── layout/            # Header, navigation
│   ├── providers/         # Context providers
│   └── ui/                # Radix UI primitives
│
├── lib/                   # Core application logic
│   ├── api/               # API client & endpoint wrappers
│   ├── config/            # App configuration
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom React hooks
│   ├── middleware/        # API middleware (auth, validation)
│   ├── providers/         # Query providers
│   ├── repositories/      # Data access layer
│   ├── services/          # Business logic layer
│   ├── supabase/          # Supabase client setup
│   ├── utils/             # Utility functions
│   └── validators/        # Zod schemas
│
├── types/                 # TypeScript type definitions
│
└── supabase/
    └── migrations/        # Database migrations
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new student         |
| POST   | `/api/auth/login`    | Login and receive JWT token    |
| GET    | `/api/auth/me`       | Get current authenticated user |

### Clubs

| Method | Endpoint                              | Description                       |
| ------ | ------------------------------------- | --------------------------------- |
| GET    | `/api/clubs`                          | List clubs (with search & filter) |
| POST   | `/api/clubs`                          | Create a new club                 |
| GET    | `/api/clubs/[id]`                     | Get club details                  |
| PATCH  | `/api/clubs/[id]`                     | Update club info                  |
| DELETE | `/api/clubs/[id]`                     | Delete a club                     |
| GET    | `/api/clubs/[id]/members`             | List club members                 |
| POST   | `/api/clubs/[id]/members`             | Join a club                       |
| DELETE | `/api/clubs/[id]/members/[studentId]` | Leave/remove member               |
| GET    | `/api/clubs/[id]/messages`            | Get chat messages                 |
| POST   | `/api/clubs/[id]/messages`            | Send a message                    |
| GET    | `/api/clubs/[id]/invite`              | Get/generate invite link          |

### Events

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| GET    | `/api/events`           | List events       |
| POST   | `/api/events`           | Create an event   |
| GET    | `/api/events/[id]`      | Get event details |
| POST   | `/api/events/[id]/rsvp` | RSVP to an event  |

### Students

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| GET    | `/api/students/[id]/memberships` | Get student's clubs    |
| GET    | `/api/students/[id]/stats`       | Get student statistics |

### Admin

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| GET    | `/api/admin/clubs`      | List pending clubs       |
| PATCH  | `/api/admin/clubs/[id]` | Approve/reject club      |
| GET    | `/api/stats/platform`   | Platform-wide statistics |

### Notifications

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | `/api/notifications`      | Get user notifications |
| PATCH  | `/api/notifications/[id]` | Mark as read           |

---

## 🗄 Database Schema

### Core Tables

```sql
-- Students (Users)
students (
  student_id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  role VARCHAR DEFAULT 'student',
  created_at TIMESTAMP DEFAULT NOW()
)

-- Clubs
clubs (
  club_id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL,
  cover_photo_url VARCHAR,
  admin_student_id UUID REFERENCES students,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
)

-- Club Memberships
club_memberships (
  membership_id UUID PRIMARY KEY,
  club_id UUID REFERENCES clubs,
  student_id UUID REFERENCES students,
  status VARCHAR DEFAULT 'pending', -- pending, active, rejected
  role VARCHAR DEFAULT 'member',    -- member, admin
  joined_at TIMESTAMP DEFAULT NOW()
)

-- Events
events (
  event_id UUID PRIMARY KEY,
  club_id UUID REFERENCES clubs,
  title VARCHAR NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Messages (Club Chat)
messages (
  message_id UUID PRIMARY KEY,
  club_id UUID REFERENCES clubs,
  student_id UUID REFERENCES students,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Notifications
notifications (
  notification_id UUID PRIMARY KEY,
  student_id UUID REFERENCES students,
  type VARCHAR NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Club Invites
club_invites (
  invite_id UUID PRIMARY KEY,
  club_id UUID REFERENCES clubs,
  token VARCHAR UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform's dashboard.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for **CSC 430 - Software Engineering** at [Your University].

---

## 👥 Team

**The Fikr Five**

- [Team Member 1]
- [Team Member 2]
- [Team Member 3]
- [Team Member 4]
- [Team Member 5]

---

<p align="center">
  Made with ❤️ for students, by students
</p>
