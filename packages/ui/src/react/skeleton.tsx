import type React from 'react';

import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';

export function Skeleton({
	className,
	variant = 'primary',
	...props
}: React.ComponentProps<'div'> & {
	variant?: 'primary' | 'secondary';
}) {
	return (
		<div
			className={cn(
				'bg-muted animate-pulse rounded-md',
				variant === 'secondary' && 'bg-zinc-300',
				className,
			)}
			{...props}
		/>
	);
}

export function WithSkeleton({
	children,
	className,
	isLoading,
	...props
}: React.ComponentProps<'div'> & {
	isLoading?: boolean;
}) {
	const mounted = useMounted();

	return (
		<div className={cn('relative', className)} {...props}>
			{children}

			{(!mounted || isLoading) && (
				<>
					<div className={cn('bg-background absolute inset-0')} />

					<Skeleton className={cn('absolute inset-0', className)} />
				</>
			)}
		</div>
	);
}
