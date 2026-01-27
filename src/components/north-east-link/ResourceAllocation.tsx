import React from 'react';
import { Card } from '@/components/ui/Card';

interface ResourceAllocationProps {
	projectId: string;
}

interface ResourceData {
	category: string;
	allocated: number;
	utilized: number;
	efficiency: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ResourceAllocation = ({ projectId }: ResourceAllocationProps) => {
	// Mock data for demonstration
	const resourceData: ResourceData[] = [
		{
			category: 'Labor',
			allocated: 50,
			utilized: 42,
			efficiency: 84,
		},
		{
			category: 'Equipment',
			allocated: 15,
			utilized: 12,
			efficiency: 80,
		},
		{
			category: 'Materials',
			allocated: 100,
			utilized: 88,
			efficiency: 88,
		},
	];

	return (
		<Card className='p-6'>
			<div className='mb-6'>
				<h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
					Resource Allocation & Efficiency
				</h3>
				<p className='text-sm text-gray-500 dark:text-gray-400'>
					Real-time resource utilization across project phases
				</p>
			</div>

			<div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
				{resourceData.map((item) => (
					<div key={item.category} className='rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									{item.category}
								</p>
								<p className='text-2xl font-bold text-gray-900 dark:text-white'>
									{item.efficiency.toFixed(1)}%
								</p>
							</div>
							<div className='text-right'>
								<p className='text-sm text-gray-500 dark:text-gray-400'>
									{item.utilized}/{item.allocated}
								</p>
								<p className='text-xs text-gray-400 dark:text-gray-500'>utilized</p>
							</div>
						</div>
						<div className='mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
							<div
								className='h-2 rounded-full bg-blue-500 transition-all duration-300'
								style={{ width: `${item.efficiency}%` }}
							/>
						</div>
					</div>
				))}
			</div>

			<div className='space-y-4'>
				{resourceData.map((item) => (
					<div key={item.category} className='space-y-2'>
						<div className='flex items-center justify-between'>
							<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
								{item.category}
							</span>
							<span className='text-sm text-gray-500 dark:text-gray-400'>
								{item.utilized}/{item.allocated}
							</span>
						</div>
						<div className='h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
							<div
								className='h-3 rounded-full bg-blue-500 transition-all duration-300'
								style={{ width: `${(item.utilized / item.allocated) * 100}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
};
