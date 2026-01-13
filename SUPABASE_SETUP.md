# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Parisian Tour Guide website.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in the details:
   - **Name:** `parizs-tours` (or your choice)
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to your users (e.g., EU Central)
4. Click **"Create new project"** and wait ~2 minutes

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click **"Settings"** (gear icon)
2. Go to **"API"** section
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file (copy from `.env.local.example`)
2. Add your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

## Step 4: Run the Database Schema

1. In Supabase dashboard, go to **"SQL Editor"**
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql` from the project root
4. Paste it into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see: **"Success. No rows returned"** ✅

## Step 5: Create Your Admin User

1. In Supabase dashboard, go to **"Authentication"** → **"Users"**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email:** `viktoria@parizstours.com` (or your admin email)
   - **Password:** Choose a secure password
   - **Auto Confirm User:** ✅ Check this box
4. Click **"Create user"**

## Step 6: Configure Storage (Optional)

If you want to upload images via the admin panel:

1. Go to **"Storage"** in Supabase dashboard
2. The `tour-images` bucket should already be created by the SQL script
3. Verify policies are set correctly:
   - Public read access
   - Authenticated write access

## Step 7: Test Your Setup

1. Start your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Navigate to `http://localhost:3000/admin/login`

3. Login with your admin credentials

4. You should see the admin dashboard! 🎉

## Troubleshooting

### "Failed to fetch" or connection errors

- Double-check your `.env.local` file has correct values
- Make sure you restart your dev server after adding env vars

### "Row Level Security" errors

- Ensure you ran the entire `supabase-schema.sql` script
- The script creates RLS policies for public read access

### Can't login to admin

- Verify the user was created in Supabase → Authentication → Users
- Check that "Auto Confirm User" was enabled
- Try resetting the password

### No data showing on frontend

- Make sure the database schema was run successfully
- The script inserts default profile and tour data
- Check browser console for errors

## Next Steps

1. **Customize Content:** Go to `/admin/content` to update hero and about text
2. **Manage Tours:** Go to `/admin/tours` to add, edit, or delete tours
3. **Upload Images:** Use Supabase Storage to upload tour images
4. **Go Live:** When ready, deploy to Vercel/Netlify with your env vars

## Database Schema Overview

- **profile** - Stores hero, about, and contact information (single row)
- **tours** - Individual tour listings with pricing and details
- **gallery** - Gallery images with captions
- **Storage bucket: tour-images** - For tour and profile images

## Useful Supabase Features

- **Table Editor:** Visual interface to view/edit data
- **SQL Editor:** Run custom queries
- **Database:** View relationships, triggers, functions
- **Storage:** Manage uploaded files
- **Authentication:** Manage admin users

---

**Support:** If you encounter issues, check the [Supabase Documentation](https://supabase.com/docs) or file an issue in the project repo.
