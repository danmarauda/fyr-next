'use client';

import React, { FC, ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';

interface BetterAuthProviderProps {
	children: ReactNode;
}

const BetterAuthProvider: FC<BetterAuthProviderProps> = ({ children }) => {
	return <AuthProvider>{children}</AuthProvider>;
};

export default BetterAuthProvider;
