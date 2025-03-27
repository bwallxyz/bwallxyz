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
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel (recommended)

## Getting Started

Follow the setup instructions below to get your blog and wiki platform up and running.

 Setting up your Next.js Blog & Wiki Platform

## 1. Create a new Next.js project

```bash
npx create-next-app@latest techblog
cd techblog
```

## 2. Install dependencies

```bash
npm install next-auth mongoose bcryptjs gray-matter remark remark-html @tailwindcss/typography date-fns next-mdx-remote swr
```

## 3. Set up Tailwind CSS (if not included by default)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 4. Create MongoDB Atlas cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and set up a cluster
3. Create a database user and get your connection string
4. Create a `.env.local` file in your project root with:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## 5. Start the development server

```bash
npm run dev