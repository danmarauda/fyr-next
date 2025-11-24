'use client';

import React, { FC, ReactNode } from 'react';

interface AuthProviderProps {
	children: ReactNode;
}
const BetterAuthProvider: FC<AuthProviderProps> = ({ children }) => {
	return <>{children}</>;
};

export default BetterAuthProvider;
