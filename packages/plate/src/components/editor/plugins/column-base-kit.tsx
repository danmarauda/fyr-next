import { BaseColumnItemPlugin, BaseColumnPlugin } from '@udecode/plate-layout';

import { ColumnElementStatic, ColumnGroupElementStatic } from '@/components/ui/column-node-static';

export const BaseColumnKit = [
	BaseColumnPlugin.withComponent(ColumnGroupElementStatic),
	BaseColumnItemPlugin.withComponent(ColumnElementStatic),
];
