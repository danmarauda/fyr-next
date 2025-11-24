import React from 'react';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Container from '@/components/layouts/Container/Container';
import Subheader, { SubheaderLeft, SubheaderRight } from '@/components/layouts/Subheader/Subheader';
import { Card, CardContent, CardHeader, CardTitle } from '@fyr/ui';
import { Button } from '@fyr/ui';
import { Badge } from '@fyr/ui';
import { Progress } from '@fyr/ui';
import {
	DocumentTextIcon,
	ClockIcon,
	CheckCircleIcon,
	ChartBarIcon,
	PlusIcon,
	MagnifyingGlassIcon,
	TagIcon,
} from 'lucide-react';

const TendersDashboard = () => {
	// Mock data for demonstration
	const stats = {
		totalTenders: 47,
		activeTenders: 23,
		dueSoon: 8,
		completed: 16,
	};

	const recentTenders = [
		{
			id: 'T001',
			name: 'Sydney CBD Office Renovation',
			client: 'TechCorp Industries',
			status: 'active',
			priority: 'high',
			dueDate: '2024-02-15',
			progress: 65,
		},
		{
			id: 'T002',
			name: 'Melbourne Warehouse Construction',
			client: 'Logistics Plus',
			status: 'review',
			priority: 'medium',
			dueDate: '2024-02-20',
			progress: 80,
		},
		{
			id: 'T003',
			name: 'Brisbane Retail Complex',
			client: 'Retail Group Ltd',
			status: 'draft',
			priority: 'low',
			dueDate: '2024-03-01',
			progress: 25,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'blue';
			case 'review':
				return 'yellow';
			case 'completed':
				return 'green';
			case 'draft':
				return 'gray';
			default:
				return 'gray';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'red';
			case 'medium':
				return 'yellow';
			case 'low':
				return 'green';
			default:
				return 'gray';
		}
	};

	return (
		<PageWrapper>
			<Subheader>
				<SubheaderLeft>
					<h2 className='text-xl font-semibold'>Tenders Dashboard</h2>
					<p className='text-sm text-gray-600'>
						Manage and track your tender opportunities
					</p>
				</SubheaderLeft>
				<SubheaderRight>
					<Button className='mr-2'>
						<PlusIcon className='mr-2 h-4 w-4' />
						New Tender
					</Button>
					<Button variant='outline'>
						<MagnifyingGlassIcon className='mr-2 h-4 w-4' />
						Advanced Search
					</Button>
				</SubheaderRight>
			</Subheader>

			<Container>
				{/* Stats Cards */}
				<div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
								<DocumentTextIcon className='h-6 w-6 text-blue-600' />
							</div>
							<h3 className='text-2xl font-bold text-gray-900'>
								{stats.totalTenders}
							</h3>
							<p className='text-sm text-gray-600'>Total Tenders</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
								<CheckCircleIcon className='h-6 w-6 text-green-600' />
							</div>
							<h3 className='text-2xl font-bold text-gray-900'>
								{stats.activeTenders}
							</h3>
							<p className='text-sm text-gray-600'>Active Tenders</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100'>
								<ClockIcon className='h-6 w-6 text-yellow-600' />
							</div>
							<h3 className='text-2xl font-bold text-gray-900'>{stats.dueSoon}</h3>
							<p className='text-sm text-gray-600'>Due Soon</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100'>
								<ChartBarIcon className='h-6 w-6 text-purple-600' />
							</div>
							<h3 className='text-2xl font-bold text-gray-900'>{stats.completed}</h3>
							<p className='text-sm text-gray-600'>Completed</p>
						</CardContent>
					</Card>
				</div>

				{/* Recent Tenders */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Tenders</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{recentTenders.map((tender) => (
								<div
									key={tender.id}
									className='flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50'>
									<div className='flex-1'>
										<div className='mb-2 flex items-center gap-3'>
											<h4 className='font-medium text-gray-900'>
												{tender.name}
											</h4>
											<Badge
												color={getStatusColor(tender.status)}
												variant='solid'>
												{tender.status}
											</Badge>
											<Badge
												color={getPriorityColor(tender.priority)}
												variant='outline'>
												{tender.priority}
											</Badge>
										</div>
										<p className='mb-2 text-sm text-gray-600'>
											{tender.client}
										</p>
										<div className='flex items-center gap-4 text-sm text-gray-500'>
											<span>Due: {tender.dueDate}</span>
											<span>Progress: {tender.progress}%</span>
										</div>
										<Progress value={tender.progress} className='mt-2' />
									</div>
									<div className='flex gap-2'>
										<Button size='sm' variant='outline'>
											View
										</Button>
										<Button size='sm'>Edit</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Quick Actions */}
				<div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
								<PlusIcon className='h-8 w-8 text-blue-600' />
							</div>
							<h3 className='mb-2 text-lg font-semibold'>Create Tender</h3>
							<p className='mb-4 text-sm text-gray-600'>
								Start a new tender opportunity
							</p>
							<Button className='w-full'>Get Started</Button>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
								<MagnifyingGlassIcon className='h-8 w-8 text-green-600' />
							</div>
							<h3 className='mb-2 text-lg font-semibold'>Advanced Search</h3>
							<p className='mb-4 text-sm text-gray-600'>
								Find tenders with powerful filters
							</p>
							<Button className='w-full'>Search Now</Button>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100'>
								<TagIcon className='h-8 w-8 text-purple-600' />
							</div>
							<h3 className='mb-2 text-lg font-semibold'>Manage Tags</h3>
							<p className='mb-4 text-sm text-gray-600'>Organize tenders with tags</p>
							<Button className='w-full'>View Tags</Button>
						</CardContent>
					</Card>
				</div>
			</Container>
		</PageWrapper>
	);
};

export default TendersDashboard;
