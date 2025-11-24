'use client';

import { LinkPlugin } from '@udecode/plate-link/react';

import { LinkElement } from '@/components/ui/link-node';
import { LinkFloatingToolbar } from '@/components/ui/link-toolbar';

export const LinkKit = [
	LinkPlugin.configure({
		render: {
			node: LinkElement,
			afterEditable: () => <LinkFloatingToolbar />,
		},
	}),
];
