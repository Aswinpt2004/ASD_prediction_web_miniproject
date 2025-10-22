# PREDICT-ASD Setup Instructions

## Step 1: Add Supabase Environment Variables

You need to add your Supabase credentials to the project environment variables.

### In the v0 Sidebar:
1. Click on **Vars** in the left sidebar
2. Add the following environment variables:

| Variable Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://imbswskzjnsvwkbwldfz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key (starts with `eyJ...`) |

### Where to find these values:
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy the **Project URL** and **Anon Key**

## Step 2: Run Database Setup Scripts

Once environment variables are set:

1. Go to your Supabase dashboard
2. Click **SQL Editor**
3. Run the following scripts in order:
   - `scripts/01-create-tables.sql` - Creates all database tables
   - `scripts/02-enable-rls.sql` - Enables Row Level Security
   - `scripts/03-create-storage.sql` - Sets up file storage

## Step 3: Start the Application

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` and you should be able to register and login!

## Troubleshooting

If you see "Missing Supabase environment variables" error:
- Make sure you've added both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vars section
- Refresh the preview after adding variables
- Check that the values are correct (no extra spaces or quotes)
