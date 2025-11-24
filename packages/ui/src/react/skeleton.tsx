'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export const useMounted = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return isMounted;
};

export const Skeleton = ({
	className,
	variant = 'primary',
	...props
}: React.ComponentProps<'div'> & {
	variant?: 'primary' | 'secondary' | 'tertiary';
}) => {
	const isMounted = useMounted();

	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={cn(
				'animate-pulse rounded-md',
				{
					'bg-gray-200 dark:bg-gray-700': variant === 'primary',
					'bg-gray-300 dark:bg-gray-600': variant === 'secondary',
					'bg-gray-100 dark:bg-gray-800': variant === 'tertiary',
				},
				className,
			)}
			{...props}
		/>
	);
};
