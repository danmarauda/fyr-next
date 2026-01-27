import React from 'react';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Subheader from '@/components/layouts/Subheader/Subheader';
import Breadcrumb from '@/components/layouts/Breadcrumb/Breadcrumb';

const NorthEastLinkPage = () => {
	return (
		<PageWrapper>
			<Subheader>
				<Breadcrumb />
			</Subheader>
			<div className='space-y-6 p-6'>
				<div className='py-12 text-center'>
					<h2 className='mb-4 text-2xl font-semibold'>
						North East Link Project Dashboard
					</h2>
					<p className='mb-6 text-gray-600'>
						Project dashboard coming soon. Please check back later.
					</p>
					<a
						href='/login'
						className='inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
						Go to Login
					</a>
				</div>
			</div>
		</PageWrapper>
	);
};

export default NorthEastLinkPage;
