# Supabase Integration Setup Guide

This guide will help you set up Supabase for the AI PM Interview Prep application.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or log in
4. Click "New Project"
5. Fill in the project details:
   - **Name**: Your project name (e.g., "ai-pm-interview-prep")
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose a region close to you
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Copy the `.env.local` file in your project root
2. Replace the placeholder values with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit your `.env.local` file to version control!

## Step 4: Create the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase-schema.sql` from the project root
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema creation

This will create the `interviews` table with the following structure:
- `id`: UUID (primary key)
- `user_id`: UUID (references the authenticated user)
- `cv_text`: TEXT (extracted CV content)
- `interview_type`: VARCHAR (Product Design, RCA, or Strategy)
- `status`: VARCHAR (pending or completed)
- `transcript`: JSONB (interview conversation data)
- `created_at`: TIMESTAMP (auto-generated)
- `updated_at`: TIMESTAMP (auto-updated)

The schema also includes:
- Row Level Security (RLS) policies to ensure users can only access their own interviews
- Indexes for optimal query performance
- Automatic timestamp updates

## Step 5: Optional: Set Up Authentication

The current implementation uses a dummy `user_id` for testing. To enable proper authentication:

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable your preferred providers (Email, Google, GitHub, etc.)
3. Update the API route to use the authenticated user's ID:

```typescript
// In app/api/interviews/route.ts
const { data: { user } } = await supabase.auth.getUser();
const userId = user?.id;
```

## Step 6: Test the Integration

1. Restart your development server: `npm run dev`
2. Navigate to `/setup` in your application
3. Upload a PDF CV
4. Verify that:
   - The PDF text is extracted correctly
   - You can review and edit the extracted text
   - You can configure the interview type and domain
   - The data is saved to Supabase when you click "Confirm & Start Interview"

## Step 7: Verify Data in Supabase

1. Go to your Supabase dashboard
2. Click **Table Editor**
3. Select the `interviews` table
4. You should see the interview record you just created

## Troubleshooting

### "Failed to create interview" error
- Check that your Supabase URL and anon key are correct in `.env.local`
- Verify the database schema was created successfully
- Check the browser console for detailed error messages

### PDF parsing fails
- Ensure the uploaded file is a valid PDF
- Check the server logs for any parsing errors
- The PDF size limit is 5MB by default

### RLS policy errors
- If you're not using authentication, the RLS policies might block inserts
- For testing, you can temporarily disable RLS in the Supabase dashboard
- Go to **Table Editor** → `interviews` → **Table Settings** → Disable RLS

## Security Notes

- The `anon` key is safe to use in client-side code as it's subject to RLS policies
- Never use the `service_role` key in client-side code
- Always enable RLS in production to prevent unauthorized access
- Store secrets using Supabase Edge Functions if you need server-side secrets

## Next Steps

- Implement user authentication
- Add interview transcript storage
- Create analytics queries to track interview history
- Add more CV parsing formats (DOCX, TXT, etc.)
