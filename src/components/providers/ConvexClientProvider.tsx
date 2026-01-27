'use client';

import React from 'react';
import type { ReactNode } from 'react';

// Mock provider for testing without Convex/better-auth
export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
	return <>{children}</>;
};
