import React from 'react';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Container from '@/components/layouts/Container/Container';
import Subheader, { SubheaderLeft } from '@/components/layouts/Subheader/Subheader';
import { Card, CardContent, CardHeader, CardTitle } from '@fyr/ui';
import { Button } from '@fyr/ui';
import { Badge } from '@fyr/ui';
import { PlusIcon, MagnifyingGlassIcon } from 'lucide-react';

const TendersList = () => {
	// Mock data for demonstration
	const tenders = [
		{
			id: 'T001',
			name: 'Sydney CBD Office Renovation',
			client: 'TechCorp Industries',
			status: 'active',
			priority: 'high',
			dueDate: '2024-02-15',
			value: 2500000,
			category: 'renovation',
		},
		{
			id: 'T002',
			name: 'Melbourne Warehouse Construction',
			client: 'Logistics Plus',
			status: 'review',
			priority: 'medium',
			dueDate: '2024-02-20',
			value: 1800000,
			category: 'construction',
		},
		{
			id: 'T003',
			name: 'Brisbane Retail Complex',
			client: 'Retail Group Ltd',
			status: 'draft',
			priority: 'low',
			dueDate: '2024-03-01',
			value: 3200000,
			category: 'construction',
		},
		{
			id: 'T004',
			name: 'Perth Office Fitout',
			client: 'Mining Corp',
			status: 'completed',
			priority: 'medium',
			dueDate: '2024-01-15',
			value: 950000,
			category: 'renovation',
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
					<h2 className='text-xl font-semibold'>All Tenders</h2>
					<p className='text-sm text-gray-600'>
						Manage and track all tender opportunities
					</p>
				</SubheaderLeft>
			</Subheader>

			<Container>
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle>Tenders ({tenders.length})</CardTitle>
							<div className='flex gap-2'>
								<Button variant='outline'>
									<MagnifyingGlassIcon className='mr-2 h-4 w-4' />
									Filter
								</Button>
								<Button>
									<PlusIcon className='mr-2 h-4 w-4' />
									New Tender
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead>
									<tr className='border-b'>
										<th className='p-4 text-left font-medium'>Tender</th>
										<th className='p-4 text-left font-medium'>Client</th>
										<th className='p-4 text-left font-medium'>Category</th>
										<th className='p-4 text-left font-medium'>Status</th>
										<th className='p-4 text-left font-medium'>Priority</th>
										<th className='p-4 text-left font-medium'>Due Date</th>
										<th className='p-4 text-right font-medium'>Value</th>
										<th className='p-4 text-left font-medium'>Actions</th>
									</tr>
								</thead>
								<tbody>
									{tenders.map((tender) => (
										<tr key={tender.id} className='border-b hover:bg-gray-50'>
											<td className='p-4'>
												<div>
													<div className='font-medium'>{tender.name}</div>
													<div className='text-sm text-gray-500'>
														ID: {tender.id}
													</div>
												</div>
											</td>
											<td className='p-4'>{tender.client}</td>
											<td className='p-4'>
												<Badge variant='outline'>{tender.category}</Badge>
											</td>
											<td className='p-4'>
												<Badge color={getStatusColor(tender.status)}>
													{tender.status}
												</Badge>
											</td>
											<td className='p-4'>
												<Badge color={getPriorityColor(tender.priority)}>
													{tender.priority}
												</Badge>
											</td>
											<td className='p-4'>{tender.dueDate}</td>
											<td className='p-4 text-right'>
												${tender.value.toLocaleString()}
											</td>
											<td className='p-4'>
												<div className='flex gap-2'>
													<Button size='sm' variant='outline'>
														View
													</Button>
													<Button size='sm'>Edit</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TendersList;
