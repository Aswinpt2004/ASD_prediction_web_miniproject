# Supabase Setup Guide for PREDICT-ASD

## Overview
This guide walks you through setting up the Supabase database for the PREDICT-ASD autism screening application.

## Environment Variables

Your Supabase credentials have been configured in `.env.local.example`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://imbswskzjnsvwkbwldfz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltYnN3c2t6am5zdndrYndsZGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTQ0MzMsImV4cCI6MjA3NjEzMDQzM30.V3iqiI3hYv3Zj8QKeCjyTNCqL3Y-Ji4fa5jkZ4r07Ho
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/login
\`\`\`

## Database Setup

The application requires three SQL scripts to be executed in order:

### Step 1: Create Tables
Run `scripts/01-create-tables.sql` in your Supabase SQL Editor to create:
- `user_profiles` - User account information
- `children` - Child records linked to caretakers
- `assessments` - Questionnaire responses and scores
- `uploads` - Audio/video file metadata
- `reports` - Doctor diagnostic reports
- `chat_messages` - Real-time chat messages

### Step 2: Enable Row Level Security
Run `scripts/02-enable-rls.sql` to enable RLS policies:
- Users can only access their own data
- Doctors can view children they have reports for
- Admins have elevated access
- All data is protected at the database level

### Step 3: Create Storage Bucket
Run `scripts/03-create-storage.sql` to set up:
- `media` storage bucket for audio/video uploads
- Storage policies for secure file access

## Features Enabled

### Authentication
- Email/password registration and login via Supabase Auth
- Automatic user profile creation on signup
- Role-based access control (caretaker, doctor, admin)

### Data Storage
- User profiles with contact information
- Child records with medical history
- Assessment responses with automatic scoring
- Diagnostic reports from doctors
- Real-time chat messages

### File Storage
- Audio and video uploads to Supabase Storage
- Organized by user ID and child ID
- Secure access with RLS policies
- Automatic file deletion when records are removed

## API Services

The application includes pre-configured services:

### Authentication Service (`lib/auth-service.ts`)
- `register()` - Create new user account
- `login()` - Authenticate user
- `logout()` - Sign out user
- `getUser()` - Get current user info
- `isAuthenticated()` - Check auth status

### Upload Service (`lib/upload-service.ts`)
- `uploadMedia()` - Upload audio/video files
- `getUploads()` - Retrieve child's uploads
- `deleteUpload()` - Remove upload
- `getDownloadUrl()` - Get public file URL

## Running the Application

1. Copy `.env.local.example` to `.env.local`
2. Run the SQL scripts in Supabase SQL Editor (in order)
3. Start the development server: `npm run dev`
4. Visit `http://localhost:3000`

## Troubleshooting

### "Table does not exist" error
- Ensure all three SQL scripts have been executed in order
- Check that you're using the correct Supabase project

### "Permission denied" error
- Verify RLS policies are enabled (script 2)
- Check that the user is authenticated
- Ensure the user has the correct role

### File upload fails
- Verify the `media` storage bucket exists (script 3)
- Check that storage policies are enabled
- Ensure the user is authenticated

## Security Notes

- All data is protected by Row Level Security policies
- Users can only access their own information
- Passwords are hashed by Supabase Auth
- API keys are public (anon key) - never expose service role key
- Files are organized by user ID for isolation
