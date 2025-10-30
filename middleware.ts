import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware no longer uses Supabase - this project uses Node/Mongo backend.
 * All authentication is handled via JWT tokens stored in localStorage.
 * This middleware is kept minimal to allow all requests through.
 * Add custom authentication logic here if needed (e.g., validate cookies).
 */
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
