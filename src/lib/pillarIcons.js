import {
  Compass,
  BarChart3,
  Share2,
  Code,
  Code2,
  Search,
  Target,
  Video,
  Film,
  PenTool,
  Palette,
  Radio,
  Megaphone,
  Layers,
  Globe,
  Cpu,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export const PILLAR_ICON_MAP = {
  Compass,
  BarChart3,
  Share2,
  Code,
  Code2,
  Search,
  Target,
  Video,
  Film,
  PenTool,
  Palette,
  Radio,
  Megaphone,
  Layers,
  Globe,
  Cpu,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles
};

export const PILLAR_ICON_OPTIONS = Object.keys(PILLAR_ICON_MAP);

export function getPillarIcon(iconName) {
  return PILLAR_ICON_MAP[iconName] || Compass;
}
