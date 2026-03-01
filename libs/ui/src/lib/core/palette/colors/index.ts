import { CSSColor } from '../../types/branded';

import { Slate } from './slate';
import { Gray } from './gray';
import { Zinc } from './zinc';
import { Neutral } from './neutral';
import { Stone } from './stone';
import { Red } from './red';
import { Orange } from './orange';
import { Amber } from './amber';
import { Yellow } from './yellow';
import { Lime } from './lime';
import { Green } from './green';
import { Emerald } from './emerald';
import { Teal } from './teal';
import { Cyan } from './cyan';
import { Sky } from './sky';
import { Blue } from './blue';
import { Indigo } from './indigo';
import { Violet } from './violet';
import { Purple } from './purple';
import { Fuchsia } from './fuchsia';
import { Pink } from './pink';
import { Rose } from './rose';

export const White = '#ffffff' as CSSColor;
export const Black = '#000000' as CSSColor;
export const Transparent = 'transparent' as CSSColor;

export const GlintColor = {
  Slate, Gray, Zinc, Neutral, Stone,
  Red, Orange, Amber, Yellow, Lime,
  Green, Emerald, Teal, Cyan, Sky,
  Blue, Indigo, Violet, Purple, Fuchsia,
  Pink, Rose,
  White, Black, Transparent,
} as const;

// Re-export individual scales for tree-shaking
export { Slate, Gray, Zinc, Neutral, Stone, Red, Orange, Amber, Yellow, Lime, Green, Emerald, Teal, Cyan, Sky, Blue, Indigo, Violet, Purple, Fuchsia, Pink, Rose };
