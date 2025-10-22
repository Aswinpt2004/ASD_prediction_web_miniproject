import { Client } from "pg"
import * as fs from "fs"
import * as path from "path"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set")
  process.exit(1)
}

async function initializeDatabase() {
  const client = new Client({
    connectionString,
  })

  try {
    await client.connect()
    console.log("[v0] Connected to PostgreSQL database")

    // Read and execute SQL scripts
    const scripts = ["01-create-tables.sql", "02-enable-rls.sql", "03-create-storage.sql"]

    for (const script of scripts) {
      const scriptPath = path.join(__dirname, script)
      const sql = fs.readFileSync(scriptPath, "utf-8")

      console.log(`[v0] Executing ${script}...`)
      await client.query(sql)
      console.log(`[v0] ✓ ${script} completed`)
    }

    console.log("[v0] ✓ Database initialization completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Database initialization failed:", error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

initializeDatabase()
