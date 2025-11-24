'use client';

import { TocPlugin } from '@udecode/plate-toc/react';

import { TocElement } from '@/components/ui/toc-node';

export const TocKit = [
	TocPlugin.configure({
		options: {
			// isScroll: true,
			topOffset: 80,
		},
	}).withComponent(TocElement),
];
