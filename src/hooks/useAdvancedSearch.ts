'use client';

import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export interface SearchFilters {
	status?: string[];
	priority?: string[];
	assigneeId?: Id<'user'>[];
	tags?: string[];
	dateRange?: {
		start?: number;
		end?: number;
	};
}

export interface SearchOptions {
	query?: string;
	filters?: SearchFilters;
	limit?: number;
}

export const useAdvancedSearch = (projectId?: Id<'projects'>) => {
	const [searchOptions, setSearchOptions] = useState<SearchOptions>({});

	// Get all tasks for the project (or all tasks if no project specified)
	const allTasks = useQuery(
		projectId ? api.tasks.getTasksByProject : api.tasks.getTasksByStatus,
		projectId ? { projectId } : { status: 'all' }, // Note: This might need adjustment
	);

	const projects = useQuery(api.projects.getProjects);

	// Perform search and filtering
	const searchResults = useMemo(() => {
		if (!allTasks) return { tasks: [], projects: [] };

		let filteredTasks = [...allTasks];
		let filteredProjects = projects ? [...projects] : [];

		const { query, filters } = searchOptions;

		// Text search
		if (query && query.trim()) {
			const searchTerm = query.toLowerCase().trim();

			filteredTasks = filteredTasks.filter(
				(task) =>
					task.title.toLowerCase().includes(searchTerm) ||
					task.description.toLowerCase().includes(searchTerm) ||
					task.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
			);

			filteredProjects = filteredProjects.filter(
				(project) =>
					project.name.toLowerCase().includes(searchTerm) ||
					project.description.toLowerCase().includes(searchTerm) ||
					project.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
			);
		}

		// Apply filters
		if (filters) {
			// Task filters
			if (filters.status && filters.status.length > 0) {
				filteredTasks = filteredTasks.filter((task) =>
					filters.status!.includes(task.status),
				);
			}

			if (filters.priority && filters.priority.length > 0) {
				filteredTasks = filteredTasks.filter((task) =>
					filters.priority!.includes(task.priority),
				);
			}

			if (filters.assigneeId && filters.assigneeId.length > 0) {
				filteredTasks = filteredTasks.filter(
					(task) => task.assigneeId && filters.assigneeId!.includes(task.assigneeId),
				);
			}

			if (filters.tags && filters.tags.length > 0) {
				filteredTasks = filteredTasks.filter((task) =>
					filters.tags!.some((tag) => task.tags.includes(tag)),
				);
			}

			if (filters.dateRange) {
				filteredTasks = filteredTasks.filter((task) => {
					if (!task.dueDate) return false;
					const { start, end } = filters.dateRange!;
					if (start && task.dueDate < start) return false;
					if (end && task.dueDate > end) return false;
					return true;
				});
			}

			// Project filters (could be extended)
			// For now, projects are filtered only by text search
		}

		// Apply limit
		if (searchOptions.limit) {
			filteredTasks = filteredTasks.slice(0, searchOptions.limit);
			filteredProjects = filteredProjects.slice(0, searchOptions.limit);
		}

		return {
			tasks: filteredTasks,
			projects: filteredProjects,
			totalTasks: filteredTasks.length,
			totalProjects: filteredProjects.length,
		};
	}, [allTasks, projects, searchOptions]);

	const setQuery = (query: string) => {
		setSearchOptions((prev) => ({ ...prev, query }));
	};

	const setFilters = (filters: SearchFilters) => {
		setSearchOptions((prev) => ({ ...prev, filters }));
	};

	const updateFilter = (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
		setSearchOptions((prev) => ({
			...prev,
			filters: {
				...prev.filters,
				[key]: value,
			},
		}));
	};

	const clearFilters = () => {
		setSearchOptions((prev) => ({ ...prev, filters: {} }));
	};

	const clearSearch = () => {
		setSearchOptions({});
	};

	return {
		searchResults,
		searchOptions,
		setQuery,
		setFilters,
		updateFilter,
		clearFilters,
		clearSearch,
		isLoading: !allTasks || !projects,
	};
};
