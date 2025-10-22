"use server"

import { createClient } from "@supabase/supabase-js"

const SQL_SCRIPTS = {
  createTables: `
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('caretaker', 'doctor', 'admin')),
  phone TEXT,
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create children table
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caretaker_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  medical_history TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('M-CHAT', 'SCQ', 'TABC')),
  responses JSONB NOT NULL,
  score INTEGER,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL CHECK (file_type IN ('video', 'audio')),
  file_path TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  diagnosis TEXT,
  recommendations TEXT,
  follow_up_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_children_caretaker_id ON children(caretaker_id);
CREATE INDEX IF NOT EXISTS idx_assessments_child_id ON assessments(child_id);
CREATE INDEX IF NOT EXISTS idx_uploads_child_id ON uploads(child_id);
CREATE INDEX IF NOT EXISTS idx_reports_child_id ON reports(child_id);
CREATE INDEX IF NOT EXISTS idx_reports_doctor_id ON reports(doctor_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver_id ON chat_messages(receiver_id);
  `,
  enableRLS: `
-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Children policies
CREATE POLICY IF NOT EXISTS "Caretakers can view their children" ON children
  FOR SELECT USING (auth.uid() = caretaker_id);

CREATE POLICY IF NOT EXISTS "Caretakers can insert their children" ON children
  FOR INSERT WITH CHECK (auth.uid() = caretaker_id);

CREATE POLICY IF NOT EXISTS "Doctors can view children they have reports for" ON children
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reports WHERE reports.child_id = children.id AND reports.doctor_id = auth.uid()
    )
  );

-- Assessments policies
CREATE POLICY IF NOT EXISTS "Users can view assessments for their children" ON assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = assessments.child_id AND children.caretaker_id = auth.uid()
    )
  );

-- Uploads policies
CREATE POLICY IF NOT EXISTS "Users can view uploads for their children" ON uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = uploads.child_id AND children.caretaker_id = auth.uid()
    )
  );

-- Reports policies
CREATE POLICY IF NOT EXISTS "Doctors can view their reports" ON reports
  FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY IF NOT EXISTS "Caretakers can view reports for their children" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children WHERE children.id = reports.child_id AND children.caretaker_id = auth.uid()
    )
  );

-- Chat messages policies
CREATE POLICY IF NOT EXISTS "Users can view their messages" ON chat_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY IF NOT EXISTS "Users can insert messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
  `,
}

export async function initializeDatabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        success: false,
        message: "Missing Supabase credentials",
      }
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check if user_profiles table exists
    const { error } = await adminClient.from("user_profiles").select("id").limit(1)

    if (error?.message?.includes("Could not find the table")) {
      console.log("[v0] Database not initialized. Please run SQL scripts in Supabase SQL Editor.")
      return {
        success: false,
        message:
          "Database not initialized. Please run the SQL scripts from scripts/ folder in your Supabase SQL Editor.",
      }
    }

    console.log("[v0] Database is initialized")
    return { success: true, message: "Database is ready" }
  } catch (error) {
    console.error("[v0] Database check failed:", error)
    return {
      success: false,
      message: `Database check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
