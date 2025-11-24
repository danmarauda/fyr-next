'use client';

import { ListPlugin } from '@udecode/plate-list/react';
import { KEYS } from '@udecode/plate';

import { IndentKit } from './indent-kit';
import { BlockList } from '@/components/ui/block-list';

export const ListKit = [
	...IndentKit,
	ListPlugin.configure({
		inject: {
			targetPlugins: [
				...KEYS.heading,
				KEYS.p,
				KEYS.blockquote,
				KEYS.codeBlock,
				KEYS.toggle,
				KEYS.img,
			],
		},
		render: {
			belowNodes: BlockList,
		},
	}),
];
