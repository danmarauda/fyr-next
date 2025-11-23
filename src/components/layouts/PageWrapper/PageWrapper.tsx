'use client';

import React, { FC, ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import { redirect, usePathname } from 'next/navigation';
import purePathnameUtil from '@/utils/purePathname.util';
import { authClient } from '@/lib/auth-client';

interface IPageWrapperProps {
	children: ReactNode;
	className?: string;
}
const PageWrapper: FC<IPageWrapperProps> = (props) => {
	const { children, className = undefined, ...rest } = props;

	const pathname = usePathname();
	const purePath = purePathnameUtil(pathname || '');
	const { data: session, isPending } = authClient.useSession();

	// Redirect to login if not authenticated and not on login page
	useEffect(() => {
		if (!isPending && !session && purePath !== '/login') {
			redirect('/login');
		}
	}, [session, isPending, purePath]);

	return (
		<main
			data-component-name='PageWrapper'
			className={classNames('flex shrink-0 grow flex-col', className)}
			{...rest}>
			{children}
		</main>
	);
};

export default PageWrapper;
