import Tone from '../structures/Tone.mjs';

/**
 * Track generator functions
 * This functions create/generate new Track
 * use: import {generateTones} from '<path_to_this>.mjs'
 */
/** Function that generates Tones array (adds map to every created tone)
 * @param tones
 * @param numberOfOctaves
 * @returns {*|boolean}
 */
export function generateTones(tones, numberOfOctaves) { //tones is array of tones and numberOfOctaves defines how many tones will it be inside an array
    if (numberOfOctaves < 1 || numberOfOctaves > 8) return false; //the number of octaves should be between 1 and 8
    const noteFrequencies = { //array of all possible tones and its frequency
        "C": [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01],
        "C#": [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
        "D": [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.63],
        "D#": [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
        "E": [20.60, 41.20, 82.41, 164.81, 329.63, 659.25, 1318.51, 2637.02, 5274.04],
        "F": [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83, 5587.65],
        "F#": [23.12, 46.25, 92.50, 185, 369.99, 739.99, 1479.98, 2959.96, 5919.91],
        "G": [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96, 6271.93],
        "G#": [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44, 6644.88],
        "A": [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00, 7040.00],
        "A#": [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31, 7458.62],
        "B": [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07, 7902.13]
    };
// Determine which octaves to use: always use octave 4 and add based on numberOfOctaves
    const baseOctave = 4;
    const octaves = [baseOctave]; // Always include octave 4

    // Add lower or higher octaves based on numberOfOctaves
    for (let i = 1; i < numberOfOctaves; i++) {
        if (i % 2 === 1) {
            // Add a lower octave (3, 2, 1, ...)
            octaves.unshift(baseOctave - Math.ceil(i / 2));
        } else {
            // Add a higher octave (5, 6, 7, ...)
            octaves.push(baseOctave + Math.floor(i / 2));
        }
    }

    // Generate tones for each note in the selected octaves
    octaves.forEach(octave => {
        for (let note in noteFrequencies) {
            const frequency = noteFrequencies[note][octave]; //adds frequency e.g. for A5 it is 440Hz
            const noteName = `${note}${octave}`; // e.g., C4, D#/Eb4, A5, etc.
            tones.unshift(new Tone(noteName, frequency));
        }
    });

    return tones;
}
