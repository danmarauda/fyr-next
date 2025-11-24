'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper';
import Button from '@/components/ui/Button';
import LogoTemplate from '@/templates/layouts/Logo/Logo.template';
import Link from 'next/link';

export default function WorkOSLoginPage() {
	const { user, loading } = useAuth();
	const router = useRouter();

	// Redirect if already authenticated
	React.useEffect(() => {
		if (user && !loading) {
			router.push('/north-east-link');
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<PageWrapper className='bg-white dark:bg-inherit'>
				<div className='container mx-auto flex h-full items-center justify-center'>
					<div className='flex max-w-sm flex-col items-center gap-8'>
						<div className='animate-pulse'>
							<LogoTemplate className='h-12' />
						</div>
						<div className='text-gray-500'>Loading...</div>
					</div>
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper className='bg-white dark:bg-inherit'>
			<div className='container mx-auto flex h-full items-center justify-center'>
				<div className='flex max-w-sm flex-col gap-8'>
					{/* Logo */}
					<div>
						<Link href='/' aria-label='Logo'>
							<LogoTemplate className='h-12' />
						</Link>
					</div>

					{/* Title */}
					<div>
						<span className='text-4xl font-semibold'>Welcome to North East Link</span>
					</div>

					{/* Description */}
					<div>
						<span className='text-gray-600 dark:text-gray-400'>
							Sign in to access the North East Link construction management platform
						</span>
					</div>

					{/* AuthKit Sign In */}
					<div className='flex flex-col gap-4'>
						<Button
							size='lg'
							variant='solid'
							color='blue'
							className='w-full font-semibold'
							onClick={() => router.push('/sign-in')}>
							Sign in with WorkOS
						</Button>
					</div>

					{/* Additional Info */}
					<div className='text-center'>
						<span className='text-sm text-gray-500 dark:text-gray-400'>
							By signing in, you agree to our terms and privacy policy
						</span>
					</div>

					<div className='border border-zinc-500/25 dark:border-zinc-500/50' />

					{/* Demo Access */}
					<div className='text-center'>
						<span className='text-sm text-gray-500 dark:text-gray-400'>
							Demo access available with test credentials
						</span>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
}
