import type { SlatePluginConfig } from '@udecode/plate';

import {
	BaseFontBackgroundColorPlugin,
	BaseFontColorPlugin,
	BaseFontFamilyPlugin,
	BaseFontSizePlugin,
} from '@udecode/plate-basic-styles';
import { KEYS } from '@udecode/plate';

const options = {
	inject: { targetPlugins: [KEYS.p] },
} satisfies SlatePluginConfig;

export const BaseFontKit = [
	BaseFontColorPlugin.configure(options),
	BaseFontBackgroundColorPlugin.configure(options),
	BaseFontSizePlugin.configure(options),
	BaseFontFamilyPlugin.configure(options),
];
