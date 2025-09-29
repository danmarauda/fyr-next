import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	// AuthKit users
	users: defineTable({
		email: v.string(),
		name: v.string(),
		image: v.optional(v.string()),
		emailVerified: v.optional(v.boolean()),
		createdAt: v.number(),
		updatedAt: v.number(),
		// North East Link specific fields
		role: v.optional(v.string()),
		department: v.optional(v.string()),
		permissions: v.optional(v.array(v.string())),
	}).index('by_email', ['email']),

	// North East Link Projects
	projects: defineTable({
		name: v.string(),
		description: v.string(),
		status: v.string(), // planning, active, on_hold, completed, cancelled
		progress: v.number(), // 0-100
		startDate: v.number(),
		endDate: v.number(),
		budget: v.number(),
		spent: v.number(),
		managerId: v.id('users'),
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
	}).index('by_status', ['status']),

	// Construction Tasks
	tasks: defineTable({
		title: v.string(),
		description: v.string(),
		status: v.string(), // pending, in_progress, completed, blocked
		priority: v.string(), // low, medium, high, critical
		assigneeId: v.optional(v.id('users')),
		projectId: v.id('projects'),
		dueDate: v.optional(v.number()),
		completedAt: v.optional(v.number()),
		estimatedHours: v.optional(v.number()),
		actualHours: v.optional(v.number()),
		dependencies: v.array(v.id('tasks')),
		tags: v.array(v.string()),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index('by_project', ['projectId']),

	// Resources (Materials, Equipment, Labor)
	resources: defineTable({
		name: v.string(),
		type: v.string(), // labor, equipment, material, subcontractor
		quantity: v.number(),
		unit: v.string(),
		cost: v.number(),
		projectId: v.id('projects'),
		supplier: v.string(),
		status: v.string(), // ordered, delivered, in_use, returned, damaged
		deliveryDate: v.optional(v.number()),
		returnDate: v.optional(v.number()),
		specifications: v.optional(v.object({})),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index('by_project', ['projectId']),

	// Site Activities
	siteActivities: defineTable({
		projectId: v.id('projects'),
		type: v.string(), // inspection, work_completed, incident, weather_delay
		description: v.string(),
		recordedBy: v.id('users'),
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
	}).index('by_project', ['projectId']),

	// Equipment Management
	equipment: defineTable({
		name: v.string(),
		type: v.string(),
		status: v.string(), // available, in_use, maintenance, retired
		location: v.object({
			lat: v.number(),
			lng: v.number(),
			site: v.optional(v.string()),
		}),
		projectId: v.id('projects'),
		operatorId: v.optional(v.id('users')),
		maintenanceSchedule: v.optional(v.number()),
		lastMaintenance: v.optional(v.number()),
		nextMaintenance: v.optional(v.number()),
		hourlyRate: v.number(),
		dailyRate: v.optional(v.number()),
		specifications: v.optional(v.object({})),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index('by_project', ['projectId']),

	// Safety Incidents
	safetyIncidents: defineTable({
		projectId: v.id('projects'),
		type: v.string(), // near_miss, injury, property_damage, environmental
		severity: v.string(), // low, medium, high, critical
		description: v.string(),
		reportedBy: v.id('users'),
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
	}).index('by_project', ['projectId']),

	// Documents & Files
	documents: defineTable({
		name: v.string(),
		type: v.string(), // drawing, specification, report, photo, video
		url: v.string(),
		projectId: v.id('projects'),
		uploadedBy: v.id('users'),
		size: v.number(),
		mimeType: v.string(),
		tags: v.array(v.string()),
		metadata: v.optional(v.object({})),
		createdAt: v.number(),
	}).index('by_project', ['projectId']),

	// Notifications
	notifications: defineTable({
		userId: v.id('users'),
		title: v.string(),
		message: v.string(),
		type: v.string(), // info, warning, error, success
		read: v.boolean(),
		data: v.optional(v.object({})),
		createdAt: v.number(),
	}).index('by_user', ['userId', 'read']),

	// Analytics & Metrics
	analytics: defineTable({
		projectId: v.id('projects'),
		metric: v.string(), // progress, efficiency, quality, safety, budget
		value: v.number(),
		unit: v.string(),
		timestamp: v.number(),
		metadata: v.optional(v.object({})),
		createdAt: v.number(),
	}).index('by_project_metric', ['projectId', 'metric']),

	// Original numbers table from nel-convex
	numbers: defineTable({
		value: v.number(),
	}),
});
