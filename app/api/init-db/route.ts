import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Supabase credentials not configured", initialized: false }, { status: 400 })
    }

    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase.from("user_profiles").select("id").limit(1)

    if (error && error.code === "PGRST204") {
      // Table doesn't exist
      return NextResponse.json(
        {
          error: "Database tables not initialized. Please run the SQL scripts in Supabase SQL Editor.",
          initialized: false,
          message: "Visit /setup for instructions on how to initialize the database.",
        },
        { status: 400 },
      )
    }

    if (error) {
      return NextResponse.json({ error: error.message, initialized: false }, { status: 400 })
    }

    // Database is initialized
    return NextResponse.json(
      {
        initialized: true,
        message: "Database is ready to use!",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Database check error:", error)
    return NextResponse.json(
      {
        error: "Failed to check database status",
        initialized: false,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  // Allow GET requests to check database status
  return POST(request)
}
