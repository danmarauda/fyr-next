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
		.edges('subscriptions', { to: 'subscriptions', ref: 'userId' }),

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
		.edge('project', { to: 'projects', field: 'projectId' })
		.index('by_project', ['projectId']),

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
	})
		.edge('project', { to: 'projects', field: 'projectId' })
		.index('by_project', ['projectId']),

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
		.edge('recordedBy', { to: 'user', field: 'recordedById' })
		.index('by_project', ['projectId']),

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
		.edge('operator', { to: 'user', field: 'operatorId', optional: true })
		.index('by_project', ['projectId']),

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
		.edge('reportedBy', { to: 'user', field: 'reportedById' })
		.index('by_project', ['projectId']),

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
		.edge('uploadedBy', { to: 'user', field: 'uploadedById' })
		.index('by_project', ['projectId']),

	// Notifications
	notifications: defineEnt({
		title: v.string(),
		message: v.string(),
		type: v.string(), // info, warning, error, success
		read: v.boolean(),
		data: v.optional(v.object({})),
		createdAt: v.number(),
	})
		.edge('user', { to: 'user', field: 'userId' })
		.index('by_user', ['userId', 'read']),

	// Analytics & Metrics
	analytics: defineEnt({
		metric: v.string(), // progress, efficiency, quality, safety, budget
		value: v.number(),
		unit: v.string(),
		timestamp: v.number(),
		metadata: v.optional(v.object({})),
		createdAt: v.number(),
	})
		.edge('project', { to: 'projects', field: 'projectId' })
		.index('by_project_metric', ['projectId', 'metric']),

	// Original numbers table from nel-convex
	numbers: defineEnt({
		value: v.number(),
	}),
});

export const entDefinitions = getEntDefinitions(schema);
export default schema;
