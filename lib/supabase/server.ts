// Supabase server helpers removed — this project uses Node/Mongo backend.
// Export a stubbed createClient to avoid importing @supabase on the server build.

export async function createClient() {
  // No server-side Supabase client available. If you need to perform server-side
  // auth or session validation, call your backend APIs directly (e.g. /api/auth/verify).
  return null
}
