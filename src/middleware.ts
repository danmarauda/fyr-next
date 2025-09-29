import { i18nRouter } from 'next-i18n-router';
import { NextRequest } from 'next/server';
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import i18nConfig from '../i18nConfig';

export function middleware(request: NextRequest) {
	// First run the AuthKit middleware
	const authResponse = authkitMiddleware()(request);
	if (authResponse) return authResponse;

	// Then apply i18n routing
	return i18nRouter(request, i18nConfig);
}

// only applies this middleware to files in the app directory
export const config = {
	matcher: '/((?!api|static|.*\\..*|_next).*)',
};
