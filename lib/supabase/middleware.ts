import { type NextRequest, NextResponse } from "next/server"

/**
 * Previously the project used Supabase middleware to sync session cookies server-side.
 * This project uses a Node/Mongo backend and client-side JWTs (stored in localStorage),
 * so server-side Supabase session handling is not applicable.
 *
 * For now, make this middleware a no-op that allows requests to continue.
 * If you want server-side route protection, call your backend authentication
 * endpoint here (for example, validate a bearer token cookie or header).
 */
export async function updateSession(request: NextRequest) {
  return NextResponse.next()
}
