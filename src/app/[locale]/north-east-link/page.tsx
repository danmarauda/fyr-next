import React from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { Authenticated, Unauthenticated } from 'convex/react';
import { PageWrapper } from '@/components/layouts/PageWrapper/PageWrapper';
import { Subheader } from '@/components/layouts/Subheader/Subheader';
import { Breadcrumb } from '@/components/layouts/Breadcrumb/Breadcrumb';
import { ProjectStats } from '@/components/north-east-link/ProjectStats';
import { ConstructionProgress } from '@/components/north-east-link/ConstructionProgress';
import { ResourceAllocation } from '@/components/north-east-link/ResourceAllocation';

export default function NorthEastLinkDashboard() {
	return (
		<PageWrapper isProtected={true}>
			<Authenticated>
				<DashboardContent />
			</Authenticated>
			<Unauthenticated>
				<div className='flex h-96 items-center justify-center'>
					<div className='text-center'>
						<h2 className='mb-4 text-2xl font-bold'>Access Denied</h2>
						<p className='mb-4 text-gray-600 dark:text-gray-400'>
							Please sign in to access the North East Link Dashboard
						</p>
						<a
							href='/workos-login'
							className='inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
							Sign In
						</a>
					</div>
				</div>
			</Unauthenticated>
		</PageWrapper>
	);
}

function DashboardContent() {
	// Using a sample project ID - in real app, this would come from URL params or context
	const projectId = 'sample-project-id';

	return (
		<>
			<Subheader>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Breadcrumb pageName='North East Link Dashboard' />
					</div>
					<UserMenu />
				</div>
			</Subheader>

			<div className='container mx-auto px-4 py-6'>
				<div className='space-y-6'>
					{/* Project Overview Stats */}
					<ProjectStats projectId={projectId} />

					<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
						{/* Construction Progress Chart */}
						<ConstructionProgress projectId={projectId} />

						{/* Resource Allocation */}
						<ResourceAllocation projectId={projectId} />
					</div>
				</div>
			</div>
		</>
	);
}

function UserMenu() {
	const { user, signOut } = useAuth();

	return (
		<div className='flex items-center gap-4'>
			<div className='text-sm text-gray-600 dark:text-gray-400'>{user?.email}</div>
			<button
				onClick={signOut}
				className='rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700'>
				Sign Out
			</button>
		</div>
	);
}
