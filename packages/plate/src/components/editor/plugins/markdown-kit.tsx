import { MarkdownPlugin, remarkMdx, remarkMention } from '@udecode/plate-markdown';
import { KEYS } from '@udecode/plate';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export const MarkdownKit = [
	MarkdownPlugin.configure({
		options: {
			plainMarks: [KEYS.suggestion, KEYS.comment],
			remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkMention],
		},
	}),
];
