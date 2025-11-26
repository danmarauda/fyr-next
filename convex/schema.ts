import { v } from 'convex/values';
import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents';

const schema = defineEntSchema({
	// --------------------
	// Better Auth Tables (forked locally)
	// --------------------

	session: defineEnt({
		expiresAt: v.number(),
		createdAt: v.number(),
		updatedAt: v.number(),
		ipAddress: v.optional(v.union(v.null(), v.string())),
		userAgent: v.optional(v.union(v.null(), v.string())),
		impersonatedBy: v.optional(v.union(v.null(), v.string())),
		activeOrganizationId: v.optional(v.union(v.null(), v.string())),
	})
		.field('token', v.string(), { index: true })
		.edge('user', { to: 'user', field: 'userId' })
		.index('expiresAt', ['expiresAt'])
		.index('expiresAt_userId', ['expiresAt', 'userId']),

	account: defineEnt({
		accountId: v.string(),
		providerId: v.string(),
		accessToken: v.optional(v.union(v.null(), v.string())),
		refreshToken: v.optional(v.union(v.null(), v.string())),
		idToken: v.optional(v.union(v.null(), v.string())),
		accessTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
		refreshTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
		scope: v.optional(v.union(v.null(), v.string())),
		password: v.optional(v.union(v.null(), v.string())),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.edge('user', { to: 'user', field: 'userId' })
		.index('accountId', ['accountId'])
		.index('accountId_providerId', ['accountId', 'providerId'])
		.index('providerId_userId', ['providerId', 'userId']),

	verification: defineEnt({
		value: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.field('identifier', v.string(), { index: true })
		.field('expiresAt', v.number(), { index: true }),

	organization: defineEnt({
		logo: v.optional(v.union(v.null(), v.string())),
		createdAt: v.number(),
		metadata: v.optional(v.union(v.null(), v.string())),
		monthlyCredits: v.number(),
	})
		.field('slug', v.string(), { unique: true })
		.field('name', v.string(), { index: true })
		.edges('members', { to: 'member', ref: true })
		.edges('invitations', { to: 'invitation', ref: true })
		.edges('usersLastActive', {
			to: 'user',
			ref: 'lastActiveOrganizationId',
		})
		.edges('usersPersonal', { to: 'user', ref: 'personalOrganizationId' }),

	member: defineEnt({
		createdAt: v.number(),
	})
		.field('role', v.string(), { index: true })
		.edge('organization', { to: 'organization', field: 'organizationId' })
		.edge('user', { to: 'user', field: 'userId' })
		.index('organizationId_userId', ['organizationId', 'userId'])
		.index('organizationId_role', ['organizationId', 'role']),

	invitation: defineEnt({
		role: v.optional(v.union(v.null(), v.string())),
		expiresAt: v.number(),
	})
		.field('email', v.string(), { index: true })
		.field('status', v.string(), { index: true })
		.edge('organization', { to: 'organization', field: 'organizationId' })
		.edge('inviter', { to: 'user', field: 'inviterId' })
		.index('email_organizationId_status', ['email', 'organizationId', 'status'])
		.index('organizationId_status', ['organizationId', 'status'])
		.index('email_status', ['email', 'status'])
		.index('organizationId_email', ['organizationId', 'email'])
		.index('organizationId_email_status', ['organizationId', 'email', 'status']),

	jwks: defineEnt({
		publicKey: v.string(),
		privateKey: v.string(),
		createdAt: v.number(),
	}),

	// --------------------
	// Unified User Model (App + Better Auth)
	// --------------------
	user: defineEnt({
		// Better Auth required fields
		name: v.string(),
		emailVerified: v.boolean(),
		createdAt: v.number(),
		updatedAt: v.number(),

		// Better Auth optional fields
		image: v.optional(v.union(v.null(), v.string())),
		role: v.optional(v.union(v.null(), v.string())),
		banned: v.optional(v.union(v.null(), v.boolean())),
		banReason: v.optional(v.union(v.null(), v.string())),
		banExpires: v.optional(v.union(v.null(), v.number())),
		bio: v.optional(v.union(v.null(), v.string())),
		firstName: v.optional(v.union(v.null(), v.string())),
		github: v.optional(v.union(v.null(), v.string())),
		lastName: v.optional(v.union(v.null(), v.string())),
		linkedin: v.optional(v.union(v.null(), v.string())),
		location: v.optional(v.union(v.null(), v.string())),
		username: v.optional(v.union(v.null(), v.string())),
		website: v.optional(v.union(v.null(), v.string())),
		x: v.optional(v.union(v.null(), v.string())),

		// App-specific fields
		deletedAt: v.optional(v.number()),
		lastLoginAt: v.optional(v.number()),
		loginCount: v.optional(v.number()),
		preferences: v.optional(
			v.object({
				theme: v.optional(v.string()),
				notifications: v.optional(
					v.object({
						email: v.boolean(),
						push: v.boolean(),
						marketing: v.boolean(),
					}),
				),
				language: v.optional(v.string()),
			}),
		),
	})
		.field('email', v.string(), { unique: true })
		.field('customerId', v.optional(v.string()), { index: true })
		// Better Auth edges
		.edges('sessions', { to: 'session', ref: 'userId' })
		.edges('accounts', { to: 'account', ref: 'userId' })
		.edges('members', { to: 'member', ref: 'userId' })
		.edges('invitations', { to: 'invitation', ref: 'inviterId' })
		// App-specific edges
		.edge('lastActiveOrganization', {
			to: 'organization',
			field: 'lastActiveOrganizationId',
			optional: true,
		})
		.edge('personalOrganization', {
			to: 'organization',
			field: 'personalOrganizationId',
			optional: true,
		})
		.edges('subscriptions', { to: 'subscriptions', ref: 'userId' })
		.edges('auditLogs', { to: 'auditLog', ref: 'userId' })
		.edges('notifications', { to: 'notifications', ref: 'userId' })
		// Project management edges
		.edges('managedProjects', { to: 'projects', ref: 'managerId' })
		.edges('assignedTasks', { to: 'tasks', ref: 'assigneeId' })
		.edges('recordedActivities', { to: 'siteActivities', ref: 'recordedById' })
		.edges('operatedEquipment', { to: 'equipment', ref: 'operatorId' })
		.edges('reportedIncidents', { to: 'safetyIncidents', ref: 'reportedById' })
		.edges('uploadedDocuments', { to: 'documents', ref: 'uploadedById' })
		.edges('createdJobs', { to: 'jobs', ref: 'createdById' }),

	// --------------------
	// App-specific tables
	// --------------------

	// North East Link Projects
	projects: defineEnt({
		name: v.string(),
		description: v.string(),
		status: v.string(), // planning, active, on_hold, completed, cancelled
		progress: v.number(), // 0-100
		startDate: v.number(),
		endDate: v.number(),
		budget: v.number(),
		spent: v.number(),
		location: v.object({
			lat: v.number(),
			lng: v.number(),
			address: v.string(),
			suburb: v.optional(v.string()),
			state: v.optional(v.string()),
			postcode: v.optional(v.string()),
		}),
		priority: v.string(), // low, medium, high, critical
		tags: v.array(v.string()),
		metadata: v.optional(
			v.object({
				contractNumber: v.optional(v.string()),
				projectCode: v.optional(v.string()),
				client: v.optional(v.string()),
				value: v.optional(v.number()),
			}),
		),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.edge('manager', { to: 'user', field: 'managerId' })
		.edges('tasks', { to: 'tasks', ref: 'projectId' })
		.edges('resources', { to: 'resources', ref: 'projectId' })
		.edges('siteActivities', { to: 'siteActivities', ref: 'projectId' })
		.edges('equipment', { to: 'equipment', ref: 'projectId' })
		.edges('safetyIncidents', { to: 'safetyIncidents', ref: 'projectId' })
		.edges('documents', { to: 'documents', ref: 'projectId' })
		.edges('analytics', { to: 'analytics', ref: 'projectId' })
		.index('by_status', ['status']),

	// Construction Tasks
	tasks: defineEnt({
		title: v.string(),
		description: v.string(),
		status: v.string(), // pending, in_progress, completed, blocked
		priority: v.string(), // low, medium, high, critical
		dueDate: v.optional(v.number()),
		completedAt: v.optional(v.number()),
		estimatedHours: v.optional(v.number()),
		actualHours: v.optional(v.number()),
		dependencies: v.array(v.id('tasks')),
		tags: v.array(v.string()),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.edge('assignee', { to: 'user', field: 'assigneeId', optional: true })
		.edge('project', { to: 'projects', field: 'projectId' }),

	// Resources (Materials, Equipment, Labor)
	resources: defineEnt({
		name: v.string(),
		type: v.string(), // labor, equipment, material, subcontractor
		quantity: v.number(),
		unit: v.string(),
		cost: v.number(),
		supplier: v.string(),
		status: v.string(), // ordered, delivered, in_use, returned, damaged
		deliveryDate: v.optional(v.number()),
		returnDate: v.optional(v.number()),
		specifications: v.optional(v.object({})),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).edge('project', { to: 'projects', field: 'projectId' }),

	// Site Activities
	siteActivities: defineEnt({
		type: v.string(), // inspection, work_completed, incident, weather_delay
		description: v.string(),
		location: v.object({
			lat: v.number(),
			lng: v.number(),
			zone: v.optional(v.string()),
		}),
		photos: v.array(v.string()),
		weather: v.optional(
			v.object({
				temperature: v.number(),
				condition: v.string(),
				windSpeed: v.number(),
				humidity: v.number(),
			}),
		),
		timestamp: v.number(),
		createdAt: v.number(),
	})
		.edge('project', { to: 'projects', field: 'projectId' })
		.edge('recordedBy', { to: 'user', field: 'recordedById' }),

	// Equipment Management
	equipment: defineEnt({
		name: v.string(),
		type: v.string(),
		status: v.string(), // available, in_use, maintenance, retired
		location: v.object({
			lat: v.number(),
			lng: v.number(),
			site: v.optional(v.string()),
		}),
		hourlyRate: v.number(),
		dailyRate: v.optional(v.number()),
		specifications: v.optional(v.object({})),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.edge('project', { to: 'projects', field: 'projectId' })
		.edge('operator', { to: 'user', field: 'operatorId', optional: true }),

	// Safety Incidents
	safetyIncidents: defineEnt({
		type: v.string(), // near_miss, injury, property_damage, environmental
		severity: v.string(), // low, medium, high, critical
		description: v.string(),
		location: v.object({
			lat: v.number(),
			lng: v.number(),
			zone: v.optional(v.string()),
		}),
		photos: v.array(v.string()),
		resolved: v.boolean(),
		resolvedAt: v.optional(v.number()),
		resolutionNotes: v.optional(v.string()),
		timestamp: v.number(),
		createdAt: v.number(),
	})
		.edge('project', { to: 'projects', field: 'projectId' })
		.edge('reportedBy', { to: 'user', field: 'reportedById' }),

	// Documents & Files
	documents: defineEnt({
		name: v.string(),
		type: v.string(), // drawing, specification, report, photo, video
		url: v.string(),
		size: v.number(),
		mimeType: v.string(),
		tags: v.array(v.string()),
		metadata: v.optional(v.object({})),
		createdAt: v.number(),
	})
		.edge('project', { to: 'projects', field: 'projectId' })
		.edge('uploadedBy', { to: 'user', field: 'uploadedById' }),

	// Notifications (extended)
	notifications: defineEnt({
		title: v.string(),
		message: v.string(),
		type: v.string(), // info, warning, error, success, system
		read: v.boolean(),
		readAt: v.optional(v.number()),
		data: v.optional(v.object({})),
		expiresAt: v.optional(v.number()),
		createdAt: v.number(),
	})
		.edge('user', { to: 'user', field: 'userId' })
		.index('by_user', ['userId', 'read'])
		.index('by_expires', ['expiresAt']),

	// Analytics & Metrics (extended)
	analytics: defineEnt({
		metric: v.string(), // user_signups, project_created, task_completed, etc.
		value: v.number(),
		unit: v.string(),
		dimensions: v.optional(v.object({})), // additional metadata
		timestamp: v.number(),
		period: v.string(), // hour, day, week, month
		createdAt: v.number(),
	})
		.edge('project', { to: 'projects', field: 'projectId' })
		.index('by_project_metric', ['projectId', 'metric'])
		.index('by_metric_timestamp', ['metric', 'timestamp'])
		.index('by_period_timestamp', ['period', 'timestamp']),

	// Audit logging for security events
	auditLog: defineEnt({
		action: v.string(), // login, logout, create, update, delete, permission_change
		resource: v.string(), // user, project, task, organization, etc.
		resourceId: v.optional(v.string()),
		details: v.optional(v.object({})),
		ipAddress: v.optional(v.string()),
		userAgent: v.optional(v.string()),
		timestamp: v.number(),
	})
		.edge('user', { to: 'user', field: 'userId', optional: true })
		.index('by_action', ['action'])
		.index('by_resource', ['resource'])
		.index('by_timestamp', ['timestamp']),

	// Subscription management (Stripe integration)
	subscriptions: defineEnt({
		stripeSubscriptionId: v.string(),
		stripeCustomerId: v.string(),
		stripePriceId: v.string(),
		status: v.string(), // active, canceled, past_due, incomplete
		currentPeriodStart: v.number(),
		currentPeriodEnd: v.number(),
		cancelAtPeriodEnd: v.boolean(),
		amount: v.number(),
		currency: v.string(),
		interval: v.string(), // month, year
		planName: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.edge('user', { to: 'user', field: 'userId' })
		.index('by_stripe_subscription', ['stripeSubscriptionId'])
		.index('by_stripe_customer', ['stripeCustomerId'])
		.index('by_status', ['status']),

	// Subscription plans
	plans: defineEnt({
		name: v.string(),
		description: v.string(),
		stripeProductId: v.string(),
		price: v.number(),
		currency: v.string(),
		interval: v.string(), // month, year
		stripePriceId: v.string(),
		features: v.array(v.string()),
		maxUsers: v.optional(v.number()),
		maxProjects: v.optional(v.number()),
		isActive: v.boolean(),
		sortOrder: v.number(),
	})
		.index('by_active', ['isActive'])
		.index('by_sort_order', ['sortOrder']),

	// Background jobs for heavy operations
	jobs: defineEnt({
		type: v.string(), // export_data, bulk_import, email_campaign, etc.
		status: v.string(), // pending, running, completed, failed
		priority: v.number(), // 1-10, higher = more important
		data: v.object({}), // job-specific parameters
		result: v.optional(v.object({})), // job result data
		error: v.optional(v.string()),
		progress: v.optional(v.number()), // 0-100
		startedAt: v.optional(v.number()),
		completedAt: v.optional(v.number()),
		createdAt: v.number(),
	})
		.edge('createdBy', { to: 'user', field: 'createdById' })
		.index('by_status_priority', ['status', 'priority'])
		.index('by_type_status', ['type', 'status'])
		.index('by_created_at', ['createdAt']),

	// Rate limiting
	rateLimits: defineEnt({
		key: v.string(), // userId_endpoint or ip_endpoint
		endpoint: v.string(),
		requests: v.number(),
		windowStart: v.number(), // timestamp when window started
		windowSize: v.number(), // window size in milliseconds
	})
		.index('by_key_endpoint', ['key', 'endpoint'])
		.index('by_window_start', ['windowStart']),

	// Original numbers table from nel-convex
	numbers: defineEnt({
		value: v.number(),
	}),
});

export const entDefinitions = getEntDefinitions(schema);
export default schema;
