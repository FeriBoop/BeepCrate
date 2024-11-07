import TrackSettings from './TrackSettings.mjs';
import {generateTones} from "../HelperFunctionsForLogic/TrackGeneratorFunctions.mjs";
import PolySynthManager from '../HelperFunctionsForLogic/ToneJsManager.mjs';
import * as ToneLibrary from "tone";
import Tone from './Tone.mjs';
import {TRACK_PLAY_POSITION} from "./GlobalVariables.mjs";
import {exportToJson} from "./ImportExport/ImportAndExport.mjs";

/**
 * Class Track
 * This class defines track objects, which includes track title, ui color, track settings (like wave form, volume,...) and array of notes that are inside this track
 * use: import Track from '<path_to_this>.mjs'
 */
export default class Track {
    //#region values
    #title = "Title"; //track name
    #color = "#FFFFFF"; //ui color of track
    #volume = 0; //volume of the track (-100, 100)
    #numberOfOctaves; //number of octaves
    #tones = []; //array of tones
    #trackSettings; //instance of trackSettings
    #PolySynth; //instance of ToneJsManager class
    #onPlaybackStopped; // Callback for playback stopping
    //#endregion

    //#region constructor
    /** Default constructor
     * @param title - name/title of track
     * @param color - color that defines track inside ui
     * @param numberOfOctaves - number between 1 and 8 - defines number of octaves
     * @param volume - volume of the Track (0-100)
     * @param onPlaybackStopped - callback for when playback plays the last note
     */
    constructor(title, color, numberOfOctaves = 5, volume = 0, onPlaybackStopped = null) {
        this.#title = title;
        this.#color = color;
        this.#volume = volume
        this.#numberOfOctaves = numberOfOctaves
        this.#tones = generateTones(this.#tones, numberOfOctaves);
        this.#trackSettings = new TrackSettings();
        this.#onPlaybackStopped = onPlaybackStopped
        this.#PolySynth = new PolySynthManager(this.#trackSettings, this.#numberOfOctaves, this.#onPlaybackStopped);
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

    /** Set number of octaves
     * Integer between 1 and 8
     * @param value
     */
    set numberOfOctaves(value) {
        if(value < 1 || value > 8)
            this.#numberOfOctaves = 1;
        else
            this.#numberOfOctaves = value;
    }

    /** Get number of octaves
     * @returns {number}
     */
    get numberOfOctaves() {
        return this.#numberOfOctaves;
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

    set onPlaybackStopped(value){
        this.#onPlaybackStopped = value;
        this.#PolySynth.setOnPlaybackStopped(value)
    }

//#endregion

    //#region JSON
    /** Helper method that helps JSON.stringify to correctly transform this object
     * @returns {{volume: number, numberOfOctaves, color: string, tones: *[], title: string, trackSettings}}
     */
    toJSON() {
        return {
            title: this.#title, //type string
            color: this.#color, //type string (HEX)
            volume: this.#volume, //Type number
            numberOfOctaves: this.#numberOfOctaves, //type number
            tones: this.#tones, //type tones object
            trackSettings: this.#trackSettings, //type trackSettings object
        };
    }

    //#endregion

    //#region Methods for ToneLibrary.js library
    /** Function for playing song from beginning
     * stops all sounds (if there are any)
     * then plays all tones that are inside this object
     * @returns {Promise<void>}
     */
    async playFromBeginning() {
        this.stopPlayingTrack(); //stops all tones
        this.changeSettings();
        const audioContext = ToneLibrary.getContext(); //gets context of audio - because ToneLibrary.js requires it for working

        if (audioContext.state === 'suspended') {
            await audioContext.resume(); //updates audioContext if it is suspended
            console.log("Audio context resumed");
        }
        this.#PolySynth.play(this.#tones, this.volume); //plays all tones
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
        const audioContext = ToneLibrary.getContext();

        if (audioContext.state === 'suspended') {
            await audioContext.resume(); //gets context of audio - because ToneLibrary.js requires it for working
            console.log("Audio context resumed");
        }
        this.#PolySynth.play(this.#tones, this.volume, TRACK_PLAY_POSITION); //plays tones from x index onwards
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

    //#region Import and Export

    /** Method that calls export to Json function from ImportAndExport.mjs
     * @param name
     */
    exportToAFile(name){
        exportToJson(this, name);
    }
    /** static helper method that helps correctly transform from JSON to this object
     * @param json
     * @returns {Track}
     */
    static importFromJSONFile(json) {
        const { title, color, volume, numberOfOctaves, tones, trackSettings } = json; //gets different attributes from json file
        const track = new Track(title, color, numberOfOctaves, volume); //creates new track
        track.#trackSettings = TrackSettings.fromJSON(trackSettings); // Set track settings directly, by calling static method inside Settings

        track.#tones = []; //sets tones array to empty, because Track constructor automatically insert some of them
        tones.forEach(toneJson => {
            const tone = Tone.fromJSON(toneJson); // Uses the static method to create ToneLibrary instances
            track.#tones.push(tone); // Adds tone object into tones array
        });
        // Recreate ToneLibrary instances from the JSON
        track.#PolySynth = new PolySynthManager(track.#trackSettings, track.#numberOfOctaves);

        return track;
    }
    //#endregion
}
