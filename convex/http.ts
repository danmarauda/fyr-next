import { registerRoutes } from 'better-convex/auth';
import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { createAuth } from './auth';
import { resend } from './emails';

const http = httpRouter();

// Better Auth routes
registerRoutes(http, createAuth);

// Resend webhook handler for email delivery events
http.route({
	path: '/resend-webhook',
	method: 'POST',
	handler: httpAction(async (ctx, req) => {
		return await resend.handleResendEventWebhook(ctx, req);
	}),
});

export default http;
