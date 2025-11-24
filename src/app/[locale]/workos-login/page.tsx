'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import { Button } from '@alias/ui';
import LogoTemplate from '@/templates/layouts/Logo/Logo.template';
import Link from 'next/link';

const WorkOSLoginPage = () => {
	const router = useRouter();

	const handleLogin = () => {
		router.push('/login');
	};

	return (
		<PageWrapper>
			<div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
				<div className='w-full max-w-md space-y-8 p-8'>
					<div className='text-center'>
						<LogoTemplate className='mx-auto h-12 w-auto' />
						<h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
							Sign in to your account
						</h2>
						<p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
							Or{' '}
							<Link
								href='/signup'
								className='font-medium text-blue-600 hover:text-blue-500'>
								create a new account
							</Link>
						</p>
					</div>
					<div className='mt-8 space-y-6'>
						<Button onClick={handleLogin} className='w-full'>
							Sign In
						</Button>
						<div className='text-center'>
							<Link href='/' className='text-sm text-gray-600 hover:text-gray-500'>
								Back to home
							</Link>
						</div>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
};

export default WorkOSLoginPage;
