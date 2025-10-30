"use server"

/**
 * Supabase-based DB initialization removed.
 * This project uses a Node/Mongo backend; the Supabase service-role SQL flow
 * is not applicable. Keep this action as a harmless stub that returns an
 * explanatory result for the UI.
 */

export async function initializeDatabase() {
  return {
    success: false,
    message:
      "Supabase initialization not applicable. This project uses a Node/Mongo backend — run backend migration scripts or contact the project maintainer.",
  }
}
