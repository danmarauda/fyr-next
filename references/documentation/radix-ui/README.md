# Radix UI Primitives Documentation

## Overview

Radix UI is a low-level UI component library focused on accessibility, customization, and developer experience. Perfect for building admin templates with consistent, accessible components.

## Key Principles

### Unstyled Components

- No default styling - complete control over appearance
- Style with any CSS solution (Tailwind, CSS Modules, etc.)
- Consistent API across all components

### Accessibility First

- Follows WAI-ARIA design patterns
- Handles focus management, keyboard navigation
- Screen reader compatible
- ARIA attributes automatically managed

### Open Architecture

- Granular access to component parts
- `asChild` prop for full control
- Event listeners and refs can be added
- Easy to wrap and extend

## Core Components for Admin Templates

### Dialog (Modal)

```tsx
import * as Dialog from '@radix-ui/react-dialog';

export function UserModal({ children, open, onOpenChange }) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 bg-black/50' />
				<Dialog.Content className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6'>
					{children}
					<Dialog.Close className='absolute right-4 top-4'>✕</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
```

### Dropdown Menu

```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function UserActionsMenu({ userId }) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className='rounded p-2 hover:bg-gray-100'>⋮</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content className='rounded border bg-white p-2 shadow-lg'>
					<DropdownMenu.Item
						className='cursor-pointer p-2 hover:bg-gray-100'
						onSelect={() => editUser(userId)}>
						Edit User
					</DropdownMenu.Item>

					<DropdownMenu.Item
						className='cursor-pointer p-2 text-red-600 hover:bg-gray-100'
						onSelect={() => deleteUser(userId)}>
						Delete User
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
```

### Select

```tsx
import * as Select from '@radix-ui/react-select';

export function RoleSelect({ value, onChange }) {
	return (
		<Select.Root value={value} onValueChange={onChange}>
			<Select.Trigger className='flex items-center justify-between rounded border px-3 py-2'>
				<Select.Value />
				<Select.Icon>▼</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content className='rounded border bg-white shadow-lg'>
					<Select.Viewport className='p-2'>
						<Select.Item value='admin' className='cursor-pointer p-2 hover:bg-gray-100'>
							<Select.ItemText>Admin</Select.ItemText>
						</Select.Item>

						<Select.Item value='user' className='cursor-pointer p-2 hover:bg-gray-100'>
							<Select.ItemText>User</Select.ItemText>
						</Select.Item>

						<Select.Item
							value='moderator'
							className='cursor-pointer p-2 hover:bg-gray-100'>
							<Select.ItemText>Moderator</Select.ItemText>
						</Select.Item>
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
```

### Tabs

```tsx
import * as Tabs from '@radix-ui/react-tabs';

export function AdminTabs() {
	return (
		<Tabs.Root defaultValue='users' className='w-full'>
			<Tabs.List className='flex border-b'>
				<Tabs.Trigger
					value='users'
					className='border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500'>
					Users
				</Tabs.Trigger>

				<Tabs.Trigger
					value='settings'
					className='border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500'>
					Settings
				</Tabs.Trigger>

				<Tabs.Trigger
					value='analytics'
					className='border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500'>
					Analytics
				</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value='users' className='p-4'>
				<UsersTab />
			</Tabs.Content>

			<Tabs.Content value='settings' className='p-4'>
				<SettingsTab />
			</Tabs.Content>

			<Tabs.Content value='analytics' className='p-4'>
				<AnalyticsTab />
			</Tabs.Content>
		</Tabs.Root>
	);
}
```

### Toast (Notifications)

```tsx
import * as Toast from '@radix-ui/react-toast';

export function ToastProvider({ children }) {
	return (
		<Toast.Provider>
			{children}
			<Toast.Viewport className='fixed right-4 top-4 z-50' />
		</Toast.Provider>
	);
}

export function SuccessToast({ message, open, onOpenChange }) {
	return (
		<Toast.Root
			open={open}
			onOpenChange={onOpenChange}
			className='rounded bg-green-500 p-4 text-white shadow-lg'>
			<Toast.Title>Success</Toast.Title>
			<Toast.Description>{message}</Toast.Description>
			<Toast.Close className='absolute right-2 top-2'>✕</Toast.Close>
		</Toast.Root>
	);
}
```

### Accordion

```tsx
import * as Accordion from '@radix-ui/react-accordion';

export function FAQAccordion() {
	return (
		<Accordion.Root type='single' collapsible className='w-full'>
			<Accordion.Item value='item-1' className='border-b'>
				<Accordion.Header>
					<Accordion.Trigger className='flex w-full justify-between p-4 text-left'>
						How do I add a new user?
						<span className='accordion-icon'>▼</span>
					</Accordion.Trigger>
				</Accordion.Header>

				<Accordion.Content className='p-4 pt-0'>
					Go to the Users section and click "Add User" button...
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value='item-2' className='border-b'>
				<Accordion.Header>
					<Accordion.Trigger className='flex w-full justify-between p-4 text-left'>
						How do I reset a password?
						<span className='accordion-icon'>▼</span>
					</Accordion.Trigger>
				</Accordion.Header>

				<Accordion.Content className='p-4 pt-0'>
					In the user details, click "Reset Password"...
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	);
}
```

## Advanced Patterns

### Compound Components with asChild

```tsx
import * as Dialog from '@radix-ui/react-dialog';
import { Slot } from '@radix-ui/react-slot';

export function CustomDialog({ children, ...props }) {
	return (
		<Dialog.Root {...props}>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 bg-black/50' />
				<Dialog.Content asChild>
					<div className='fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6'>
						{children}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export function DialogTrigger({ children, asChild, ...props }) {
	return (
		<Dialog.Trigger asChild={asChild} {...props}>
			<Slot>{children}</Slot>
		</Dialog.Trigger>
	);
}
```

### Controlled Components

```tsx
import * as Select from '@radix-ui/react-select';

export function ControlledSelect({ value, onChange, options }) {
	return (
		<Select.Root value={value} onValueChange={onChange}>
			<Select.Trigger className='select-trigger'>
				<Select.Value placeholder='Select an option' />
				<Select.Icon>▼</Select.Icon>
			</Select.Trigger>

			<Select.Content className='select-content'>
				<Select.Viewport>
					{options.map((option) => (
						<Select.Item
							key={option.value}
							value={option.value}
							className='select-item'>
							<Select.ItemText>{option.label}</Select.ItemText>
						</Select.Item>
					))}
				</Select.Viewport>
			</Select.Content>
		</Select.Root>
	);
}
```

### Form Integration

```tsx
import * as Checkbox from '@radix-ui/react-checkbox';

export function UserPermissionsForm() {
	return (
		<form>
			<div className='space-y-4'>
				<div className='flex items-center space-x-2'>
					<Checkbox.Root
						id='read'
						name='permissions'
						value='read'
						className='flex h-4 w-4 items-center justify-center rounded border data-[state=checked]:bg-blue-500'>
						<Checkbox.Indicator className='text-white'>✓</Checkbox.Indicator>
					</Checkbox.Root>
					<label htmlFor='read'>Read Access</label>
				</div>

				<div className='flex items-center space-x-2'>
					<Checkbox.Root
						id='write'
						name='permissions'
						value='write'
						className='flex h-4 w-4 items-center justify-center rounded border data-[state=checked]:bg-blue-500'>
						<Checkbox.Indicator className='text-white'>✓</Checkbox.Indicator>
					</Checkbox.Root>
					<label htmlFor='write'>Write Access</label>
				</div>
			</div>
		</form>
	);
}
```

## Styling Patterns

### Data Attributes

Radix components use data attributes for styling states:

```css
/* Dialog */
[data-state='open'] {
	/* visible state */
}
[data-state='closed'] {
	/* hidden state */
}

/* Tabs */
[data-state='active'] {
	/* active tab */
}
[data-state='inactive'] {
	/* inactive tab */
}

/* Select */
[data-state='checked'] {
	/* checked state */
}
[data-disabled] {
	/* disabled state */
}
```

### Tailwind Integration

```tsx
// Using Tailwind classes with data attributes
<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out">
```

### CSS Variables for Theming

```tsx
// Theme-aware components
<Dialog.Content
  className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg"
  style={{
    '--color-background': theme === 'dark' ? '#1f2937' : '#ffffff',
    '--color-border': theme === 'dark' ? '#374151' : '#e5e7eb',
  }}
>
```

## Accessibility Features

### Focus Management

```tsx
// Dialog automatically manages focus
<Dialog.Root>
	<Dialog.Content>
		{/* Focus is trapped inside when open */}
		<input autoFocus /> {/* First focusable element gets focus */}
	</Dialog.Content>
</Dialog.Root>
```

### Keyboard Navigation

```tsx
// Dropdown menu keyboard support
<DropdownMenu.Root>
	<DropdownMenu.Content>
		<DropdownMenu.Item>
			{' '}
			{/* Arrow keys navigate */}
			Edit (Enter to select)
		</DropdownMenu.Item>
		<DropdownMenu.Item>Delete (Escape to close)</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

### Screen Reader Support

```tsx
// Proper ARIA attributes automatically added
<Dialog.Root>
	<Dialog.Trigger aria-label='Open user menu'>User Menu</Dialog.Trigger>
	<Dialog.Content aria-describedby='dialog-description'>
		<div id='dialog-description'>Manage user account settings</div>
	</Dialog.Content>
</Dialog.Root>
```

## Common Admin Template Components

### Data Table with Sorting

```tsx
import * as Table from '@radix-ui/react-table';

export function DataTable({ data, columns }) {
	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{columns.map((column) => (
						<Table.ColumnHeaderCell key={column.key}>
							{column.label}
						</Table.ColumnHeaderCell>
					))}
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{data.map((row) => (
					<Table.Row key={row.id}>
						{columns.map((column) => (
							<Table.Cell key={column.key}>{row[column.key]}</Table.Cell>
						))}
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
}
```

### Navigation Menu

```tsx
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

export function MainNavigation() {
	return (
		<NavigationMenu.Root>
			<NavigationMenu.List className='flex space-x-4'>
				<NavigationMenu.Item>
					<NavigationMenu.Link href='/dashboard'>Dashboard</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Users ▼</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<div className='rounded border bg-white p-4 shadow-lg'>
							<NavigationMenu.Link href='/users'>All Users</NavigationMenu.Link>
							<NavigationMenu.Link href='/users/invite'>
								Invite User
							</NavigationMenu.Link>
						</div>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	);
}
```

### Context Menu

```tsx
import * as ContextMenu from '@radix-ui/react-context-menu';

export function TableRow({ user }) {
	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger asChild>
				<tr className='cursor-context-menu'>
					<td>{user.name}</td>
					<td>{user.email}</td>
				</tr>
			</ContextMenu.Trigger>

			<ContextMenu.Content className='rounded border bg-white p-2 shadow-lg'>
				<ContextMenu.Item onSelect={() => editUser(user.id)}>Edit User</ContextMenu.Item>
				<ContextMenu.Item onSelect={() => viewUser(user.id)}>View Details</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.Item onSelect={() => deleteUser(user.id)} className='text-red-600'>
					Delete User
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
}
```

## Best Practices

### 1. Use Semantic HTML

```tsx
// Good - uses button element
<Dialog.Trigger asChild>
  <button>Open Dialog</button>
</Dialog.Trigger>

// Avoid - loses semantic meaning
<Dialog.Trigger asChild>
  <div>Open Dialog</div>
</Dialog.Trigger>
```

### 2. Handle Controlled vs Uncontrolled

```tsx
// Controlled - for forms
<Select.Root value={value} onValueChange={setValue}>
  {/* ... */}
</Select.Root>

// Uncontrolled - for simple cases
<Select.Root defaultValue="option1">
  {/* ... */}
</Select.Root>
```

### 3. Portal for Overlays

```tsx
// Always use Portal for overlays to avoid z-index issues
<Dialog.Portal>
	<Dialog.Content>{/* Content renders at end of document */}</Dialog.Content>
</Dialog.Portal>
```

### 4. Animation Integration

```tsx
// Use data attributes for animations
<Dialog.Content
  className="data-[state=open]:animate-in data-[state=closed]:animate-out"
>
```

Radix UI provides the foundation for building accessible, customizable admin interfaces with excellent developer experience and performance.
