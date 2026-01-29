import { components, internal } from './_generated/api';
import type { EmailId } from '@convex-dev/resend';
import { internalMutation, internalAction } from './_generated/server';
import { Resend, vOnEmailEventArgs } from '@convex-dev/resend';
import { v } from 'convex/values';

/**
 * Resend Email Service for ALIAS Platform
 *
 * Features:
 * - Queueing with automatic batching
 * - Durable execution with retry logic
 * - Idempotency to prevent duplicate sends
 * - Rate limiting compliance
 * - Webhook event handling
 */

// Initialize Resend component with event handler
export const resend: Resend = new Resend(components.resend, {
	onEmailEvent: internal.emails.handleEmailEvent,
	// Set to false for production, true for development
	testMode: process.env.NODE_ENV === 'development',
});

// ============================================================================
// Email Sending Functions
// ============================================================================

/**
 * Send a welcome email to a new user
 */
export const sendWelcomeEmail = internalAction({
	args: {
		to: v.string(),
		userName: v.string(),
	},
	handler: async (ctx, args) => {
		const emailId = await resend.sendEmail(ctx, {
			from: 'ALIAS <welcome@alias.com.ai>',
			to: args.to,
			subject: 'Welcome to ALIAS - Your AI-Powered Business Intelligence Platform',
			html: `
				<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
					<div style="text-align: center; margin-bottom: 40px;">
						<div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px;">
							<h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.3em; color: white;">ALIAS</h1>
						</div>
					</div>
					
					<h2 style="font-size: 24px; font-weight: 400; margin-bottom: 20px; color: white;">Welcome, ${args.userName}!</h2>
					
					<p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px;">
						You've joined a network of visionaries using advanced analytics to shape the future of enterprise.
					</p>
					
					<p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 32px;">
						Get started by exploring your dashboard and setting up your first project.
					</p>
					
					<a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://alias.com.ai'}" 
						style="display: inline-block; padding: 14px 32px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
						Go to Dashboard →
					</a>
					
					<div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #27272a;">
						<p style="font-size: 12px; color: #71717a; margin: 0;">
							ALIAS - Gateway to AI Excellence
						</p>
					</div>
				</div>
			`,
		});

		console.log('Welcome email sent:', emailId);
		return emailId;
	},
});

/**
 * Send a password reset email
 */
export const sendPasswordResetEmail = internalAction({
	args: {
		to: v.string(),
		resetToken: v.string(),
		userName: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://alias.com.ai'}/reset-password?token=${args.resetToken}`;

		const emailId = await resend.sendEmail(ctx, {
			from: 'ALIAS <security@alias.com.ai>',
			to: args.to,
			subject: 'Reset Your ALIAS Password',
			html: `
				<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
					<div style="text-align: center; margin-bottom: 40px;">
						<div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px;">
							<h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.3em; color: white;">ALIAS</h1>
						</div>
					</div>
					
					<h2 style="font-size: 24px; font-weight: 400; margin-bottom: 20px; color: white;">Password Reset Request</h2>
					
					<p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px;">
						${args.userName ? `Hi ${args.userName}, ` : ''}We received a request to reset your password. Click the button below to create a new password.
					</p>
					
					<a href="${resetUrl}" 
						style="display: inline-block; padding: 14px 32px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; margin-bottom: 24px;">
						Reset Password →
					</a>
					
					<p style="font-size: 14px; line-height: 1.6; color: #71717a; margin-bottom: 24px;">
						This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
					</p>
					
					<div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #27272a;">
						<p style="font-size: 12px; color: #71717a; margin: 0;">
							ALIAS - Gateway to AI Excellence
						</p>
					</div>
				</div>
			`,
		});

		console.log('Password reset email sent:', emailId);
		return emailId;
	},
});

/**
 * Send an email verification email
 */
export const sendVerificationEmail = internalAction({
	args: {
		to: v.string(),
		verificationToken: v.string(),
		userName: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://alias.com.ai'}/verify-email?token=${args.verificationToken}`;

		const emailId = await resend.sendEmail(ctx, {
			from: 'ALIAS <verify@alias.com.ai>',
			to: args.to,
			subject: 'Verify Your ALIAS Email Address',
			html: `
				<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
					<div style="text-align: center; margin-bottom: 40px;">
						<div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px;">
							<h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.3em; color: white;">ALIAS</h1>
						</div>
					</div>
					
					<h2 style="font-size: 24px; font-weight: 400; margin-bottom: 20px; color: white;">Verify Your Email</h2>
					
					<p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px;">
						${args.userName ? `Hi ${args.userName}, ` : ''}Please verify your email address to complete your registration.
					</p>
					
					<a href="${verifyUrl}" 
						style="display: inline-block; padding: 14px 32px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; margin-bottom: 24px;">
						Verify Email →
					</a>
					
					<p style="font-size: 14px; line-height: 1.6; color: #71717a; margin-bottom: 24px;">
						This link will expire in 24 hours.
					</p>
					
					<div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #27272a;">
						<p style="font-size: 12px; color: #71717a; margin: 0;">
							ALIAS - Gateway to AI Excellence
						</p>
					</div>
				</div>
			`,
		});

		console.log('Verification email sent:', emailId);
		return emailId;
	},
});

/**
 * Send a generic notification email
 */
export const sendNotificationEmail = internalAction({
	args: {
		to: v.string(),
		subject: v.string(),
		title: v.string(),
		message: v.string(),
		ctaText: v.optional(v.string()),
		ctaUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const emailId = await resend.sendEmail(ctx, {
			from: 'ALIAS <notifications@alias.com.ai>',
			to: args.to,
			subject: args.subject,
			html: `
				<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
					<div style="text-align: center; margin-bottom: 40px;">
						<div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px;">
							<h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.3em; color: white;">ALIAS</h1>
						</div>
					</div>
					
					<h2 style="font-size: 24px; font-weight: 400; margin-bottom: 20px; color: white;">${args.title}</h2>
					
					<p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 32px;">
						${args.message}
					</p>
					
					${
						args.ctaText && args.ctaUrl
							? `
					<a href="${args.ctaUrl}" 
						style="display: inline-block; padding: 14px 32px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
						${args.ctaText} →
					</a>
					`
							: ''
					}
					
					<div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #27272a;">
						<p style="font-size: 12px; color: #71717a; margin: 0;">
							ALIAS - Gateway to AI Excellence
						</p>
					</div>
				</div>
			`,
		});

		console.log('Notification email sent:', emailId);
		return emailId;
	},
});

/**
 * Send invitation email for team/organization
 */
export const sendInvitationEmail = internalAction({
	args: {
		to: v.string(),
		inviterName: v.string(),
		organizationName: v.string(),
		inviteToken: v.string(),
		role: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://alias.com.ai'}/invite?token=${args.inviteToken}`;

		const emailId = await resend.sendEmail(ctx, {
			from: 'ALIAS <invites@alias.com.ai>',
			to: args.to,
			subject: `You've been invited to join ${args.organizationName} on ALIAS`,
			html: `
				<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
					<div style="text-align: center; margin-bottom: 40px;">
						<div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px;">
							<h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.3em; color: white;">ALIAS</h1>
						</div>
					</div>
					
					<h2 style="font-size: 24px; font-weight: 400; margin-bottom: 20px; color: white;">You're Invited!</h2>
					
					<p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px;">
						<strong style="color: white;">${args.inviterName}</strong> has invited you to join 
						<strong style="color: white;">${args.organizationName}</strong> on ALIAS
						${args.role ? ` as a <strong style="color: #3b82f6;">${args.role}</strong>` : ''}.
					</p>
					
					<p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 32px;">
						Join the team to collaborate on AI-powered business intelligence.
					</p>
					
					<a href="${inviteUrl}" 
						style="display: inline-block; padding: 14px 32px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
						Accept Invitation →
					</a>
					
					<p style="font-size: 14px; line-height: 1.6; color: #71717a; margin-top: 24px;">
						This invitation will expire in 7 days.
					</p>
					
					<div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #27272a;">
						<p style="font-size: 12px; color: #71717a; margin: 0;">
							ALIAS - Gateway to AI Excellence
						</p>
					</div>
				</div>
			`,
		});

		console.log('Invitation email sent:', emailId);
		return emailId;
	},
});

// ============================================================================
// Email Event Handler
// ============================================================================

/**
 * Handle email delivery events from Resend webhooks
 */
export const handleEmailEvent = internalMutation({
	args: vOnEmailEventArgs,
	handler: async (ctx, args) => {
		console.log('Email event received:', args.id, args.event.type);

		// Log the event for monitoring
		await ctx.db.insert('emailEvents', {
			emailId: args.id,
			eventType: args.event.type,
			timestamp: Date.now(),
			data: JSON.stringify(args.event),
		});

		// Handle specific event types
		switch (args.event.type) {
			case 'email.delivered':
				console.log('Email delivered successfully:', args.id);
				break;
			case 'email.bounced':
				console.log('Email bounced:', args.id, args.event);
				// Could trigger user notification or mark email as invalid
				break;
			case 'email.complained':
				console.log('Spam complaint received:', args.id);
				// Could add to suppression list or notify admin
				break;
			case 'email.opened':
				console.log('Email opened:', args.id);
				break;
			case 'email.clicked':
				console.log('Email link clicked:', args.id);
				break;
			default:
				console.log('Unknown email event:', args.event.type);
		}
	},
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check email status
 */
export const getEmailStatus = internalAction({
	args: {
		emailId: v.string(),
	},
	handler: async (ctx, args) => {
		const status = await resend.status(ctx, args.emailId as EmailId);
		return status;
	},
});

/**
 * Cancel a queued email
 */
export const cancelEmail = internalAction({
	args: {
		emailId: v.string(),
	},
	handler: async (ctx, args) => {
		const cancelled = await resend.cancelEmail(ctx, args.emailId as EmailId);
		return cancelled;
	},
});
