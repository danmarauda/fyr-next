'use client';

import { LineHeightPlugin } from '@udecode/plate-basic-styles/react';
import { KEYS } from '@udecode/plate';

export const LineHeightKit = [
	LineHeightPlugin.configure({
		inject: {
			nodeProps: {
				defaultNodeValue: 1.5,
				validNodeValues: [1, 1.2, 1.5, 2, 3],
			},
			targetPlugins: [...KEYS.heading, KEYS.p],
		},
	}),
];
