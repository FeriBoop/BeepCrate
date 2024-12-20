import {WaveType, FilterType, Rolloff} from './Enums.mjs'; //importing enum values from Enums.mjs

/**
 * Class TrackSettings
 * This class defines track settings that can be applied to Tone.mjs library to generate unique sound
 * use: import TrackSettings from '<path_to_this>.mjs'
 */
export default class TrackSettings {
    //#region values
    /* oscillator */
    #waveType;       // Options: 'sine', 'square', 'sawtooth', 'triangle', 'noise'
    #detune;              // Detune in cents (±1200)

    /* amplitude */
    #volume;            // Volume gain level (0-100)
    #attack;            // Attack time (0-1)
    #decay;             // Decay time (0-1)
    #sustain;           // Sustain level (0-1)
    #release;             // Release time (0-1)


    /* filter */
    #filterType;  // Single filter type (Options: 'lowpass', 'highpass', 'bandpass', 'notch', 'allpass', 'peaking', 'lowshelf', 'highshelf')
    #cutoffFrequency;  // Cutoff frequency in Hz
    #q;                   // Resonance (Q factor)
    #rolloff;           // Rolloff slope (Options: '-12', '-24', '-48', '-96' dB/octave)

    /* effects */
    #reverbAmount;        // Amount of reverb (0-1)
    #delayTime;           // Delay time in seconds (0-1)

    /* custom */
    #isMute;          // Mute flag

    //#endregion

    //#region constructor
    /**
     * default constructor for TestSettings
     * @param waveType
     * @param detune
     * @param volume
     * @param attack
     * @param decay
     * @param sustain
     * @param release
     * @param filterType
     * @param cutoffFrequency
     * @param q
     * @param rolloff
     * @param reverbAmount
     * @param delayTime
     * @param isMute
     */
    constructor({
                    waveType = WaveType.SINE,            // Default value
                    detune = 0,                         // Default detune
                    volume = 0,                       // Default volume gain
                    attack = 0.005,                       // Default attack time
                    decay = 0.1,                        // Default decay time
                    sustain = 0.3,                      // Default sustain level
                    release = 1,                        // Default release time
                    filterType = FilterType.NULL,     // Default filter type
                    cutoffFrequency = 1000,             // Default cutoff frequency
                    q = 1,                              // Default Q factor
                    rolloff = Rolloff.DB_12,            // Default rolloff
                    reverbAmount = null,                   // Default reverb amount
                    delayTime = null,                      // Default delay time
                    isMute = false                      // Default mute flag
                } = {}) {
        // Assign properties
        this.#waveType = waveType;
        this.#detune = detune;
        this.#volume = volume;
        this.#attack = attack;
        this.#decay = decay;
        this.#sustain = sustain;
        this.#release = release;
        this.#filterType = filterType;
        this.#cutoffFrequency = cutoffFrequency;
        this.#q = q;
        this.#rolloff = rolloff;
        this.#reverbAmount = reverbAmount;
        this.#delayTime = delayTime;
        this.#isMute = isMute;
    }

    //#endregion

    //#region Getters and Setters
    /** Get wave type
     * @returns {string}
     */
    get waveType() {
        return this.#waveType;
    }

    /** Set wave type: Options('sine', 'square', 'sawtooth', 'triangle', 'noise')
     * @param value
     */
    set waveType(value) {
        this.#waveType = value;
    }

    /** Get detune
     * @returns {number}
     */
    get detune() {
        return this.#detune;
    }

    /** Set detune
     * cents
     * @param value
     */
    set detune(value) {
        this.#detune = value;
    }

    /** Get volume gain
     * @returns {number}
     */
    get volume() {
        return this.#volume;
    }

    /** Set volume gain
     * 0-100 %
     * @param value
     */
    set volume(value) {
        this.#volume = value;
    }

    /** Get attack
     * @returns {number}
     */
    get attack() {
        return this.#attack;
    }

    /** Set attack
     * seconds
     * @param value
     */
    set attack(value) {
        this.#attack = value;
    }

    /** Get decay
     * @returns {number}
     */
    get decay() {
        return this.#decay;
    }

    /** Set decay
     * seconds
     * @param value
     */
    set decay(value) {
        this.#decay = value;
    }

    /** Get sustain
     * @returns {number}
     */
    get sustain() {
        return this.#sustain;
    }

    /** Set sustain
     * 0-1
     * @param value
     */
    set sustain(value) {
        this.#sustain = value;
    }

    /** Get release
     * @returns {number}
     */
    get release() {
        return this.#release;
    }

    /** Set release
     * seconds
     * @param value
     */
    set release(value) {
        this.#release = value;
    }

    /**
     * Get filter type
     * @returns {string}
     */
    get filterType() {
        return this.#filterType;
    }

    /** Set filter type
     * Single filter type (Options: 'lowpass', 'highpass', 'bandpass', 'notch', 'allpass', 'peaking', 'lowshelf', 'highshelf')
     * @param value
     */
    set filterType(value) {
        this.#filterType = value;
    }

    /** Get cutoff frequency
     * @returns {number}
     */
    get cutoffFrequency() {
        return this.#cutoffFrequency;
    }

    /** Set cutoff frequency
     * Hz
     * @param value
     */
    set cutoffFrequency(value) {
        this.#cutoffFrequency = value;
    }

    /** Get Q (resonance)
     * @returns {number}
     */
    get q() {
        return this.#q;
    }

    /** Set Q (resonance)
     * @param value
     */
    set q(value) {
        this.#q = value;
    }

    /** Get rolloff
     * @returns {number}
     */
    get rolloff() {
        return this.#rolloff;
    }

    /** Set rolloff
     * Rolloff slope (Options: '-12', '-24', '-48', '-96' dB/octave)
     * @param value
     */
    set rolloff(value) {
        this.#rolloff = value;
    }

    /** Get reverb amount
     * @returns {number}
     */
    get reverbAmount() {
        return this.#reverbAmount;
    }

    /** Set reverb amount
     * 0-1
     * @param value
     */
    set reverbAmount(value) {
        this.#reverbAmount = value;
    }

    /** get delay time
     * @returns {number}
     */
    get delayTime() {
        return this.#delayTime;
    }

    /** Set delay time
     * seconds
     * @param value
     */
    set delayTime(value) {
        this.#delayTime = value;
    }

    /** Get is mute
     * @returns {boolean}
     */
    get isMute() {
        return this.#isMute;
    }

    /** Set is mute
     * boolean
     * @param value
     */
    set isMute(value) {
        this.#isMute = value;
    }

    //#endregion

    //#region JSON
    /** Helper method that helps JSON.stringify to correctly transform this object
     * @returns {{isMute: boolean, release: number, rolloff: number, waveType: string, decay: number, cutoffFrequency: number, volume: number, q: number, reverbAmount: null, detune: number, attack: number, delayTime: null, filterType: null, sustain: number}}
     */
    toJSON() {
        return { //for each attribute is uses current value or default
            waveType: this.#waveType ?? WaveType.SINE, //type WaveType (enum)
            detune: this.#detune ?? 0,                      //type number
            volume: this.#volume ?? 0,                      //type number
            attack: this.#attack ?? 0.005,                  //type number
            decay: this.#decay ?? 0.1,                      //type number
            sustain: this.#sustain ?? 0.3,                  //type number
            release: this.#release ?? 1,                    //type number
            filterType: this.#filterType ?? FilterType.NULL,//Type FilterType (enum)
            cutoffFrequency: this.#cutoffFrequency ?? 1000, //type number
            q: this.#q ?? 1,                                //type number
            rolloff: this.#rolloff ?? Rolloff.DB_12,        //Type Rolloff (enum)
            reverbAmount: this.#reverbAmount ?? null,       //Type ReverbAmount (enum)
            delayTime: this.#delayTime ?? null,             //Type number
            isMute: this.#isMute ?? false,                  //Type bool
        };
    }

    /** static helper method that helps correctly transform from JSON to this object
     * @param json
     * @returns {TrackSettings}
     */
    static fromJSON(json) { //it reads all data from json file and saves it into new TrackSettings object and returns it
        const {
            waveType,
            detune,
            volume,
            attack,
            decay,
            sustain,
            release,
            filterType,
            cutoffFrequency,
            q,
            rolloff,
            reverbAmount,
            delayTime,
            isMute
        } = json;

        return new TrackSettings({
            waveType: waveType || WaveType.SINE, // For each attribute it saves the provided value or default one
            detune: detune || 0,
            volume: volume || 0,
            attack: attack || 0.005,
            decay: decay || 0.1,
            sustain: sustain || 0.3,
            release: release || 1,
            filterType: filterType || FilterType.NULL,
            cutoffFrequency: cutoffFrequency || 1000,
            q: q || 1,
            rolloff: rolloff || Rolloff.DB_12,
            reverbAmount: reverbAmount || null,
            delayTime: delayTime || null,
            isMute: isMute || false,
        });
    }
    //#endregion
}
