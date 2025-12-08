
## Page 1

SOFTWARE REQUIREMENTS DOCUMENT

Project Title: EagleConnect: Student Club Discovery & Membership Platform
Version: 1.0
Date: 11/23/25
Prepared by: The Fikr Five - CSC430 Software Engineering, College of Staten Island

---


## Page 2

# TABLE OF CONTENTS

**SOFTWARE REQUIREMENTS DOCUMENT**.................................................................................................................. 1

1.1 Modification History........................................................................................................................................... 4
1.2 Intended Audience............................................................................................................................................... 4
2. Introduction............................................................................................................................................................ 4
   2.1 Purpose of the Requirements Document........................................................................................................ 4
   2.2 Scope of the Product......................................................................................................................................... 5
   2.3 References......................................................................................................................................................... 5
   2.4 Overview of the Remainder of the Document.................................................................................................. 5
3. Glossary.................................................................................................................................................................. 6
4. User Requirement Definition............................................................................................................................... 6
5. System Requirements Specification..................................................................................................................... 7
   5.1 Functional Requirements.................................................................................................................................. 7
   5.2 Non-Functional Requirements......................................................................................................................... 9
6. System Architecture.............................................................................................................................................. 10
7. System Models...................................................................................................................................................... 10
   7.1 Use Case Diagram............................................................................................................................................ 10
   7.2 Sequence Diagram............................................................................................................................................ 12
8. System Evolution.................................................................................................................................................. 15

---


## Page 3

FIGURE TABLE OF CONTENTS

FIGURES

Figure 1: Use Case Diagram .................................................................&lt;page_number&gt;11&lt;/page_number&gt;
Figure 2: Sequence Diagram .................................................................&lt;page_number&gt;12&lt;/page_number&gt;
Figure 3: Class Diagram ..........................................................................&lt;page_number&gt;14&lt;/page_number&gt;

---


## Page 4

# 1. Preface

This document defines the software requirements for the EagleConnect system. It is intended to capture the services, constraints, and behavior of the system in a way that can be understood by both customers and developers.

## 1.1 Modification History

<table>
<thead>
<tr>
<th>Date</th>
<th>Version</th>
<th>Author</th>
<th>Summary of Changes</th>
</tr>
</thead>
<tbody>
<tr>
<td>11/23/2025</td>
<td>1.0</td>
<td>The Fikr Five</td>
<td>Initial and final version of Software Requirements Document</td>
</tr>
</tbody>
</table>

## 1.2 Intended Audience

This document is intended for:

*   Club coordinators.
*   Student-body and those interested in joining clubs.
*   University faculty and upper management.

---

## 2. Introduction

EagleConnect is a web application that enables students to discover and join campus clubs more easily. Currently, club information is scattered and difficult to search. EagleConnect centralizes club data into one system where students can browse clubs, filter by category, join, and track their memberships.

The system will:

*   Integrate with a database storing clubs, students, memberships, and events.
*   Support future features such as club admins, event management, notifications, chat rooms, and club reviews.
*   Provide a responsive, mobile-friendly UI.

## 2.1 Purpose of the Requirements Document

---


## Page 5

The purpose of this document is to:

*   Specify the **user requirements** and **system requirements** for EagleConnect.
*   Serve as a contract between the development team and stakeholders about what the system will do.
*   Provide a reference for design, implementation, and testing.

### 2.2 Scope of the Product

EagleConnect covers:

*   Student-facing features: registration, login, browsing clubs, filtering, joining clubs, seeing "My Clubs", viewing club details, and (later) events/RSVP, chat, reviews.
*   Admin features: creating clubs, approving/deactivating clubs, managing club information, membership requests, and events.
*   Non-functional requirements: performance, security, usability, and mobile responsiveness.

Systems out of scope include full university SSO integration (planned evolution), non-web clients, and integration with other campus systems beyond authentication.

### 2.3 References

*   Lab 3 - EagleConnect Requirements, UML Diagrams, and GUI Prototypes.
*   CSC 430 course materials on Software Requirements and Design.

### 2.4 Overview of the Remainder of the Document

Sections 3-5 define requirements and architecture; Sections 6-7 describe system models (use case, sequence, class diagrams); Section 8 discusses system evolution; Sections 9-10 provide appendices and index notes.

---


## Page 6

# 3. Glossary

<table>
  <thead>
    <tr>
      <th>Term</th>
      <th>Meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Student</td>
      <td>Any user enrolled at the university using EagleConnect to find clubs.</td>
    </tr>
    <tr>
      <td>Club</td>
      <td>A student organization registered with the university.</td>
    </tr>
    <tr>
      <td>Club Admin</td>
      <td>A student with special permissions to manage a specific club.</td>
    </tr>
    <tr>
      <td>University Admin</td>
      <td>Staff member responsible for approving clubs and categories.</td>
    </tr>
    <tr>
      <td>Membership</td>
      <td>Relationship between a student and a club; may be pending or active.</td>
    </tr>
    <tr>
      <td>Event</td>
      <td>Meeting or activity created by a club.</td>
    </tr>
    <tr>
      <td>RSVP</td>
      <td>A student's indication that they plan to attend an event.</td>
    </tr>
    <tr>
      <td>MVP</td>
      <td>Minimum Viable Product (initial 1st release).</td>
    </tr>
    <tr>
      <td>Supabase</td>
      <td>Hosted platform providing PostgreSQL and auth used by the project.</td>
    </tr>
  </tbody>
</table>

---

# 4. User Requirement Definition

User requirements are expressed from the perspective of users and stakeholders:

## Student Requirements

*   UR-01: As a student, I want to search for clubs so I can find ones that interest me.
*   UR-02: As a student, I want to filter clubs by category (e.g., Academic, Sport, Technology).
*   UR-03: As a student, I want to view a club's page to learn about it.
*   UR-04: As a student, I want to join a club with a single click.
*   UR-05: As a student, I want to see a list of all my clubs.
*   UR-06: As a student, I want to be notified about events from clubs I've joined.

---


## Page 7

*   UR-14: As a student, I want the system to work well on my phone.
*   UR-15: As a student, I want the system to be easy to use.

## Club Admin Requirements

*   UR-07: As a Club Admin, I want to edit my club's profile page.
*   UR-08: As a Club Admin, I want to approve or deny membership requests.
*   UR-09: As a Club Admin, I want to create new events.
*   UR-10: As a Club Admin, I want to see who is coming to my event.

## University Admin Requirements

*   UR-11: As a University Admin, I want to approve new clubs and manage categories.

## Non-Functional Requirements

*   UR-12: The system needs to be fast and responsive.
*   UR-13: The system must be secure and protect student data.

---

## 5. System Requirements Specification

System requirements translate user requirements into functional (F) and non-functional (NF) specifications.

### 5.1 Functional Requirements

#### FR1. User Registration and Login

*   The system shall allow students to register using an email and password.
*   The system shall authenticate registered users and create a session for them.

#### FR2. Browse and Filter Clubs

---


## Page 8

* The system shall display a list of clubs retrieved from the database.
* The system shall allow filtering by category (Technology, Arts, Academic, Sports, Cultural, Professional, Social, etc.).

**FR3. Search Clubs**
* The system shall provide a search interface to query club names and descriptions by keywords.

**FR4. View Club Details**
* The system shall display a dedicated page for each club including name, description, category, cover image, and event list.

**FR5. Join Club / Manage Membership**
* The system shall allow authenticated students to join a club with a single click.
* The system shall create a membership record linking the student and the club.
* The system shall show appropriate status (e.g., Joined, Pending).

**FR6. View My Clubs**
* The system shall provide a page showing all clubs a student is a member of.

**FR7. Events and RSVP (Future Releases)**
* The system shall allow club admins to create, edit, and delete events for their club.
* The system shall allow students to RSVP to events and display RSVP counts.

**FR8. Admin Capabilities (Future Releases)**
* The system shall allow University Admins to create, approve, deactivate clubs and manage categories.

---


## Page 9

* The system shall allow Club Admins to edit club profiles, manage membership requests, and moderate chats and reviews.

## FR9. Club Chat and Reviews (Future Releases)
* The system shall provide a chat room per club for member communication.
* The system shall allow members to submit ratings and reviews visible on the club detail page.

## 5.2 Non-Functional Requirements

### NFR1. Performance
* 95% of page loads should complete within 2 seconds under expected campus load.
* Database queries for club lists and membership lists should return within 500 ms.

### NFR2. Security
* All traffic between client and server must be encrypted using HTTPS.
* Authentication tokens must be stored securely and validated on each protected request.
* In future iterations, the system should support university SSO.

### NFR3. Usability
* A new user should be able to find and join at least one club in 3 clicks or less from the home screen.
* UI should be consistent and easy to navigate.

### NFR4. Portability / Compatibility
* The system shall support modern versions of Chrome, Edge, Firefox, and Safari.
* The layout shall be responsive on desktop, tablet, and mobile devices.

---


## Page 10

6. **System Architecture**

EagleConnect uses a 3-layer architecture:

*   **Presentation Layer:** Next.js React components, pages, and UI logic.
*   **Application Layer:** Next.js API routes implementing services for authentication, clubs, memberships, events, and admin functions.
*   **Data Layer:** Supabase/PostgreSQL database with tables for students, clubs, memberships, events, chats, reviews, and admins.

Architectural components from Lab 3 (such as controllers and database objects) are reused conceptually; in the actual implementation they map to services and repositories in the Next.js backend.

---

7. **System Models**

**7.1 Use Case Diagram**

The conceptual use case diagram includes:

*   Actors: Student, Club Admin, University Admin.
*   Student use cases: Search/Filter Clubs, View Club Page, Join Club, View My Clubs, View Events, RSVP.
*   Club Admin use cases: All student use cases plus Manage Club Page, Manage Members, Create Event, Send Notification.
*   University Admin use cases: Approve New Club, Deactivate Club, Manage Categories.

