import { createAuth } from '@convex/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const auth = createAuth({} as any);
	return auth.handler(request);
}

export async function POST(request: NextRequest) {
	const auth = createAuth({} as any);
	return auth.handler(request);
}
