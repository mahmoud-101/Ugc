
import type { AdOptions } from './types';

export const DIALECTS: { key: AdOptions['dialect'], tKey: string }[] = [
    { key: 'Egyptian', tKey: 'dialectEgyptian' },
    { key: 'Gulf', tKey: 'dialectGulf' },
    { key: 'Formal Arabic', tKey: 'dialectFormal' }
];

export const MOODS: { key: AdOptions['mood'], tKey: string }[] = [
    { key: 'Comedy', tKey: 'moodComedy' },
    { key: 'Serious', tKey: 'moodSerious' },
    { key: 'Luxury', tKey: 'moodLuxury' },
    { key: 'Casual', tKey: 'moodCasual' },
    { key: 'Energetic', tKey: 'moodEnergetic' }
];

export const ASPECT_RATIOS: { labelKey: string; value: AdOptions['aspectRatio'] }[] = [
    { labelKey: 'landscape', value: '16:9' },
    { labelKey: 'portrait', value: '9:16' },
    { labelKey: 'square', value: '1:1' },
];
