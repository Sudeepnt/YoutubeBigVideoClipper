import {
  OPUS_CAPTION_TEMPLATES,
  OPUS_FONT_FAMILIES,
  OPUS_TRANSITION_STYLES,
  formatOpusFontLabel,
  formatOpusTemplateLabel
} from './opusBrandTemplates';
import type { OpusCaptionTemplate } from './opusBrandTemplates';

export type CaptionPlacement = 'top' | 'middle' | 'bottom';

export interface CaptionPreset {
  id: string;
  templateId: string;
  label: string;
  fontFamily: string;
  fontSize: number;
  primaryColor: string;
  secondaryColor: string;
  outlineColor: string;
  backColor: string;
  bold: boolean;
  italic: boolean;
  outline: number;
  shadow: number;
  borderStyle: 1 | 3;
  uppercase?: boolean;
  letterSpacing?: number;
  transitionStyleId?: string;
}

export { OPUS_FONT_FAMILIES, OPUS_TRANSITION_STYLES };

const toNumber = (value: number | string | undefined, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  const parsed = typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
};

const hasBoldStyle = (styles?: readonly string[]) => {
  if (!styles) return false;
  return styles.some((style) => ['700', '800', '900', 'bold'].includes(style.toLowerCase()));
};

const hasItalicStyle = (styles?: readonly string[]) => {
  if (!styles) return false;
  return styles.some((style) => style.toLowerCase().includes('italic'));
};

export const CAPTION_PRESETS: CaptionPreset[] = OPUS_CAPTION_TEMPLATES.map((template, index) => {
  const preferences = (template.preferences ?? {}) as NonNullable<OpusCaptionTemplate['preferences']>;
  const font = preferences.font ?? {
    family: 'Montserrat',
    numericalSize: 48,
    color: '#FFFFFF',
    stroke: { enabled: false, color: '#000000', width: 0 },
    style: ['700'],
    shadow: { enabled: false, color: '#000000', x: 0, y: 0, blur: 0 }
  };
  const stroke = font.stroke ?? { enabled: false, color: '#000000', width: 0 };
  const shadow = font.shadow ?? { enabled: false, color: '#000000', x: 0, y: 0, blur: 0 };
  const highlight = preferences.highlightColor ?? { primary: font.color ?? '#FFFFFF', secondary: font.color ?? '#FFFFFF' };
  const label = template.templateId === 'none'
    ? 'No captions'
    : formatOpusTemplateLabel(template.templateId, template.name);

  return {
    id: template.templateId ?? `preset-${index}`,
    templateId: template.templateId ?? `preset-${index}`,
    label,
    fontFamily: formatOpusFontLabel(font.family ?? 'Montserrat'),
    fontSize: toNumber(font.numericalSize, 48),
    primaryColor: font.color ?? '#FFFFFF',
    secondaryColor: highlight.secondary ?? highlight.primary ?? font.color ?? '#FFFFFF',
    outlineColor: stroke.color ?? '#000000',
    backColor: '#000000',
    bold: hasBoldStyle(font.style),
    italic: hasItalicStyle(font.style),
    outline: stroke.enabled ? toNumber(stroke.width, 0) : 0,
    shadow: shadow.enabled ? Math.max(toNumber(shadow.blur, 0), 1) : 0,
    borderStyle: 1,
    uppercase: preferences.enableUppercase ?? false,
    transitionStyleId: preferences.captionAnimation?.name
  };
});

export const CAPTION_PLACEMENTS: { id: CaptionPlacement; label: string }[] = [
  { id: 'top', label: 'Top' },
  { id: 'middle', label: 'Middle' },
  { id: 'bottom', label: 'Bottom' },
];

export function getCaptionPresetById(id: string): CaptionPreset {
  return CAPTION_PRESETS.find((preset) => preset.id === id) ?? CAPTION_PRESETS[1] ?? CAPTION_PRESETS[0];
}

export function getCaptionPresetByTemplateId(templateId: string): CaptionPreset {
  return CAPTION_PRESETS.find((preset) => preset.templateId === templateId) ?? CAPTION_PRESETS[1] ?? CAPTION_PRESETS[0];
}
