'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme='system'
			className='toaster group'
			style={
				{
					'--normal-bg': 'hsl(var(--background))',
					'--normal-fg': 'hsl(var(--foreground))',
					'--normal-border': 'hsl(var(--border))',
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
