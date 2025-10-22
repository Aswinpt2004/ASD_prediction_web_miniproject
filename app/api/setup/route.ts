import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ initialized: false, message: "Supabase credentials not configured" }, { status: 400 })
    }

    // Check if user_profiles table exists by attempting a query
    const response = await fetch(`${supabaseUrl}/rest/v1/user_profiles?select=id&limit=1`, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    })

    if (response.status === 404) {
      return NextResponse.json(
        {
          initialized: false,
          message: "Database tables not found. Please run the SQL scripts in Supabase SQL Editor.",
        },
        { status: 200 },
      )
    }

    if (response.ok) {
      return NextResponse.json({ initialized: true, message: "Database is ready!" }, { status: 200 })
    }

    return NextResponse.json({ initialized: false, message: "Error checking database status" }, { status: 500 })
  } catch (error) {
    console.error("[v0] Setup check error:", error)
    return NextResponse.json({ initialized: false, message: "Error checking database status" }, { status: 500 })
  }
}
