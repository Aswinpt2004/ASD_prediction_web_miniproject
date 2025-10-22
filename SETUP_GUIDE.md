# PREDICT-ASD Setup Guide

## Step 1: Add Environment Variables

Go to the **Vars** section in the left sidebar and add these environment variables:

**Variable Name:** `NEXT_PUBLIC_SUPABASE_URL`
**Value:** `https://imbswskzjnsvwkbwldfz.supabase.co`

**Variable Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltYnN3c2t6am5zdndrYndsZGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTQ0MzMsImV4cCI6MjA3NjEzMDQzM30.V3iqiI3hYv3Zj8QKeCjyTNCqL3Y-Ji4fa5jkZ4r07Ho`

## Step 2: Run Database Setup Scripts

Execute the SQL scripts in your Supabase SQL Editor in this order:

1. **scripts/01-create-tables.sql** - Creates all database tables (user_profiles, children, assessments, uploads, reports, chat_messages)
2. **scripts/02-enable-rls.sql** - Enables Row Level Security with comprehensive access policies
3. **scripts/03-create-storage.sql** - Sets up file storage bucket for audio/video uploads

To run the scripts:
- Go to your Supabase project dashboard
- Navigate to the SQL Editor
- Copy and paste each script and execute them in order

## Step 3: Refresh and Test

1. Refresh your browser (Ctrl+R or Cmd+R)
2. Navigate to the login page
3. Click "Register" to create a new account
4. Select your role (Caretaker, Doctor, or Admin)
5. Start using the application!

## Database Schema

### Tables Created:
- **user_profiles** - User information with roles (caretaker, doctor, admin)
- **children** - Child records linked to caretakers
- **assessments** - Questionnaire responses (M-CHAT, SCQ, TABC) with scores
- **uploads** - Audio/video file uploads with metadata
- **reports** - Doctor diagnostic reports and recommendations
- **chat_messages** - Real-time chat messages between users

### Security Features:
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Doctors can view children they have reports for
- Admins have elevated access to view all data
- All file uploads are encrypted and secure

## Features Available

### For Caretakers:
- Register children
- Complete screening questionnaires (M-CHAT, SCQ, TABC)
- Upload audio/video samples
- View diagnostic reports from doctors
- Chat with assigned doctors

### For Doctors:
- Search and view children's assessments
- View uploaded media samples
- Write and upload diagnostic reports
- Chat with caretakers
- Track assessment history

### For Admins:
- Manage all users
- View system analytics
- Monitor assessments and reports
- Configure system settings
- Ensure HIPAA compliance

## Troubleshooting

**Issue:** "Supabase is not configured" message
- **Solution:** Make sure you've added both environment variables in the Vars section and refreshed the page

**Issue:** Can't create an account
- **Solution:** Make sure the database scripts have been executed in Supabase SQL Editor

**Issue:** Can't upload files
- **Solution:** Verify that script 03-create-storage.sql has been executed to set up the storage bucket

## Support

For more information about Supabase, visit: https://supabase.com/docs
