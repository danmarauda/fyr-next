'use client';

import React, { FC, ReactNode } from 'react';

interface BetterAuthProviderProps {
	children: ReactNode;
}

const BetterAuthProvider: FC<BetterAuthProviderProps> = ({ children }) => {
	return <>{children}</>;
};

export default BetterAuthProvider;
