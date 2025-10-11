```
techblog/
├── components/            # Reusable UI components
├── pages/                 # Routes and API endpoints
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── wiki/              # Wiki pages
│   └── admin/             # Admin dashboard
├── lib/                   # Utility functions
├── models/                # Data models
├── public/                # Static assets
├── styles/                # Global styles
└── middleware.js          # Auth middleware
```

## Features

- **Blog System**: Create, edit, and publish technical blog posts
- **Wiki System**: Maintain a knowledge base with categorized wiki articles
- **Authentication**: Secure login for content management
- **Markdown Support**: Write content in Markdown with code syntax highlighting
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Admin Dashboard**: Manage all content from a central interface

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: NextAuth.js
- **Content**: MDX for Markdown with components
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## Getting Started

### Local Development

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd bwallxyz/blog
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

- Create a free account at [Supabase](https://supabase.com)
- Create a new project
- Run the SQL schema from `supabase/schema.sql` in the Supabase SQL Editor

4. **Configure environment variables**

Create a `.env.local` file in the `blog` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

5. **Start the development server**

```bash
npm run dev