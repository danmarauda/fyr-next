import React from 'react';

// Stub UI components for development
export const Card = ({ children, className, ...props }: any) =>
	React.createElement(
		'div',
		{
			className: `bg-white rounded-lg border shadow ${className || ''}`,
			...props,
		},
		children,
	);

export const CardContent = ({ children, className, ...props }: any) =>
	React.createElement(
		'div',
		{
			className: `p-6 ${className || ''}`,
			...props,
		},
		children,
	);

export const CardHeader = ({ children, className, ...props }: any) =>
	React.createElement(
		'div',
		{
			className: `p-6 pb-0 ${className || ''}`,
			...props,
		},
		children,
	);

export const CardTitle = ({ children, className, ...props }: any) =>
	React.createElement(
		'h3',
		{
			className: `text-lg font-semibold ${className || ''}`,
			...props,
		},
		children,
	);

export const Button = ({ children, className, ...props }: any) =>
	React.createElement(
		'button',
		{
			className: `px-4 py-2 bg-blue-600 text-white rounded ${className || ''}`,
			...props,
		},
		children,
	);

export const Badge = ({ children, className, ...props }: any) =>
	React.createElement(
		'span',
		{
			className: `px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs ${className || ''}`,
			...props,
		},
		children,
	);

export const Avatar = ({ children, className, ...props }: any) =>
	React.createElement(
		'div',
		{
			className: `relative flex size-8 shrink-0 overflow-hidden rounded-full ${className || ''}`,
			...props,
		},
		children,
	);

export const AvatarImage = ({ className, ...props }: any) =>
	React.createElement('img', {
		className: `aspect-square size-full ${className || ''}`,
		...props,
	});

export const AvatarFallback = ({ children, className, ...props }: any) =>
	React.createElement(
		'div',
		{
			className: `bg-muted flex size-full items-center justify-center rounded-full ${className || ''}`,
			...props,
		},
		children,
	);

export const Progress = ({ value, className, ...props }: any) =>
	React.createElement(
		'div',
		{
			className: `relative h-2 w-full overflow-hidden rounded-full bg-primary/20 ${className || ''}`,
			...props,
		},
		React.createElement('div', {
			className: 'h-full w-full flex-1 bg-primary transition-all',
			style: { width: `${value || 0}%` },
		}),
	);
