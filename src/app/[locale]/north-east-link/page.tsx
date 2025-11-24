import { Authenticated, Unauthenticated } from 'convex/react';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Subheader from '@/components/layouts/Subheader/Subheader';
import Breadcrumb from '@/components/layouts/Breadcrumb/Breadcrumb';
import { ProjectStats } from '@/components/north-east-link/ProjectStats';
import { ConstructionProgress } from '@/components/north-east-link/ConstructionProgress';
import { ResourceAllocation } from '@/components/north-east-link/ResourceAllocation';

const NorthEastLinkPage = () => {
	return (
		<PageWrapper>
			<Subheader>
				<Breadcrumb />
			</Subheader>
			<div className='space-y-6 p-6'>
				<Authenticated>
					<div className='space-y-6'>
						<ProjectStats projectId='nel-project' />
						<ConstructionProgress projectId='nel-project' />
						<ResourceAllocation projectId='nel-project' />
					</div>
				</Authenticated>
				<Unauthenticated>
					<div className='py-12 text-center'>
						<h2 className='mb-4 text-2xl font-semibold'>
							North East Link Project Dashboard
						</h2>
						<p className='mb-6 text-gray-600'>
							Please sign in to view project details.
						</p>
						<a
							href='/login'
							className='inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
							Sign In
						</a>
					</div>
				</Unauthenticated>
			</div>
		</PageWrapper>
	);
};

export default NorthEastLinkPage;
