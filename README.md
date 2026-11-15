# MOMENTO
### Every Picture Holds a Story.

A collaborative photo-sharing platform built to help people create shared albums, invite contributors, and preserve memories in one place.

## Project Links

- **Live Demo:** [Momento](https://stirring-moxie-d544bc.netlify.app)
- **Source Code:** [GitHub Repository](https://github.com/Vanshika-110/Photo-Sharing-Platform-main)

---

## Overview

Momento is a collaborative photo-sharing web application designed around the idea of shared digital memories.

The platform enables authenticated users to create albums, invite other users through unique invitation codes, and collaboratively upload and access photographs.

The application integrates a browser-based frontend with Supabase services for authentication, relational data management, and secure file storage. Database-level access control ensures that album data and uploaded photographs are accessible according to membership permissions.

## Core Capabilities

- **User Authentication:** Account registration, login, and session management through Supabase Authentication.
- **Album Management:** Create and manage individual photo albums.
- **Invitation System:** Generate unique invitation codes to share albums with other users.
- **Collaborative Access:** Allow multiple authenticated users to participate in shared albums.
- **Photo Uploads:** Upload photographs to album-specific storage locations.
- **Photo Retrieval:** Retrieve album photographs using secure, time-limited signed URLs.
- **Access Control:** Enforce membership-based permissions using PostgreSQL Row Level Security.
- **Private File Storage:** Store photographs in a private Supabase Storage bucket.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Additional Language | TypeScript |
| Backend Services | Supabase |
| Database | PostgreSQL |
| Database Programming | PL/pgSQL |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Database Security | Row Level Security (RLS) |
| Version Control | Git, GitHub |
| Deployment | Netlify |

## System Architecture

Momento follows a client-to-backend architecture in which the frontend communicates with Supabase services through the Supabase JavaScript client.

```text
              USER
                |
                v
       FRONTEND APPLICATION
          HTML / CSS / JS
                |
                v
        SUPABASE CLIENT
                |
       +--------+--------+
       |        |        |
       v        v        v
    AUTH     DATABASE   STORAGE
             PostgreSQL  Photos
       |        |        |
       +--------+--------+
                |
                v
       ACCESS CONTROL (RLS)
```

### Backend Components

**1. Authentication**

Supabase Authentication handles user registration, login, and authenticated sessions. User identity is used to enforce ownership and membership permissions.

**2. Relational Database**

PostgreSQL maintains relationships between albums, album members, and uploaded photographs.

**3. Storage Management**

Supabase Storage maintains uploaded image files in a private bucket named `momento-photos`. Album-specific storage paths help organize files and enforce access permissions.

**4. Database Security**

Row Level Security policies restrict database operations according to authenticated user identity, album ownership, and membership.

## Database Design

The application uses three primary relational tables.

### 1. albums

Stores album information and ownership details.

| Column | Description |
|---|---|
| id | Unique album identifier |
| title | Album title |
| description | Album description |
| owner_id | User who created the album |
| invite_code | Unique invitation code |
| created_at | Album creation timestamp |

### 2. album_members

Maintains the relationship between users and shared albums.

| Column | Description |
|---|---|
| album_id | Associated album identifier |
| user_id | Associated user identifier |
| role | Membership role |
| joined_at | Membership timestamp |

A composite primary key prevents duplicate membership records for the same user and album.

### 3. photos

Stores photograph metadata and references to files in Supabase Storage.

| Column | Description |
|---|---|
| id | Unique photo identifier |
| album_id | Associated album |
| uploader_id | User who uploaded the photo |
| storage_path | File location in storage |
| caption | Photo caption |
| created_at | Upload timestamp |

### Database Functions and Triggers

- An automatic database trigger adds the album creator as the album owner in `album_members`.
- The `is_album_member()` function checks whether the authenticated user belongs to a specified album.
- The `join_album()` function enables users to join albums using valid invitation codes.

## Security and Access Control

Security is implemented at the database and storage levels rather than relying solely on frontend restrictions.

- Row Level Security is enabled on the primary application tables.
- Album visibility is restricted to owners and authorized members.
- Album creation requires the authenticated user to be the specified owner.
- Album updates and deletion are restricted to the album owner.
- Photo uploads require authenticated album membership.
- Photo access is restricted to authorized album members.
- The `momento-photos` storage bucket is private.
- Signed URLs are used to provide controlled access to stored photographs.

## Application Structure

```text
Photo-Sharing-Platform-main/
│
├── index.html
├── signup.html
├── dashboard.html
├── create-album.html
├── album.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── supabase.js
│   ├── auth.js
│   ├── albums.js
│   └── photos.js
│
├── auth-test.html
├── test.html
│
└── README.md
```

## Getting Started

### Prerequisites

- A modern web browser
- Visual Studio Code
- Git
- A Supabase account
- Visual Studio Code Live Server extension

### 1. Clone the Repository

```bash
git clone https://github.com/Vanshika-110/Photo-Sharing-Platform-main.git
```

### 2. Navigate to the Project

```bash
cd Photo-Sharing-Platform-main
```

### 3. Configure Supabase

Create a Supabase project and obtain your:

- Project URL
- Publishable API Key

Configure these values in `js/supabase.js` using the Supabase JavaScript client.

Never expose a Supabase Secret Key or service role key in client-side code.

### 4. Configure Database and Storage

Set up the required PostgreSQL tables, database functions, triggers, and RLS policies.

Create the private Storage bucket:

```text
momento-photos
```

Configure the required storage policies for authenticated album members.

### 5. Run Locally

Open the project in Visual Studio Code and launch `index.html` using Live Server.

## Deployment

The application is deployed through Netlify.

**Production URL:**  
https://stirring-moxie-d544bc.netlify.app

## Contributors

### Vanshika-110

[GitHub Profile](https://github.com/Vanshika-110)

- Backend development and Supabase integration
- PostgreSQL database design and management
- Authentication and session handling
- Supabase Storage integration
- Row Level Security policies and database functions

### Oneshiikka

[GitHub Profile](https://github.com/oneshiikka)

- Frontend development
- User interface and website design
- Frontend structure and implementation

Both contributors collaborated on application integration, testing, and deployment.

## Future Enhancements

- Real-time synchronization of album updates
- Photo reactions and commenting
- Advanced album permissions
- Improved image optimization
- Enhanced mobile experience
- Additional collaboration features

---

## Project Information

**Project:** Momento  
**Category:** Full-Stack Web Application  
**Domain:** Collaborative Photo Sharing  
**Deployment:** Netlify  
**Database and Backend Services:** Supabase

---

*Momento — Every Picture Holds a Story.*
