import React from 'react';
import { Card } from '@/components/ui/Card';

interface ConstructionProgressProps {
	projectId: string;
}

export function ConstructionProgress({ projectId }: ConstructionProgressProps) {
	// Mock data for demonstration
	const progressData = [
		{ date: 'Jan', progress: 15, target: 20 },
		{ date: 'Feb', progress: 28, target: 35 },
		{ date: 'Mar', progress: 42, target: 50 },
		{ date: 'Apr', progress: 58, target: 65 },
		{ date: 'May', progress: 75, target: 80 },
	];

	const latestProgress = 75;
	const daysRemaining = 45;

	return (
		<Card className='p-6'>
			<div className='mb-4 flex items-center justify-between'>
				<div>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Construction Progress
					</p>
					<p className='text-3xl font-bold text-gray-900 dark:text-white'>
						{latestProgress}%
					</p>
				</div>
				<div className='text-right'>
					<p className='text-sm text-gray-500 dark:text-gray-400'>Days Remaining</p>
					<p className='text-3xl font-bold text-orange-600 dark:text-orange-400'>
						{daysRemaining}
					</p>
				</div>
			</div>

			<div className='space-y-4'>
				{progressData.map((item, index) => (
					<div key={index} className='flex items-center justify-between'>
						<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
							{item.date}
						</span>
						<div className='mx-4 flex-1'>
							<div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
								<div
									className='h-2 rounded-full bg-blue-500 transition-all duration-300'
									style={{ width: `${item.progress}%` }}
								/>
							</div>
						</div>
						<span className='text-sm text-gray-500 dark:text-gray-400'>
							{item.progress}%
						</span>
					</div>
				))}
			</div>

			<div className='mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
				<span>Target vs Actual Progress</span>
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-2'>
						<div className='h-3 w-3 rounded-full bg-blue-500'></div>
						<span>Actual</span>
					</div>
					<div className='flex items-center gap-2'>
						<div className='h-3 w-3 rounded-full border-2 border-orange-500 bg-transparent'></div>
						<span>Target</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
