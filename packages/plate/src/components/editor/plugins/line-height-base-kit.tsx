import { BaseLineHeightPlugin } from '@udecode/plate-basic-styles';
import { KEYS } from '@udecode/plate';

export const BaseLineHeightKit = [
	BaseLineHeightPlugin.configure({
		inject: {
			nodeProps: {
				defaultNodeValue: 1.5,
				validNodeValues: [1, 1.2, 1.5, 2, 3],
			},
			targetPlugins: [...KEYS.heading, KEYS.p],
		},
	}),
];
