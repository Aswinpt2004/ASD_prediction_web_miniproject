import { type NextRequest, NextResponse } from "next/server"

// This route previously checked Supabase database status. The project uses
// a Node/Mongo backend now, so return a helpful message instead of importing
// Supabase.

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      initialized: false,
      message:
        "Not applicable: this project uses Node/Mongo backend. Run backend migration scripts or contact the maintainer for DB setup instructions.",
    },
    { status: 400 },
  )
}

export async function GET(request: NextRequest) {
  return POST(request)
}
