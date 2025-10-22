"use server"

import { createClient } from "@supabase/supabase-js"

export async function initializeDatabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        success: false,
        message:
          "Missing Supabase credentials. Please add SUPABASE_SUPABASE_SERVICE_ROLE_KEY to environment variables.",
      }
    }

    // Create admin client with service role key
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check if database is already initialized
    const { error: checkError } = await adminClient.from("user_profiles").select("id").limit(1)

    if (!checkError) {
      console.log("[v0] Database is already initialized")
      return {
        success: true,
        message: "Database is already initialized",
      }
    }

    // Database not initialized, attempt to create tables
    console.log("[v0] Attempting to initialize database...")

    // SQL scripts to execute
    const sqlScripts = [
      // Create tables
      `
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

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_children_caretaker_id ON children(caretaker_id);
CREATE INDEX IF NOT EXISTS idx_assessments_child_id ON assessments(child_id);
CREATE INDEX IF NOT EXISTS idx_uploads_child_id ON uploads(child_id);
CREATE INDEX IF NOT EXISTS idx_reports_child_id ON reports(child_id);
CREATE INDEX IF NOT EXISTS idx_reports_doctor_id ON reports(doctor_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver_id ON chat_messages(receiver_id);
      `,
    ]

    // Execute SQL scripts
    for (const sql of sqlScripts) {
      const { error } = await adminClient.rpc("exec", { sql })
      if (error) {
        console.log("[v0] Note: RPC exec not available, database may need manual setup")
        // RPC function doesn't exist, return helpful message
        return {
          success: false,
          message:
            "Database initialization requires manual setup. Please run the SQL scripts in Supabase SQL Editor. Visit /setup for instructions.",
        }
      }
    }

    console.log("[v0] Database initialized successfully")
    return {
      success: true,
      message: "Database initialized successfully",
    }
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    return {
      success: false,
      message: `Database initialization failed: ${error instanceof Error ? error.message : "Unknown error"}. Please run the SQL scripts manually in Supabase SQL Editor.`,
    }
  }
}
