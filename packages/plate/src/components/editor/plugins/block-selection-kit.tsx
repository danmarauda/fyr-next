'use client';

import { AIChatPlugin } from '@udecode/plate-ai/react';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import { getPluginTypes, isHotkey, KEYS } from '@udecode/plate';

import { BlockSelection } from '@/components/ui/block-selection';

export const BlockSelectionKit = [
	BlockSelectionPlugin.configure(({ editor }) => ({
		options: {
			enableContextMenu: true,
			isSelectable: (element) => {
				return !getPluginTypes(editor, [KEYS.column, KEYS.codeLine, KEYS.td]).includes(
					element.type,
				);
			},
			onKeyDownSelecting: (editor, e) => {
				if (isHotkey('mod+j')(e)) {
					editor.getApi(AIChatPlugin).aiChat.show();
				}
			},
		},
		render: {
			belowRootNodes: (props) => {
				if (!props.attributes.className?.includes('slate-selectable')) return null;

				return <BlockSelection {...(props as any)} />;
			},
		},
	})),
];
