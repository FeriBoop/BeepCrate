/** Enum for Wave Types
 * this defines types of wave
 * @type {Readonly<{SQUARE: string, TRIANGLE: string, NOISE: string, SINE: string, SAWTOOTH: string}>}
 * use: import { WaveType, NoiseType, FilterType, Rolloff } from '<path_to_this>.mjs'; //importing enum values from Enums.mjs
 */
export const WaveType = Object.freeze({
    SINE: 'sine',
    SQUARE: 'square',
    SAWTOOTH: 'sawtooth',
    TRIANGLE: 'triangle',
    NOISE: 'noise',
});

/** Enum for Filter Types
 * this defines type if filters
 * @type {Readonly<{LOWPASS: string, BANDPASS: string, HIGHSHELF: string, NOTCH: string, LOWSHELF: string, ALLPASS: string, PEAKING: string, HIGHPASS: string}>}
 */
export const FilterType = Object.freeze({
    LOWPASS: 'lowpass',
    HIGHPASS: 'highpass',
    BANDPASS: 'bandpass',
    NOTCH: 'notch',
    ALLPASS: 'allpass',
    PEAKING: 'peaking',
    LOWSHELF: 'lowshelf',
    HIGHSHELF: 'highshelf',
    NULL: null,
});

/** Enum for Rolloff Types
 * this defines which values can be used in rolloff
 * @type {Readonly<{DB_96: number, DB_48: number, DB_24: number, DB_12: number}>}
 */
export const Rolloff = Object.freeze({
    DB_12: -12,
    DB_24: -24,
    DB_48: -48,
    DB_96: -96,
});
