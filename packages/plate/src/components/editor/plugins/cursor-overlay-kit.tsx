'use client';

import { CursorOverlayPlugin } from '@udecode/plate-selection/react';

import { CursorOverlay } from '@/components/ui/cursor-overlay';

export const CursorOverlayKit = [
	CursorOverlayPlugin.configure({
		render: {
			afterEditable: () => <CursorOverlay />,
		},
	}),
];
