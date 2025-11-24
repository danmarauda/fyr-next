# Admin Template Component Examples

## Dashboard Layout Pattern

### Responsive Sidebar Layout

```tsx
// components/layouts/dashboard-layout.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
	children: React.ReactNode;
	sidebar: React.ReactNode;
	header: React.ReactNode;
}

export function DashboardLayout({ children, sidebar, header }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Desktop Sidebar */}
			<div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
				<div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4'>
					{sidebar}
				</div>
			</div>

			{/* Mobile Sidebar */}
			<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
				<SheetContent side='left' className='w-72 p-0'>
					<div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4'>
						{sidebar}
					</div>
				</SheetContent>
			</Sheet>

			{/* Main Content */}
			<div className='lg:pl-72'>
				{/* Header */}
				<div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
					<Sheet>
						<SheetTrigger asChild>
							<Button variant='ghost' size='sm' className='lg:hidden'>
								<Menu className='h-6 w-6' />
							</Button>
						</SheetTrigger>
					</Sheet>
					{header}
				</div>

				{/* Page Content */}
				<main className='py-10'>
					<div className='px-4 sm:px-6 lg:px-8'>{children}</div>
				</main>
			</div>
		</div>
	);
}
```

### Sidebar Navigation

```tsx
// components/navigation/sidebar-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
	name: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	current?: boolean;
}

interface SidebarNavProps {
	items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
	const pathname = usePathname();

	return (
		<nav className='flex flex-1 flex-col'>
			<ul role='list' className='flex flex-1 flex-col gap-y-7'>
				<li>
					<ul role='list' className='-mx-2 space-y-1'>
						{items.map((item) => {
							const isActive = pathname === item.href;
							return (
								<li key={item.name}>
									<Link href={item.href}>
										<Button
											variant={isActive ? 'secondary' : 'ghost'}
											className={cn(
												'w-full justify-start',
												isActive && 'bg-gray-50 text-gray-900',
											)}>
											<item.icon className='mr-3 h-5 w-5' />
											{item.name}
										</Button>
									</Link>
								</li>
							);
						})}
					</ul>
				</li>
			</ul>
		</nav>
	);
}
```

## Data Table Patterns

### Sortable Data Table

```tsx
// components/ui/data-table.tsx
'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Column<T> {
	key: keyof T;
	label: string;
	sortable?: boolean;
	render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	selectable?: boolean;
	onSelectionChange?: (selected: T[]) => void;
}

export function DataTable<T extends { id: string }>({
	data,
	columns,
	selectable = false,
	onSelectionChange,
}: DataTableProps<T>) {
	const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

	const handleSort = (column: keyof T) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortColumn(column);
			setSortDirection('asc');
		}
	};

	const sortedData = [...data].sort((a, b) => {
		if (!sortColumn) return 0;

		const aValue = a[sortColumn];
		const bValue = b[sortColumn];

		if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
		if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
		return 0;
	});

	const handleRowSelect = (id: string, checked: boolean) => {
		const newSelected = new Set(selectedRows);
		if (checked) {
			newSelected.add(id);
		} else {
			newSelected.delete(id);
		}
		setSelectedRows(newSelected);
		onSelectionChange?.(data.filter((row) => newSelected.has(row.id)));
	};

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			const allIds = new Set(data.map((row) => row.id));
			setSelectedRows(allIds);
			onSelectionChange?.(data);
		} else {
			setSelectedRows(new Set());
			onSelectionChange?.([]);
		}
	};

	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						{selectable && (
							<th className='px-6 py-3 text-left'>
								<Checkbox
									checked={selectedRows.size === data.length && data.length > 0}
									onCheckedChange={handleSelectAll}
								/>
							</th>
						)}
						{columns.map((column) => (
							<th
								key={String(column.key)}
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
								{column.sortable ? (
									<Button
										variant='ghost'
										size='sm'
										onClick={() => handleSort(column.key)}
										className='h-auto p-0 font-medium'>
										{column.label}
										{sortColumn === column.key &&
											(sortDirection === 'asc' ? (
												<ChevronUp className='ml-1 h-4 w-4' />
											) : (
												<ChevronDown className='ml-1 h-4 w-4' />
											))}
									</Button>
								) : (
									column.label
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody className='divide-y divide-gray-200 bg-white'>
					{sortedData.map((row) => (
						<tr key={row.id} className='hover:bg-gray-50'>
							{selectable && (
								<td className='whitespace-nowrap px-6 py-4'>
									<Checkbox
										checked={selectedRows.has(row.id)}
										onCheckedChange={(checked) =>
											handleRowSelect(row.id, checked as boolean)
										}
									/>
								</td>
							)}
							{columns.map((column) => (
								<td
									key={String(column.key)}
									className='whitespace-nowrap px-6 py-4'>
									{column.render
										? column.render(row[column.key], row)
										: String(row[column.key])}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
```

## Form Patterns

### CRUD Form with Actions

```tsx
// components/forms/user-form.tsx
'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { createUser, updateUser } from '@/app/actions/user';

interface UserFormProps {
	user?: {
		id: string;
		name: string;
		email: string;
		role: string;
	};
	onSuccess?: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
	const router = useRouter();
	const [state, formAction, isPending] = useActionState(
		user ? updateUser.bind(null, user.id) : createUser,
		null,
	);

	return (
		<form action={formAction} className='space-y-6'>
			<div>
				<Label htmlFor='name'>Name</Label>
				<Input id='name' name='name' defaultValue={user?.name} required />
				{state?.errors?.name && <p className='text-sm text-red-600'>{state.errors.name}</p>}
			</div>

			<div>
				<Label htmlFor='email'>Email</Label>
				<Input id='email' name='email' type='email' defaultValue={user?.email} required />
				{state?.errors?.email && (
					<p className='text-sm text-red-600'>{state.errors.email}</p>
				)}
			</div>

			<div>
				<Label htmlFor='role'>Role</Label>
				<Select name='role' defaultValue={user?.role || 'user'}>
					<SelectTrigger>
						<SelectValue placeholder='Select a role' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='user'>User</SelectItem>
						<SelectItem value='admin'>Admin</SelectItem>
						<SelectItem value='moderator'>Moderator</SelectItem>
					</SelectContent>
				</Select>
				{state?.errors?.role && <p className='text-sm text-red-600'>{state.errors.role}</p>}
			</div>

			{state?.message && <div className='text-sm text-green-600'>{state.message}</div>}

			<div className='flex gap-4'>
				<Button type='submit' disabled={isPending}>
					{isPending ? 'Saving...' : user ? 'Update User' : 'Create User'}
				</Button>

				<Button type='button' variant='outline' onClick={() => router.back()}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
```

## Modal Patterns

### Confirmation Dialog

```tsx
// components/ui/confirm-dialog.tsx
'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
	children: React.ReactNode;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
	children,
	title,
	description,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	onConfirm,
	variant = 'default',
}: ConfirmDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{cancelText}</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
```

## Loading and Error States

### Skeleton Components

```tsx
// components/ui/skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
	return <div className={cn('animate-pulse rounded-md bg-gray-200', className)} {...props} />;
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
	return (
		<div className='space-y-4'>
			{/* Header skeleton */}
			<div className='flex space-x-4'>
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton key={i} className='h-4 flex-1' />
				))}
			</div>

			{/* Row skeletons */}
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div key={rowIndex} className='flex space-x-4'>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<Skeleton key={colIndex} className='h-8 flex-1' />
					))}
				</div>
			))}
		</div>
	);
}

export function CardSkeleton() {
	return (
		<div className='rounded-lg border p-6'>
			<div className='space-y-4'>
				<Skeleton className='h-4 w-3/4' />
				<Skeleton className='h-4 w-1/2' />
				<div className='flex space-x-2'>
					<Skeleton className='h-8 w-20' />
					<Skeleton className='h-8 w-20' />
				</div>
			</div>
		</div>
	);
}
```

### Error Boundary

```tsx
// components/error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className='flex min-h-[400px] flex-col items-center justify-center p-8 text-center'>
					<h2 className='mb-4 text-2xl font-semibold text-gray-900'>
						Something went wrong
					</h2>
					<p className='mb-6 text-gray-600'>
						We encountered an unexpected error. Please try again.
					</p>
					<Button onClick={() => this.setState({ hasError: false, error: undefined })}>
						Try Again
					</Button>
					{process.env.NODE_ENV === 'development' && this.state.error && (
						<details className='mt-6 text-left'>
							<summary className='cursor-pointer text-sm text-gray-500'>
								Error Details
							</summary>
							<pre className='mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs'>
								{this.state.error.stack}
							</pre>
						</details>
					)}
				</div>
			);
		}

		return this.props.children;
	}
}
```

## Toast Notifications

### Toast System

```tsx
// components/ui/toast.tsx
'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Viewport>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
			className,
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
	{
		variants: {
			variant: {
				default: 'border bg-background text-foreground',
				destructive:
					'destructive border-destructive bg-destructive text-destructive-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

const Toast = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
	return (
		<ToastPrimitives.Root
			ref={ref}
			className={cn(toastVariants({ variant }), className)}
			{...props}
		/>
	);
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Action>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			'ring-offset-background hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Close>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			'text-foreground/50 hover:text-foreground absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
			className,
		)}
		toast-close=''
		{...props}>
		<X className='h-4 w-4' />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Title>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn('text-sm font-semibold', className)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Description>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn('text-sm opacity-90', className)}
		{...props}
	/>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
	type ToastProps,
	type ToastActionElement,
	ToastProvider,
	ToastViewport,
	Toast,
	ToastTitle,
	ToastDescription,
	ToastClose,
	ToastAction,
};
```

### Toast Hook

```tsx
// hooks/use-toast.ts
'use client';

import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: ToastActionElement;
};

const actionTypes = {
	ADD_TOAST: 'ADD_TOAST',
	UPDATE_TOAST: 'UPDATE_TOAST',
	DISMISS_TOAST: 'DISMISS_TOAST',
	REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
	| {
			type: ActionType['ADD_TOAST'];
			toast: ToasterToast;
	  }
	| {
			type: ActionType['UPDATE_TOAST'];
			toast: Partial<ToasterToast>;
	  }
	| {
			type: ActionType['DISMISS_TOAST'];
			toastId?: ToasterToast['id'];
	  }
	| {
			type: ActionType['REMOVE_TOAST'];
			toastId?: ToasterToast['id'];
	  };

interface State {
	toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
	if (toastTimeouts.has(toastId)) {
		return;
	}

	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		dispatch({
			type: 'REMOVE_TOAST',
			toastId: toastId,
		});
	}, TOAST_REMOVE_DELAY);

	toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'ADD_TOAST':
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			};

		case 'UPDATE_TOAST':
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === action.toast.id ? { ...t, ...action.toast } : t,
				),
			};

		case 'DISMISS_TOAST': {
			const { toastId } = action;

			if (toastId) {
				addToRemoveQueue(toastId);
			} else {
				state.toasts.forEach((toast) => {
					addToRemoveQueue(toast.id);
				});
			}

			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === toastId || toastId === undefined
						? {
								...t,
								open: false,
							}
						: t,
				),
			};
		}
		case 'REMOVE_TOAST':
			if (action.toastId === undefined) {
				return {
					...state,
					toasts: [],
				};
			}
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId),
			};
	}
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
	memoryState = reducer(memoryState, action);
	listeners.forEach((listener) => {
		listener(memoryState);
	});
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...props }: Toast) {
	const id = genId();

	const update = (props: ToasterToast) =>
		dispatch({
			type: 'UPDATE_TOAST',
			toast: { ...props, id },
		});
	const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

	dispatch({
		type: 'ADD_TOAST',
		toast: {
			...props,
			id,
			open: true,
			onOpenChange: (open) => {
				if (!open) dismiss();
			},
		},
	});

	return {
		id: id,
		dismiss,
		update,
	};
}

function useToast() {
	const [state, setState] = React.useState<State>(memoryState);

	React.useEffect(() => {
		listeners.push(setState);
		return () => {
			const index = listeners.indexOf(setState);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		};
	}, [state]);

	return {
		...state,
		toast,
		dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
	};
}

export { useToast, toast };
```

These patterns provide a solid foundation for building comprehensive admin interfaces with modern React patterns, excellent user experience, and maintainable code architecture.
