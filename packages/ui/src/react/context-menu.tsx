'use client';

import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '../lib/utils';

const ContextMenu = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) => {
	return <ContextMenuPrimitive.Root data-slot='context-menu' {...props} />;
};

const ContextMenuTrigger = ({
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) => {
	return <ContextMenuPrimitive.Trigger data-slot='context-menu-trigger' {...props} />;
};

const ContextMenuGroup = ({
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) => {
	return <ContextMenuPrimitive.Group data-slot='context-menu-group' {...props} />;
};

const ContextMenuPortal = ({
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) => {
	return <ContextMenuPrimitive.Portal data-slot='context-menu-portal' {...props} />;
};

const ContextMenuSub = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) => {
	return <ContextMenuPrimitive.Sub data-slot='context-menu-sub' {...props} />;
};

const ContextMenuRadioGroup = ({
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) => {
	return <ContextMenuPrimitive.RadioGroup data-slot='context-menu-radio-group' {...props} />;
};

const ContextMenuSubTrigger = ({
	className,
	inset,
	children,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
	inset?: boolean;
}) => {
	return (
		<ContextMenuPrimitive.SubTrigger
			className={cn(
				"outline-hidden focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm data-[inset]:pl-8 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			data-inset={inset}
			data-slot='context-menu-sub-trigger'
			{...props}>
			{children}
			<ChevronRightIcon className='ml-auto' />
		</ContextMenuPrimitive.SubTrigger>
	);
};

const ContextMenuSubContent = ({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) => {
	return (
		<ContextMenuPrimitive.SubContent
			className={cn(
				'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 origin-(--radix-context-menu-content-transform-origin) bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
				className,
			)}
			data-slot='context-menu-sub-content'
			{...props}
		/>
	);
};

const ContextMenuContent = ({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) => {
	return (
		<ContextMenuPrimitive.Portal>
			<ContextMenuPrimitive.Content
				className={cn(
					'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin) bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in z-50 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border p-1 shadow-md',
					className,
				)}
				data-slot='context-menu-content'
				{...props}
			/>
		</ContextMenuPrimitive.Portal>
	);
};

const ContextMenuItem = ({
	className,
	inset,
	variant = 'default',
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
	inset?: boolean;
	variant?: 'default' | 'destructive';
}) => {
	return (
		<ContextMenuPrimitive.Item
			className={cn(
				"data-[variant=destructive]:*:[svg]:!text-destructive outline-hidden focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			data-inset={inset}
			data-slot='context-menu-item'
			data-variant={variant}
			{...props}
		/>
	);
};

const ContextMenuCheckboxItem = ({
	className,
	children,
	checked,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) => {
	return (
		<ContextMenuPrimitive.CheckboxItem
			checked={checked}
			className={cn(
				"outline-hidden focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			data-slot='context-menu-checkbox-item'
			{...props}>
			<span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
				<ContextMenuPrimitive.ItemIndicator>
					<CheckIcon className='size-4' />
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.CheckboxItem>
	);
};

const ContextMenuRadioItem = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) => {
	return (
		<ContextMenuPrimitive.RadioItem
			className={cn(
				"outline-hidden focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			data-slot='context-menu-radio-item'
			{...props}>
			<span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
				<ContextMenuPrimitive.ItemIndicator>
					<CircleIcon className='size-2 fill-current' />
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.RadioItem>
	);
};

const ContextMenuLabel = ({
	className,
	inset,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
	inset?: boolean;
}) => {
	return (
		<ContextMenuPrimitive.Label
			className={cn(
				'text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
				className,
			)}
			data-inset={inset}
			data-slot='context-menu-label'
			{...props}
		/>
	);
};

const ContextMenuSeparator = ({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) => {
	return (
		<ContextMenuPrimitive.Separator
			className={cn('bg-border -mx-1 my-1 h-px', className)}
			data-slot='context-menu-separator'
			{...props}
		/>
	);
};

const ContextMenuShortcut = ({ className, ...props }: React.ComponentProps<'span'>) => {
	return (
		<span
			className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
			data-slot='context-menu-shortcut'
			{...props}
		/>
	);
};

export {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuCheckboxItem,
	ContextMenuRadioItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuGroup,
	ContextMenuPortal,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuRadioGroup,
};
