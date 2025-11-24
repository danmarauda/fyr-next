import React from 'react';
import { Card } from '@/components/ui/Card';
import {
	HiOutlineBuildingOffice,
	HiOutlineTruck,
	HiOutlineUsers,
	HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface ProjectStatsProps {
	projectId: string;
}

export const ProjectStats = ({ projectId }: ProjectStatsProps) => {
	// Use Convex real-time queries
	const project = useQuery(api.projects.getProject, { id: projectId });
	const tasks = useQuery(api.tasks.getTasksByProject, { projectId });
	const resources = useQuery(api.resources.getResourcesByProject, { projectId });
	const incidents = useQuery(api.safetyIncidents.getIncidentsByProject, { projectId });

	if (!project) return null;

	const completedTasks = tasks?.filter((task) => task.status === 'completed').length || 0;
	const totalTasks = tasks?.length || 0;
	const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

	const activeResources =
		resources?.filter((resource) => resource.status === 'active').length || 0;
	const pendingIncidents = incidents?.filter((incident) => !incident.resolved).length || 0;

	const stats = [
		{
			title: 'Project Progress',
			value: `${project.progress}%`,
			icon: HiOutlineBuildingOffice,
			color: 'blue',
			progress: project.progress,
		},
		{
			title: 'Tasks Complete',
			value: `${completedTasks}/${totalTasks}`,
			icon: HiOutlineUsers,
			color: 'green',
			progress: taskCompletionRate,
		},
		{
			title: 'Active Resources',
			value: activeResources.toString(),
			icon: HiOutlineTruck,
			color: 'amber',
			progress: (activeResources / 50) * 100, // Assuming max 50 resources
		},
		{
			title: 'Safety Incidents',
			value: pendingIncidents.toString(),
			icon: HiOutlineExclamationTriangle,
			color: 'red',
			progress: (pendingIncidents / 10) * 100, // Assuming max 10 incidents
		},
	];

	return (
		<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
			{stats.map((stat) => (
				<Card key={stat.title} className='p-4'>
					<div className='mb-4 flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='rounded-lg bg-gray-100 p-2 dark:bg-gray-800'>
								<stat.icon className='h-6 w-6 text-gray-600 dark:text-gray-300' />
							</div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>{stat.title}</p>
						</div>
					</div>
					<p className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
						{stat.value}
					</p>
					<div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
						<div
							className={`h-2 rounded-full bg-${stat.color}-500 transition-all duration-300`}
							style={{ width: `${stat.progress}%` }}
						/>
					</div>
				</Card>
			))}
		</div>
	);
};
