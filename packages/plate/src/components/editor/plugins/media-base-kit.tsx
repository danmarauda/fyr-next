import { BaseCaptionPlugin } from '@udecode/plate-caption';
import {
	BaseAudioPlugin,
	BaseFilePlugin,
	BaseImagePlugin,
	BaseMediaEmbedPlugin,
	BasePlaceholderPlugin,
	BaseVideoPlugin,
} from '@udecode/plate-media';
import { KEYS } from '@udecode/plate';

import { AudioElementStatic } from '@/components/ui/media-audio-node-static';
import { FileElementStatic } from '@/components/ui/media-file-node-static';
import { ImageElementStatic } from '@/components/ui/media-image-node-static';
import { VideoElementStatic } from '@/components/ui/media-video-node-static';

export const BaseMediaKit = [
	BaseImagePlugin.withComponent(ImageElementStatic),
	BaseVideoPlugin.withComponent(VideoElementStatic),
	BaseAudioPlugin.withComponent(AudioElementStatic),
	BaseFilePlugin.withComponent(FileElementStatic),
	BaseCaptionPlugin.configure({
		options: {
			query: {
				allow: [KEYS.img, KEYS.video, KEYS.audio, KEYS.file, KEYS.mediaEmbed],
			},
		},
	}),
	BaseMediaEmbedPlugin,
	BasePlaceholderPlugin,
];
