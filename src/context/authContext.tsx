'use client';

import React, { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authPages } from '@/config/pages.config';
import { authClient } from '@/lib/auth-client';

export interface IAuthContextProps {
	user: any;
	session: any;
	isLoading: boolean;
	isAuthenticated: boolean;
	onLogin: (email: string, password: string) => Promise<void>;
	onSocialLogin: (provider: 'google' | 'github') => Promise<void>;
	onLogout: () => void;
	onSignUp: (email: string, password: string, name?: string) => Promise<void>;
	error?: Error;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthProviderProps {
	children: ReactNode;
}
export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
	const { data: session, isPending, error } = authClient.useSession();
	const router = useRouter();

	const user = session?.user;
	const isAuthenticated = !!session;
	const isLoading = isPending;

	// Email/password login
	const onLogin = async (email: string, password: string) => {
		try {
			await authClient.signIn.email({
				email,
				password,
			});
			router.push('/');
		} catch (error) {
			console.error('Login failed:', error);
			throw error;
		}
	};

	// Social login
	const onSocialLogin = async (provider: 'google' | 'github') => {
		try {
			await authClient.signIn.social({
				provider,
			});
		} catch (error) {
			console.error(`${provider} login failed:`, error);
			throw error;
		}
	};

	// Sign up
	const onSignUp = async (email: string, password: string, name?: string) => {
		try {
			await authClient.signUp.email({
				email,
				password,
				name,
			});
			router.push('/');
		} catch (error) {
			console.error('Sign up failed:', error);
			throw error;
		}
	};

	// Logout
	const onLogout = async () => {
		try {
			await authClient.signOut();
			router.push(`${authPages.loginPage.to}`);
		} catch (error) {
			console.error('Logout failed:', error);
			throw error;
		}
	};

	const value: IAuthContextProps = useMemo(
		() => ({
			user,
			session,
			isLoading,
			isAuthenticated,
			onLogin,
			onSocialLogin,
			onLogout,
			onSignUp,
			error,
		}),
		[user, session, isLoading, isAuthenticated, error],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
