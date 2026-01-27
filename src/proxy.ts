import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'es', 'ar', 'tr'];
const defaultLocale = 'en';

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Skip proxy for API routes, static files, etc.
	if (
		pathname.startsWith('/api') ||
		pathname.startsWith('/_next') ||
		pathname.startsWith('/static') ||
		pathname.includes('.')
	) {
		return;
	}

	// Check if pathname already includes a locale
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (pathnameHasLocale) {
		return;
	}

	// Redirect to default locale
	const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
	return NextResponse.redirect(newUrl);
}

// only applies this proxy to files in the app directory
export const config = {
	matcher: '/((?!api|static|.*\\..*|_next).*)',
};
