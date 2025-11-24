'use client';

import React, { useState, useMemo } from 'react';
import { TTasks } from '@/mocks/db/tasks.db';

interface AdvancedSearchProps {
	tasks: TTasks;
	onFilteredTasksChange: (filteredTasks: TTasks) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ tasks, onFilteredTasksChange }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
	const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	// Get all available options from tasks
	const availableOptions = useMemo(() => {
		const statuses = new Set<string>();
		const priorities = new Set<string>();
		const tags = new Set<string>();

		Object.keys(tasks).forEach((columnKey) => {
			const status = getStatusFromColumn(columnKey);
			statuses.add(status);

			tasks[columnKey].forEach((task) => {
				priorities.add(task.label);
				// For demo purposes, extract keywords from title/description as tags
				const keywords = task.title
					.toLowerCase()
					.split(' ')
					.concat(task.subtitle.toLowerCase().split(' '));
				keywords.forEach((keyword) => {
					if (keyword.length > 3) tags.add(keyword);
				});
			});
		});

		return {
			statuses: Array.from(statuses),
			priorities: Array.from(priorities),
			tags: Array.from(tags),
		};
	}, [tasks]);

	// Filter tasks based on search criteria
	const filteredTasks = useMemo(() => {
		const result: TTasks = {
			column1: [],
			column2: [],
			column3: [],
			column4: [],
			column5: [],
		};

		Object.entries(tasks).forEach(([columnKey, taskList]) => {
			result[columnKey as keyof TTasks] = taskList.filter((task) => {
				// Text search
				const matchesQuery =
					!searchQuery ||
					task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					task.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
					task.description.toLowerCase().includes(searchQuery.toLowerCase());

				// Status filter (derived from column)
				const matchesStatus =
					selectedStatuses.length === 0 ||
					selectedStatuses.includes(getStatusFromColumn(columnKey));

				// Priority filter
				const matchesPriority =
					selectedPriorities.length === 0 || selectedPriorities.includes(task.label);

				// Tags filter (using keywords from title/subtitle)
				const matchesTags =
					selectedTags.length === 0 ||
					selectedTags.some(
						(tag) =>
							task.title.toLowerCase().includes(tag.toLowerCase()) ||
							task.subtitle.toLowerCase().includes(tag.toLowerCase()),
					);

				return matchesQuery && matchesStatus && matchesPriority && matchesTags;
			});
		});

		return result;
	}, [tasks, searchQuery, selectedStatuses, selectedPriorities, selectedTags]);

	// Update parent component when filtered tasks change
	React.useEffect(() => {
		onFilteredTasksChange(filteredTasks);
	}, [filteredTasks, onFilteredTasksChange]);

	const getStatusFromColumn = (columnKey: string): string => {
		switch (columnKey) {
			case 'column1':
				return 'backlog';
			case 'column2':
				return 'pending';
			case 'column3':
				return 'in_progress';
			case 'column4':
				return 'running';
			case 'column5':
				return 'completed';
			default:
				return 'pending';
		}
	};

	const toggleFilter = (
		value: string,
		currentValues: string[],
		setValues: (values: string[]) => void,
	) => {
		if (currentValues.includes(value)) {
			setValues(currentValues.filter((v) => v !== value));
		} else {
			setValues([...currentValues, value]);
		}
	};

	const clearAllFilters = () => {
		setSearchQuery('');
		setSelectedStatuses([]);
		setSelectedPriorities([]);
		setSelectedTags([]);
	};

	const hasActiveFilters =
		searchQuery ||
		selectedStatuses.length > 0 ||
		selectedPriorities.length > 0 ||
		selectedTags.length > 0;

	return (
		<div className='space-y-4 rounded-lg border bg-white p-4 dark:bg-zinc-800'>
			{/* Search Input */}
			<div>
				<input
					type='text'
					placeholder='Search tasks, descriptions, or tags...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700'
				/>
			</div>

			{/* Filter Buttons */}
			<div className='space-y-3'>
				{/* Status Filters */}
				<div>
					<label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
						Status
					</label>
					<div className='flex flex-wrap gap-2'>
						{availableOptions.statuses.map((status) => (
							<button
								key={status}
								onClick={() =>
									toggleFilter(status, selectedStatuses, setSelectedStatuses)
								}
								className={`rounded-full border px-3 py-1 text-sm ${
									selectedStatuses.includes(status)
										? 'border-blue-500 bg-blue-500 text-white'
										: 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-300'
								}`}>
								{status}
							</button>
						))}
					</div>
				</div>

				{/* Priority Filters */}
				<div>
					<label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
						Priority
					</label>
					<div className='flex flex-wrap gap-2'>
						{availableOptions.priorities.map((priority) => (
							<button
								key={priority}
								onClick={() =>
									toggleFilter(
										priority,
										selectedPriorities,
										setSelectedPriorities,
									)
								}
								className={`rounded-full border px-3 py-1 text-sm ${
									selectedPriorities.includes(priority)
										? 'border-green-500 bg-green-500 text-white'
										: 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-300'
								}`}>
								{priority}
							</button>
						))}
					</div>
				</div>

				{/* Tags Filters */}
				<div>
					<label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
						Tags
					</label>
					<div className='flex flex-wrap gap-2'>
						{availableOptions.tags.map((tag) => (
							<button
								key={tag}
								onClick={() => toggleFilter(tag, selectedTags, setSelectedTags)}
								className={`rounded-full border px-3 py-1 text-sm ${
									selectedTags.includes(tag)
										? 'border-purple-500 bg-purple-500 text-white'
										: 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-300'
								}`}>
								{tag}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Clear Filters */}
			{hasActiveFilters && (
				<div className='flex items-center justify-between border-t pt-2'>
					<span className='text-sm text-gray-600 dark:text-gray-400'>
						{Object.values(filteredTasks).flat().length} tasks found
					</span>
					<button
						onClick={clearAllFilters}
						className='px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
						Clear all filters
					</button>
				</div>
			)}
		</div>
	);
};
