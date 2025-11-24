# Liveblocks Integration Setup

This project is configured to use Liveblocks through the Vercel Integration Marketplace.

## Setup Instructions

1. **Add Liveblocks Integration**:

    - Go to your Vercel dashboard
    - Navigate to your project settings
    - Go to "Integrations" tab
    - Search for "Liveblocks" and add it to your project

2. **Environment Variables**:
   The integration will automatically set up the required environment variables:

    - `LIVEBLOCKS_SECRET_KEY` - Your Liveblocks secret key

3. **Integration Features**:
    - Automatic package installation (@liveblocks/client, @liveblocks/react, @liveblocks/node)
    - API route for authentication at `/api/liveblocks-auth`
    - Configuration files for real-time collaboration

## Usage

Once the integration is added, you can use Liveblocks for real-time features:

```tsx
import { RoomProvider, useMyPresence, useOthers } from '@/liveblocks.config';

function CollaborativeComponent() {
	const others = useOthers();

	return <div>{others.length} other users online</div>;
}
```

## Current Implementation

The project board at `/project/board/[slug]` is ready to be enhanced with:

- Real-time presence indicators
- Collaborative task management
- Live updates across multiple users

## Next Steps

After adding the integration:

1. Update the authentication logic in `/api/liveblocks-auth/route.ts` to use your auth system
2. Add RoomProvider to components that need real-time features
3. Implement collaborative features like shared cursors, presence, etc.
