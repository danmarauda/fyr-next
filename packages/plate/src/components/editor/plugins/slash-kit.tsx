'use client';

import { SlashInputPlugin, SlashPlugin } from '@udecode/plate-slash-command/react';
import { KEYS } from '@udecode/plate';

import { SlashInputElement } from '@/components/ui/slash-node';

export const SlashKit = [
	SlashPlugin.configure({
		options: {
			triggerQuery: (editor) =>
				!editor.api.some({
					match: { type: editor.getType(KEYS.codeBlock) },
				}),
		},
	}),
	SlashInputPlugin.withComponent(SlashInputElement),
];
