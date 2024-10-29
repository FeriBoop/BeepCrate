import TrackSettings from './TrackSettings.mjs';
import {generateTones} from "../HelperFunctionsForLogic/TrackGeneratorFunctions.mjs";
import PolySynthManager from '../HelperFunctionsForLogic/ToneJsManager.mjs';
import * as Tone from "tone";
import {TRACK_PLAY_POSITION} from "./GlobalVariables.mjs";

/**
 * Class Track
 * This class defines track objects, which includes track title, ui color, track settings (like wave form, volume,...) and array of notes that are inside this track
 * use: import Track from '<path_to_this>.mjs'
 */
export default class Track {
    //#region values
    #title = "Title"; //track name
    #color = "#FFFFFF"; //ui color of track
    #volume = 100; //volume of the track (0-100)
    #tones = []; //array of tones
    #trackSettings; //instance of trackSettings
    #PolySynth; //instance of ToneJsManager class
    //#endregion

    //#region constructor
    /** Default constructor
     * @param title - name/title of track
     * @param color - color that defines track inside ui
     * @param numberOfOctaves - number between 1 and 8 - defines number of octaves
     * @param volume - volume of the Track (0-100)
     */
    constructor(title, color, numberOfOctaves = 5, volume = 100) {
        this.#title = title;
        this.#color = color;
        this.#volume = volume
        this.#tones = generateTones(this.#tones, numberOfOctaves);
        this.#trackSettings = new TrackSettings();

        this.#PolySynth = new PolySynthManager(this.#trackSettings, numberOfOctaves);
        this._volume = volume;
    }

    //#endregion

    //#region Getters and setters
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
        if (value === "" || value === null) this.#title = "Undefined Track";
        else this.#title = value;
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

    /** Gets trackSettings
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

    /** Gets track volume
     * gets current track volume
     * @returns {number}
     */
    get volume() {
        return this.#volume;
    }

    /** Sets track volume
     * sets track volume (0-100)
     * @param value
     */
    set volume(value) {
        if (value < 0) this.#volume = 0;
        else if (value > 100) this.#volume = 100;
        else this.#volume = value;
    }

//#endregion

    //#region Methods for Tone.js library
    /** Function for playing song from beginning
     * stops all sounds (if there are any)
     * then plays all tones that are inside this object
     * @returns {Promise<void>}
     */
    async playFromBeginning() {
        this.stopPlayingTrack(); //stops all tones
        this.changeSettings();
        const audioContext = Tone.getContext(); //gets context of audio - because Tone.js requires it for working

        if (audioContext.state === 'suspended') {
            await audioContext.resume(); //updates audioContext if it is suspended
            console.log("Audio context resumed");
        }
        this.#PolySynth.play(this.#tones); //plays all tones
    }

    /** Function for playing song from specified index
     * stops all sounds (if there are any)
     * then plays all tones that are inside this object and have notes that have
     * index larger or equal to specified index
     * INDEX is being provided by global variable TRACK_PLAY_POSITION from GlobalVariables.mjs
     * @returns {Promise<void>}
     */
    async playFromIndex() {
        this.stopPlayingTrack(); //stops all tones
        this.changeSettings();
        const audioContext = Tone.getContext();

        if (audioContext.state === 'suspended') {
            await audioContext.resume(); //gets context of audio - because Tone.js requires it for working
            console.log("Audio context resumed");
        }
        this.#PolySynth.play(this.#tones, TRACK_PLAY_POSITION); //plays tones from x index onwards
    }

    /** Function that calls function to stop all tones (including scheduled ones)
     * calls stopAll function of class ToneJSManager
     */
    stopPlayingTrack() {
        this.#PolySynth.stopAll();
    }

    /** Function that applies all settings to synth
     * Calls ToneJsManager changeSettings method
     */
    changeSettings(){
        this.#PolySynth.changeSettings(this.#trackSettings);
    }

//#endregion
}
