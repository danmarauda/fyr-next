'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCallback } from 'react';
import { Id } from '@/convex/_generated/dataModel';

export interface Task {
	_id: Id<'tasks'>;
	title: string;
	description: string;
	status: string;
	priority: string;
	dueDate?: number;
	assigneeId?: Id<'user'>;
	projectId: Id<'projects'>;
	tags: string[];
	createdAt: number;
	updatedAt: number;
}

export const useTasks = (projectId: Id<'projects'>) => {
	const tasks = useQuery(api.tasks.getTasksByProject, { projectId });
	const createTaskMutation = useMutation(api.tasks.createTask);
	const updateTaskMutation = useMutation(api.tasks.updateTask);
	const updateTaskStatusMutation = useMutation(api.tasks.updateTaskStatus);
	const deleteTaskMutation = useMutation(api.tasks.deleteTask);

	const createTask = useCallback(
		async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
			// Optimistic update: immediately add task to local state
			const optimisticTask: Task = {
				_id: `temp-${Date.now()}` as Id<'tasks'>,
				...taskData,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			// Add to optimistic state
			const previousTasks = tasks || [];
			// Note: In a real implementation, you'd use a state management solution
			// to handle optimistic updates. For now, we'll just call the mutation.

			try {
				const result = await createTaskMutation(taskData);
				return result;
			} catch (error) {
				// Revert optimistic update on error
				console.error('Failed to create task:', error);
				throw error;
			}
		},
		[createTaskMutation, tasks],
	);

	const updateTask = useCallback(
		async (
			taskId: Id<'tasks'>,
			updates: Partial<Omit<Task, '_id' | 'createdAt' | 'updatedAt'>>,
		) => {
			try {
				const result = await updateTaskMutation({ id: taskId, ...updates });
				return result;
			} catch (error) {
				console.error('Failed to update task:', error);
				throw error;
			}
		},
		[updateTaskMutation],
	);

	const updateTaskStatus = useCallback(
		async (taskId: Id<'tasks'>, status: string) => {
			try {
				const result = await updateTaskStatusMutation({ id: taskId, status });
				return result;
			} catch (error) {
				console.error('Failed to update task status:', error);
				throw error;
			}
		},
		[updateTaskStatusMutation],
	);

	const deleteTask = useCallback(
		async (taskId: Id<'tasks'>) => {
			try {
				const result = await deleteTaskMutation({ id: taskId });
				return result;
			} catch (error) {
				console.error('Failed to delete task:', error);
				throw error;
			}
		},
		[deleteTaskMutation],
	);

	return {
		tasks,
		createTask,
		updateTask,
		updateTaskStatus,
		deleteTask,
	};
};
