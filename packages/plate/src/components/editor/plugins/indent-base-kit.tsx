import { BaseIndentPlugin } from '@udecode/plate-indent';
import { KEYS } from '@udecode/plate';

export const BaseIndentKit = [
	BaseIndentPlugin.configure({
		inject: {
			targetPlugins: [...KEYS.heading, KEYS.p, KEYS.blockquote, KEYS.codeBlock, KEYS.toggle],
		},
		options: {
			offset: 24,
		},
	}),
];
