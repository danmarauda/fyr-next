# Environment Variables Setup Guide

## Required Variables for Authentication

The authentication system requires these environment variables to be set:

### Server-side Variables

```bash
# Convex Backend
CONVEX_URL=your_convex_deployment_url

# Better Auth Configuration
BETTER_AUTH_SECRET=your_random_secret_key
BETTER_AUTH_URL=http://localhost:3000/api/auth

# OAuth Providers (Optional but recommended)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

### Client-side Variables

```bash
# Public URLs
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Setup Steps

### 1. Convex Setup

```bash
# Deploy Convex backend
npx convex dev

# Get your Convex URL from the output
# Set CONVEX_URL and NEXT_PUBLIC_CONVEX_URL
```

### 2. Better Auth Secret

```bash
# Generate a secure secret
openssl rand -base64 32

# Set BETTER_AUTH_SECRET to this value
```

### 3. GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret

### 4. Google OAuth Setup

1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

## Development Environment File

Create `.env.development`:

```bash
CONVEX_URL=http://localhost:3210
BETTER_AUTH_SECRET=your_generated_secret_here
BETTER_AUTH_URL=http://localhost:3000/api/auth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_CONVEX_URL=http://localhost:3210
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Production Environment

For production, update values in your hosting provider's environment variables or `.env.production`.
