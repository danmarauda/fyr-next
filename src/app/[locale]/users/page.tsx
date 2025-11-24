import React from 'react';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Container from '@/components/layouts/Container/Container';
import Subheader, { SubheaderLeft, SubheaderRight } from '@/components/layouts/Subheader/Subheader';
import { Card, CardContent, CardHeader, CardTitle } from '@alias/ui';
import { Button } from '@alias/ui';
import { Badge } from '@alias/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@alias/ui';
import { Users, Plus, Search, MoreVertical, Shield, Clock, CheckCircle } from 'lucide-react';

const UserManagement = () => {
	// Mock data for users
	const users = [
		{
			id: '1',
			name: 'John Smith',
			email: 'john.smith@company.com',
			role: 'admin',
			department: 'Management',
			status: 'active',
			lastActive: '2024-01-15T10:30:00Z',
			avatar: '/avatars/john.jpg',
		},
		{
			id: '2',
			name: 'Sarah Johnson',
			email: 'sarah.johnson@company.com',
			role: 'manager',
			department: 'Operations',
			status: 'active',
			lastActive: '2024-01-15T09:15:00Z',
			avatar: '/avatars/sarah.jpg',
		},
		{
			id: '3',
			name: 'Mike Wilson',
			email: 'mike.wilson@company.com',
			role: 'bid_manager',
			department: 'Business Development',
			status: 'active',
			lastActive: '2024-01-14T16:45:00Z',
			avatar: '/avatars/mike.jpg',
		},
		{
			id: '4',
			name: 'Emily Davis',
			email: 'emily.davis@company.com',
			role: 'estimator',
			department: 'Finance',
			status: 'inactive',
			lastActive: '2024-01-10T14:20:00Z',
			avatar: '/avatars/emily.jpg',
		},
		{
			id: '5',
			name: 'Robert Chen',
			email: 'robert.chen@company.com',
			role: 'reviewer',
			department: 'Legal',
			status: 'active',
			lastActive: '2024-01-15T11:00:00Z',
			avatar: '/avatars/robert.jpg',
		},
	];

	const roleStats = {
		admin: 2,
		manager: 5,
		bid_manager: 8,
		estimator: 12,
		reviewer: 6,
		viewer: 15,
	};

	const getRoleColor = (role: string) => {
		switch (role) {
			case 'admin':
				return 'red';
			case 'manager':
				return 'blue';
			case 'bid_manager':
				return 'green';
			case 'estimator':
				return 'yellow';
			case 'reviewer':
				return 'purple';
			case 'viewer':
				return 'gray';
			default:
				return 'gray';
		}
	};

	const getRoleLabel = (role: string) => {
		switch (role) {
			case 'admin':
				return 'Admin';
			case 'manager':
				return 'Manager';
			case 'bid_manager':
				return 'Bid Manager';
			case 'estimator':
				return 'Estimator';
			case 'reviewer':
				return 'Reviewer';
			case 'viewer':
				return 'Viewer';
			default:
				return role;
		}
	};

	const getStatusIcon = (status: string) => {
		return status === 'active' ? (
			<CheckCircle className='h-4 w-4 text-green-500' />
		) : (
			<Clock className='h-4 w-4 text-gray-500' />
		);
	};

	const formatLastActive = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

		if (diffInHours < 1) return 'Just now';
		if (diffInHours < 24) return `${diffInHours}h ago`;
		if (diffInHours < 48) return 'Yesterday';
		return date.toLocaleDateString();
	};

	return (
		<PageWrapper>
			<Subheader>
				<SubheaderLeft>
					<h2 className='text-xl font-semibold'>User Management</h2>
					<p className='text-sm text-gray-600'>Manage users, roles, and permissions</p>
				</SubheaderLeft>
				<SubheaderRight>
					<Button className='mr-2'>
						<Plus className='mr-2 h-4 w-4' />
						Add User
					</Button>
					<Button variant='outline'>
						<Search className='mr-2 h-4 w-4' />
						Search Users
					</Button>
				</SubheaderRight>
			</Subheader>

			<Container>
				{/* Role Statistics */}
				<div className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
					{Object.entries(roleStats).map(([role, count]) => (
						<Card key={role} className='text-center'>
							<CardContent className='pt-6'>
								<div className='mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
									<Shield className='h-4 w-4 text-blue-600' />
								</div>
								<h3 className='text-lg font-bold text-gray-900'>{count}</h3>
								<p className='text-xs text-gray-600'>{getRoleLabel(role)}</p>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Users Table */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Users className='h-5 w-5' />
							All Users
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead>
									<tr className='border-b'>
										<th className='pb-3 text-left text-sm font-medium text-gray-900'>
											User
										</th>
										<th className='pb-3 text-left text-sm font-medium text-gray-900'>
											Role
										</th>
										<th className='pb-3 text-left text-sm font-medium text-gray-900'>
											Department
										</th>
										<th className='pb-3 text-left text-sm font-medium text-gray-900'>
											Status
										</th>
										<th className='pb-3 text-left text-sm font-medium text-gray-900'>
											Last Active
										</th>
										<th className='pb-3 text-right text-sm font-medium text-gray-900'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr key={user.id} className='border-b hover:bg-gray-50'>
											<td className='py-4'>
												<div className='flex items-center gap-3'>
													<Avatar className='h-8 w-8'>
														<AvatarImage
															src={user.avatar}
															alt={user.name}
														/>
														<AvatarFallback>
															{user.name
																.split(' ')
																.map((n) => n[0])
																.join('')}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className='font-medium text-gray-900'>
															{user.name}
														</p>
														<p className='text-sm text-gray-500'>
															{user.email}
														</p>
													</div>
												</div>
											</td>
											<td className='py-4'>
												<Badge
													color={getRoleColor(user.role)}
													variant='solid'
													className='text-xs'>
													{getRoleLabel(user.role)}
												</Badge>
											</td>
											<td className='py-4 text-sm text-gray-900'>
												{user.department}
											</td>
											<td className='py-4'>
												<div className='flex items-center gap-2'>
													{getStatusIcon(user.status)}
													<span className='text-sm capitalize text-gray-900'>
														{user.status}
													</span>
												</div>
											</td>
											<td className='py-4 text-sm text-gray-500'>
												{formatLastActive(user.lastActive)}
											</td>
											<td className='py-4 text-right'>
												<Button size='sm' variant='ghost'>
													<MoreVertical className='h-4 w-4' />
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>

				{/* Quick Actions */}
				<div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
								<Plus className='h-8 w-8 text-blue-600' />
							</div>
							<h3 className='mb-2 text-lg font-semibold'>Add New User</h3>
							<p className='mb-4 text-sm text-gray-600'>
								Invite team members to join
							</p>
							<Button className='w-full'>Add User</Button>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
								<Shield className='h-8 w-8 text-green-600' />
							</div>
							<h3 className='mb-2 text-lg font-semibold'>Manage Roles</h3>
							<p className='mb-4 text-sm text-gray-600'>Configure user permissions</p>
							<Button className='w-full'>Manage Roles</Button>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='text-center'>
							<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100'>
								<Users className='h-8 w-8 text-purple-600' />
							</div>
							<h3 className='mb-2 text-lg font-semibold'>User Reports</h3>
							<p className='mb-4 text-sm text-gray-600'>
								View user activity analytics
							</p>
							<Button className='w-full'>View Reports</Button>
						</CardContent>
					</Card>
				</div>
			</Container>
		</PageWrapper>
	);
};

export default UserManagement;
