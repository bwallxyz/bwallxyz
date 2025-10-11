# Deployment Guide

This guide will help you deploy your blog to Vercel with Supabase integration.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Supabase](https://supabase.com) account
3. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name your project
   - Set a secure database password (save this!)
   - Choose a region close to your users
4. Wait for the project to be created

### 1.2 Create Database Tables

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy the contents of `supabase/schema.sql` from this repository
3. Paste it into the SQL Editor and click "Run"
4. Verify that the tables were created by going to the "Table Editor"

### 1.3 Get Your Supabase Credentials

1. Go to Project Settings > API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys" - the `anon` `public` key)

## Step 2: Deploy to Vercel

### 2.1 Connect Your Repository

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Select the repository containing your blog code

### 2.2 Configure Build Settings

Vercel should auto-detect Next.js. If not, configure:
- **Framework Preset:** Next.js
- **Root Directory:** `blog` (if your Next.js app is in the blog folder)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### 2.3 Set Environment Variables

In the "Environment Variables" section, add the following:

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | From Step 1.3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | From Step 1.3 |
| `NEXTAUTH_SECRET` | A random secret string | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your deployment URL | Use `https://your-app.vercel.app` or your custom domain |

**Note:** For `NEXTAUTH_SECRET`, generate a secure random string:
```bash
openssl rand -base64 32
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-app.vercel.app`

## Step 3: Integrate Vercel with Supabase (Optional)

For easier management, you can integrate Vercel with Supabase:

1. In Vercel, go to your project settings
2. Go to "Integrations"
3. Search for "Supabase" and click "Add Integration"
4. Follow the prompts to connect your Supabase project
5. This will automatically sync your environment variables

## Step 4: Create Your First Admin User

After deployment:

1. Visit your deployed site
2. Go to `/auth/register`
3. Register your first user - **this will automatically be an admin user**
4. Subsequent registrations will be regular users

## Step 5: Set Up Custom Domain (Optional)

1. In Vercel, go to your project settings
2. Go to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Update the `NEXTAUTH_URL` environment variable to use your custom domain

## Updating Your Deployment

Every time you push to your main branch, Vercel will automatically rebuild and deploy your app.

## Troubleshooting

### Build Fails

- Check the build logs in Vercel
- Ensure all environment variables are set correctly
- Verify your `package.json` dependencies are correct

### Database Connection Issues

- Verify your Supabase credentials are correct
- Check that the database tables were created successfully
- Ensure Row Level Security (RLS) policies are not blocking access

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches your deployment URL
- Check browser console for errors

### Can't Create Posts

- Verify you registered as the first user (should be admin)
- Check the browser console for API errors
- Verify Supabase tables have the correct schema

## Database Schema Updates

If you need to update your database schema:

1. Make changes to `supabase/schema.sql`
2. Run the updated SQL in the Supabase SQL Editor
3. Redeploy your Vercel app if needed

## Environment Variables Reference

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# NextAuth Configuration
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
```

## Security Notes

1. Never commit `.env` files to version control
2. Use different Supabase projects for development and production
3. Regularly rotate your `NEXTAUTH_SECRET`
4. Consider enabling Supabase Row Level Security (RLS) for additional security
5. Review and configure Supabase authentication settings as needed

## Next Steps

- Configure Row Level Security (RLS) policies in Supabase for enhanced security
- Set up automatic backups for your database
- Configure email templates in Supabase (if using Supabase Auth)
- Add monitoring and analytics
- Set up a staging environment

## Support

For issues:
- Vercel: [Vercel Documentation](https://vercel.com/docs)
- Supabase: [Supabase Documentation](https://supabase.com/docs)
- Next.js: [Next.js Documentation](https://nextjs.org/docs)
