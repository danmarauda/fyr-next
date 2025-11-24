import { BaseListPlugin } from '@udecode/plate-list';
import { KEYS } from '@udecode/plate';

import { BaseIndentKit } from './indent-base-kit';
import { BlockListStatic } from '@/components/ui/block-list-static';

export const BaseListKit = [
	...BaseIndentKit,
	BaseListPlugin.configure({
		inject: {
			targetPlugins: [...KEYS.heading, KEYS.p, KEYS.blockquote, KEYS.codeBlock, KEYS.toggle],
		},
		render: {
			belowNodes: BlockListStatic,
		},
	}),
];
