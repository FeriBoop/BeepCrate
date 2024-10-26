import TrackSettings from './TrackSettings.mjs';
import Tone from  './Tone.mjs';

/**
 * Class Track
 * This class defines track objects, which includes track title, ui color, track settings (like wave form, volume,...) and array of notes that are inside this track
 * use: import Track from '<path_to_this>.mjs'
 */
export default class Track {
    #title = "Title"; //track name
    #color = "#FFFFFF"; //ui color of track
    #tones = []; //array of tones
    #trackSettings; //instance of trackSettings

    /** Default constructor
     * @param title - name/title of track
     * @param color - color that defines track inside ui
     */
    constructor(title, color) {
        this.#title = title;
        this.#color = color;
        this.#tones = [];
        this.#trackSettings = new TrackSettings();
    }

    /** Get title of track
     * @returns {string}
     */
    get title() {
        return this.#title;
    }

    /** Set title of track
     * @param value
     */
    set title(value) {
        this.#title = value;
    }

    /** Get color that defines track
     * @returns {string}
     */
    get color() {
        return this.#color;
    }

    /** Set color with HEX value
     * Only use HEX value
     * @param value
     */
    set color(value) {
        this.#color = value;
    }

    /** Get array of tones
     * returns an entire array of tones
     * @returns {Tone[]}
     */
    get tones() {
        return this.#tones;
    }

    /** Set array of tones
     * sets an entire array
     * @param value
     */
    set tones(value) {
        this.#tones = value;
    }

    /** Gets tone form tone array, based on tone name (e.g. 'c1', 'c2',...)
     * @param name
     * @returns {Tone}
     */
    getToneFromTonesByName(name) {
        return this.#tones.find(tone => tone.name === name);
    }

    /** Get trackSettings
     * gets instance of trackSettings
     * @returns {TrackSettings}
     */
    get trackSettings() {
        return this.#trackSettings;
    }

    /** sets trackSettings
     * sets instance of trackSettings
     * @param value
     */
    set trackSettings(value) {
        this.#trackSettings = value;
    }
}
