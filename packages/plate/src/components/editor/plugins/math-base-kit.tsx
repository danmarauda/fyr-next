import { BaseEquationPlugin, BaseInlineEquationPlugin } from '@udecode/plate-math';

import {
	EquationElementStatic,
	InlineEquationElementStatic,
} from '@/components/ui/equation-node-static';

export const BaseMathKit = [
	BaseInlineEquationPlugin.withComponent(InlineEquationElementStatic),
	BaseEquationPlugin.withComponent(EquationElementStatic),
];
