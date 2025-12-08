## Page 1

# SOFTWARE SYSTEM DESIGN SPECIFICATION

**Project:** EagleConnect: Student Club Discovery & Membership Platform  
**Date:** 11/23/25  
**Version:** 1.0  
**Course:** CSC 430

---


## Page 2

# TABLE OF CONTENTS

**SOFTWARE SYSTEM DESIGN SPECIFICATION** .................................................................................................................. 1

1. Introduction................................................................................................................................................................. 3
2. Application Architecture........................................................................................................................................... 3
3. Required System Functions....................................................................................................................................... 4
   3.1 Student Functions................................................................................................................................................ 4
   3.2 Admin Functions (Planned).................................................................................................................................... 6
4. User Interface............................................................................................................................................................. 7
5. System Components.................................................................................................................................................. 9
6. Database...................................................................................................................................................................... 10
7. Required Software and Hardware.......................................................................................................................... 11

---


## Page 3

# 1. Introduction

EagleConnect is a web application that helps students discover, join, and manage campus clubs. The system centralizes club information (descriptions, categories, membership) and provides an easy way for students to browse clubs, filter by interests, and track their memberships.

The design approach follows a **layered, modular architecture**:

*   A **React/Next.js UI** for all student and admin interactions.
*   **API routes** that expose well-defined endpoints for authentication, clubs, memberships, and (later) events and admin operations.
*   A **Supabase/PostgreSQL database** that stores persistent data for students, clubs, memberships, events, chats, reviews, and notifications.
*   Clear separation between presentation (components), domain logic (services), and data access (repositories).

Design philosophy:

*   Start with a **thin but complete vertical slice** (MVP: register, login, browse clubs, join clubs, view "My Clubs").
*   Add features incrementally in Releases 2 and 3 (search, live stats, dedicated club pages, events, admin tools, chat, reviews) without breaking earlier layers.
*   Keep the UI responsive and simple so students can find and join clubs in a few clicks.

---

# 2. Application Architecture

EagleConnect uses a web-based, client-server architecture.

## Major Components and Structures

*   **Client (Browser)**
    *   Next.js React UI rendered on the client and partially on the server.

---


## Page 4

*   Uses React Query for data fetching and caching, and a custom AuthContext for session state.

*   **Application Server (Next.js)**
    *   API Routes under /api/* handle HTTP requests from the UI.
    *   **Services layer** implements business logic (AuthService, ClubService, StudentService, NotificationService (future), AdminService (future)).
    *   **Repository layer** encapsulates all Supabase/PostgreSQL data operations using a Supabase server client.

*   **Database (Supabase/PostgreSQL)**
    *   Core tables: students, clubs, club_memberships, and planned tables events, event_rsvps, club_chats, club_reviews, notifications, admins.
    *   Enforces referential integrity (foreign keys from memberships/events to students and clubs).

**Major Technologies**

*   Frontend: Next.js, React, TypeScript, Tailwind CSS, React Query.
*   Backend: Next.js API routes, Node.js, TypeScript.
*   Database: Supabase/PostgreSQL.
*   Auth: Supabase-based email/password authentication (future upgrade to SSO).

---

## 3. Required System Functions

Below are the key system functions expressed in system terms (what the system does and how, at a high level).

### 3.1 Student Functions

1.  **User Registration**

---


## Page 5

*   System displays a registration form.
*   On submit, validates input, creates a **student** record, and issues an auth token.

2. **User Login / Logout**
    *   System prompts for credentials.
    *   Validates against stored records and returns a session token stored on the client.
    *   Logout clears the token and client-side state.

3. **Browse Clubs**
    *   System retrieves a paginated list of clubs from the database.
    *   Displays club cards with name, category, description, and member count.

4. **Filter Clubs by Category**
    *   System accepts a category filter from the UI.
    *   Applies filter on the list of clubs (via query parameters or client-side filtering).

5. **Search Clubs (Planned)**
    *   System accepts a search query string.
    *   Executes a database query against club name/keywords and returns matching clubs.

6. **View Club Details (Planned)**
    *   System retrieves full club details (description, events, reviews) by **clubId**.
    *   Renders a dedicated page **/clubs/[id]** with tabs: About, Events, Members, Chat, Reviews.

7. **Join Club**
    *   System verifies the user is authenticated.

---


## Page 6

*   On "Join Club" click, creates a **club_memberships** row (studentId, clubId, status = active or pending).
*   Updates UI button state (Joined / Member).

8.  **View My Clubs**
    *   System queries **club_memberships** for the logged-in student.
    *   Joins with **clubs** table and returns only clubs where the student is a member.
    *   Renders them on the /my-clubs page.

9.  **RSVP to Events (Planned)**
    *   System lets a student RSVP on an event page.
    *   Creates an **event_rsvps** record and updates attendee counts.

10. **Club Chat (Planned)**
    *   System displays messages for a club chat room.
    *   Students can send messages; system stores each message in **club_chats** with timestamp and sender.

11. **Club Reviews (Planned)**
    *   System lets members submit ratings/comments for a club.
    *   Stores reviews in **club_reviews** and displays them on the club detail page.

**3.2 Admin Functions (Planned)**

1.  **Create Club**
    *   University Admin uses an admin UI to submit new club information.
    *   System validates and inserts a new row in **clubs** with status (e.g., pending, approved).

2.  **Approve / Deactivate Clubs**

---


## Page 7

*   Admin views a queue/list of pending clubs.
*   System updates club status to approved or deactivated.

3.  **Manage Club Profile (Club Admin)**
    *   Club Admin can edit club description, cover image, links, and categories.
    *   System updates corresponding fields in **clubs**.

4.  **Manage Memberships (Club Admin)**
    *   Admin views membership requests; system changes status (pending → active/denied).

5.  **Manage Events (Club Admin)**
    *   Admin creates/edits events; system stores them in **events**.

6.  **Notifications (System)**
    *   When an event is created or updated, the system enqueues notifications to members (email or in-app).

---

## 4. User Interface

Students and admins interact with EagleConnect through a web UI.

### Main Student Use Cases / Screens

1.  **User Login / Register**
    *   Screen with email and password fields and buttons “Login” / “Register”.
    *   Steps:
        1.  Student enters credentials.
        2.  Presses “Login”; system validates and redirects to Home on success.

2.  **Home / Browse Clubs**

---


## Page 8

*   Top bar: EagleConnect logo, notifications icon, theme toggle, profile icon.
*   Hero section: Title “Discover Your Community”, search bar (future search), “Explore Clubs” button.
*   Stats cards: Active Clubs, Total Members, Upcoming Events, Your Clubs (currently static values).
*   Category filter buttons: All, Technology, Arts, Academic, Sports, Cultural, Professional, Social.
*   Club grid: cards showing club name, category badge, cover image, description, members, and “Join Club” button.

3. **My Clubs Page**
    *   Shows only clubs where the logged-in student is a member.
    *   Each card shows “Member” or “View Club” with join disabled.

4. **Club Detail Page (Planned)**
    *   Large cover image and full description.
    *   Tabs: About, Events, Members, Chat, Reviews.
    *   Join/Member button at the top right.

5. **Admin Dashboard (Planned)**
    *   University Admin: pending clubs, club list, category management.
    *   Club Admin: manage profile, members, events, chat moderation, reviews.

The UI is **responsive**, so layout stacks vertically on mobile screens and uses full grid layout on desktop.

---


## Page 9

# 5. System Components

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Function Description</th>
      <th>Input Data</th>
      <th>Output Data</th>
      <th>Dependencies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Web UI (Next.js React)</td>
      <td>Renders pages, handles user interactions, calls API routes via fetch/React Query.</td>
      <td>User actions (clicks, forms), auth token</td>
      <td>Rendered HTML/JS, API requests</td>
      <td>Browser, API routes, AuthContext</td>
    </tr>
    <tr>
      <td>AuthContext</td>
      <td>Manages client-side auth state (current student, token, loading).</td>
      <td>Auth token, login/register responses</td>
      <td><b>user</b>, <b>isAuthenticated</b>, helper methods</td>
      <td>Auth API routes</td>
    </tr>
    <tr>
      <td>Auth Service (server)</td>
      <td>Handles registration, login, token verification.</td>
      <td>Credentials, JWT</td>
      <td>Auth result, user profile, tokens</td>
      <td>StudentRepository, Supabase auth</td>
    </tr>
    <tr>
      <td>Club Service</td>
      <td>Encapsulates club-related business logic (get clubs, detail, create/update, etc.).</td>
      <td>Club queries, filters, IDs</td>
      <td>Club lists, single club, errors</td>
      <td>ClubRepository, MembershipRepository</td>
    </tr>
    <tr>
      <td>Student Service</td>
      <td>Handles student-centric operations (get memberships, profile data).</td>
      <td>studentId</td>
      <td>Membership lists, student info</td>
      <td>StudentRepository, MembershipRepository</td>
    </tr>
    <tr>
      <td>Membership Service</td>
      <td>Manages join/leave club operations.</td>
      <td>studentId, clubId</td>
      <td>Membership record status</td>
      <td>MembershipRepository, AuthService</td>
    </tr>
    <tr>
      <td>Admin Service (planned)</td>
      <td>Provides administration logic (approve</td>
      <td>Admin commands (approve,</td>
      <td>Updated club/admin data</td>
      <td>ClubRepository, AdminRepository</td>
    </tr>
  </tbody>
</table>

---


## Page 10

mermaid
classDiagram
    class Student {
        -email
        -studentId
        -passwordHash
        -firstName
        -lastName
        -createdAt
    }
    class Club {
        -clubId
        -name
        -description
        -category
        -coverPhotoUrl
        -status (pending/approved/deactivated)
        -createdAt
        -adminId (FK to students or admins)
    }
    class Membership {
        -membershipId
        -studentId
        -clubId
        -role (member/administrator)
        -createdAt
    }
    class Event {
        -eventId
        -title
        -description
        -date
        -location
        -clubId
        -createdAt
    }
    class Notification {
        -notificationId
        -message
        -type (event, membership, etc.)
        -recipientId
        -createdAt
    }
    class Admin {
        -adminId
        -studentId
        -clubId
        -role (admin)
        -createdAt
    }

    Student -- Club : belongsTo
    Student -- Membership : belongsToMany
    Club -- Membership : belongsToMany
    Club -- Event : hasMany
    Membership -- Student : belongsTo
    Membership -- Club : belongsTo
    Event -- Club : belongsTo
    Notification -- Student : sendsTo
    Admin -- Student : manages
    Admin -- Club : manages
```

6. Database

Core Tables (Current + Planned)

1. **students**
    *   `student_id` (PK, UUID)
    *   `email`, `password_hash` (or Supabase auth id), `first_name`, `last_name`, `created_at`.

2. **clubs**
    *   `club_id` (PK, UUID)
    *   `name`, `description`, `category`, `cover_photo_url`, `status` (pending/approved/deactivated), `created_at`, `admin_id` (FK to students or admins).

3. **club_memberships**
    *   `membership_id` (PK, UUID)

---


## Page 11

*   **club_id** (FK → clubs), **student_id** (FK → students)
*   **status** (active, pending, denied), **joined_at**.

4.  **events** (planned)
    *   **event_id** (PK, UUID)
    *   **club_id** (FK → clubs), **title**, **description**, **event_date**, **location**, **created_at**.

5.  **event_rsvps** (planned)
    *   **rsvp_id** (PK, UUID)
    *   **event_id** (FK → events), **student_id** (FK → students), **response** (going/maybe/not going).

6.  **club_chats** (planned)
    *   **message_id** (PK, UUID)
    *   **club_id** (FK), **student_id** (FK), **message_text**, **created_at**.

7.  **club_reviews** (planned)
    *   **review_id** (PK, UUID)
    *   **club_id** (FK), **student_id** (FK), **rating** (1-5), **comment**, **created_at**.

8.  **admins** (planned)
    *   **admin_id** (PK, UUID), **email**, **role**, **created_at**.

---

## 7. Required Software and Hardware

### Software

*   Node.js and npm/yarn.
*   Next.js (React + TypeScript).

---


## Page 12

* Supabase (PostgreSQL, hosted) or equivalent PostgreSQL database.

* Development tools: VS Code, Git.

* Modern web browsers (Chrome, Edge, Firefox, Safari).

**Hardware**

* Developer machines: any laptop/desktop capable of running Node.js and a browser.

* Server/hosting: cloud platform (e.g., Vercel + Supabase) or equivalent with minimal CPU/RAM adequate for small student traffic.