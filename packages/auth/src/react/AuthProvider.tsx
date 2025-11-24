'use client';

import React, { createContext, FC, ReactNode, useContext } from 'react';
import { authClient } from '../lib/auth-client';

const AuthContext = createContext<typeof authClient | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	return <AuthContext.Provider value={authClient}>{children}</AuthContext.Provider>;
};

export const useAuthClient = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuthClient must be used within an AuthProvider');
	}
	return context;
};
