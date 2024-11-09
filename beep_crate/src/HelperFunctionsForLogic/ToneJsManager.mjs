import * as Tone from "tone";
import * as Globals from "../structures/GlobalVariables.mjs";

/**
 * Class ToneJsManager
 * This class defines Tone.js object instance (like polysnyth, filter, reverb or delay)
 * use: import ToneJsManager from '<path_to_this>.mjs'
 */
export default class PolySynthManager {
    //#region values
    #polySynth;                // Tone.js PolySynthesizer instance
    #filter;                   // Tone.js filter instance
    #reverb;                   // Tone.js reverb instance
    #delay;                    // Tone.js delay instance
    #playbackStopped;          // Callback for end of playback

    setOnPlaybackStopped(callback){
        this.#playbackStopped = callback;
    }
    //#endregion

    //#region constructor and initialize methods
    /** Default constructor
     * @param trackSettings
     * @param numberOfOctaves
     * @param onPlaybackStopped
     */
    constructor(trackSettings, numberOfOctaves, onPlaybackStopped = null) {
        this.initializePolySynth(trackSettings, numberOfOctaves); // Calling initializer method
        this.#playbackStopped = onPlaybackStopped
    }

    /** Initialize polySynth object
     * Initialize the PolySynthesizer with current track settings
     * @param trackSettings
     */
    initializePolySynth(trackSettings) {
        // creating polySynth object and passing to him instrument synthesizer
        this.#polySynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {type: trackSettings.waveType}, // Wave type of synth
            envelope: { // passing values like attack, decay, sustain and release to synth
                attack: trackSettings.attack,
                decay: trackSettings.decay,
                sustain: trackSettings.sustain,
                release: trackSettings.release
            }
        });

        this.#polySynth.volume.value = trackSettings.volume; // volume gain

        // Apply filter settings if filterType != NULL
        if (this.#filter) {
            this.#filter = new Tone.Filter({
                type: trackSettings.filterType,    // Filter type ('lowpass', 'highpass', etc.)
                frequency: trackSettings.cutoffFrequency, // Cutoff frequency
                Q: trackSettings.q,                // Resonance (Q factor)
                rolloff: trackSettings.rolloff     // Rolloff slope (-12, -24, etc.)
            });
        }

        // Apply reverb effect if not null
        if (this.#reverb) {
            this.#reverb = new Tone.Reverb({
                decay: trackSettings.reverbAmount * 10,  // Reverb decay time, scaled (0-1) to (0-10 seconds)
            });
        }

        // Apply delay effect if not null
        if (this.#delay) {
            this.#delay = new Tone.FeedbackDelay({
                delayTime: trackSettings.delayTime,  // Delay time in seconds
                feedback: 0.5,                            // Set a default feedback value (0-1)
            })
        }

        // Handle mute
        this.#polySynth.mute = !!trackSettings.isMute;
    }

    //#endregion

    //#region Update Settings
    // Apply track settings to the PolySynthesizer
    changeSettings(trackSettings) {
        // Update oscillator and envelope settings
        this.#polySynth.set({
            oscillator: {type: trackSettings.waveType}, // Update oscillator type
            detune: trackSettings.detune,                // Update detune
            volume: trackSettings.volume,                // Update volume
            envelope: {                                  // Update envelope properties
                attack: trackSettings.attack,
                decay: trackSettings.decay,
                sustain: trackSettings.sustain,
                release: trackSettings.release
            }
        });

        // Update filter settings if applicable
        if (trackSettings.filterType) {
            if (this.#filter) {
                this.#filter.type = trackSettings.filterType;               // Update filter type
                this.#filter.frequency.value = trackSettings.cutoffFrequency; // Update cutoff frequency
                this.#filter.Q.value = trackSettings.q;                      // Update Q factor (resonance)
                this.#filter.rolloff = trackSettings.rolloff;                // Update rolloff slope
            } else { //if filter was null create new object
                this.#filter = new Tone.Filter({
                    type: trackSettings.filterType,    // Filter type ('lowpass', 'highpass', etc.)
                    frequency: trackSettings.cutoffFrequency, // Cutoff frequency
                    Q: trackSettings.q,                // Resonance (Q factor)
                    rolloff: trackSettings.rolloff     // Rolloff slope (-12, -24, etc.)
                });
            }
        } else {
            if (this.#filter) {
                this.#filter.dispose();
                this.#filter = null;
            }
        }

        // Update reverb settings if applicable
        if (this.#reverb) {
            this.#reverb.decay = trackSettings.reverbAmount() * 10;  // Update reverb decay time
        } else if (trackSettings.reverbAmount != null) { //if reverb was null create new object
            if (this.#reverb) {
                this.#reverb = new Tone.Reverb({
                    decay: trackSettings.reverbAmount * 10,  // Reverb decay time, scaled (0-1) to (0-10 seconds)
                });
            }
        }

        // Update delay settings if applicable
        if (this.#delay) {
            this.#delay.delayTime.value = trackSettings.delayTime();  // Update delay time
        } else if (trackSettings.delayTime) { //if delay6 was null create new object
            if (this.#delay) {
                this.#delay = new Tone.FeedbackDelay({
                    delayTime: trackSettings.delayTime,  // Delay time in seconds
                    feedback: 0.5,                            // Set a default feedback value (0-1)
                })
            }
        }
        // Handle mute functionality
        this.#polySynth.mute = trackSettings.isMute;  // Mute or unmute the PolySynth
    }

    //#endregion

    //#region Play related methods
    /** Play method
     * Play provided tones from x index onwards
     * @param tones
     * @param volume
     * @param startIndex
     * @returns {Promise<void>}
     */
    async play(tones, volume, startIndex = 0) {
        this.#polySynth.volume.value = volume;
        this.#connectSynthToMaster(); // call connect to output method
        const now = Tone.getTransport().seconds + 0.5;  // Get the current transport time
        let bpm = Globals.BPM;
        console.log("Setting ToneJsManager BPM:", bpm);
        Tone.getTransport().bpm.value = bpm;       // Set the tempo from global variable
        console.log("Setting ToneJsManager BEATS", Globals.BEATS);
        Tone.getTransport().timeSignature = Globals.BEATS;    // Set the time signature from global variable

        const scheduledNotes = orderTones(tones, now, startIndex);   // Array to store notes with their play time and duration - include notes only with play time greater or equal to startIndex

        // Schedule the notes for future play
        let endTime = 0;
        scheduledNotes.forEach(note => {
            Tone.getTransport().schedule((time) => {
                console.log(`Playing note ${note.name} at time: ${time}`);
                this.#polySynth.triggerAttackRelease(note.name, note.duration, time); //calling Tone.js function for playing the specified tone with specified duration ('1n', '2n', '4n'...)
            }, note.timeToPlay);
            endTime = Math.max(endTime, note.timeToPlay + Tone.Time(note.duration).toSeconds())
        });
        // playback end
        Tone.getTransport().scheduleOnce((time) => {
            console.log(`Playback over`);
            if (this.#playbackStopped) this.#playbackStopped();
        }, endTime)

        // Start the transport (if not already started)
        console.log("Starting transport")
        if (Tone.getTransport().state !== "started") Tone.getTransport().start();
        else console.log("Transport not started: already running")
    }

    /** Stop all Tones method
     * Stop all currently playing and scheduled notes
     */
    stopAll() {
        this.#polySynth.releaseAll();  // Release all active notes
        Tone.getTransport().cancel();  //Clears all scheduled events (notes)
        this.#disconnect();     //disconnects from output
    }

    //#endregion

    //#region Synth to output related methods
    /** Connect all elements of synth to output method
     * Connects elements to audio output and connects filter, reverb and delay to synth
     */
    #connectSynthToMaster() {
        this.#polySynth.toDestination(); //Route PolySynth output to speakers

        // Connect filter if it exists
        if (this.#filter) {
            this.#polySynth.connect(this.#filter);
            this.#filter.toDestination(); //Route filter to output
        }

        // Connect reverb if it exists
        if (this.#reverb) {
            this.#polySynth.connect(this.#reverb);
            this.#reverb.toDestination(); //Route reverb to output
        }

        // Connect delay if it exists
        if (this.#delay) {
            this.#polySynth.connect(this.#delay);
            this.#delay.toDestination(); //Route delay to output
        }
    }

    /** Disconnect from synth method
     * Disconnects all elements from synth
     */
    #disconnect() {
        // if (this.#filter) this.#polySynth.disconnect(this.#filter); //Disconnects filter from synth
        if (this.#reverb) this.#polySynth.disconnect(this.#reverb); //Disconnects reverb from synth
        if (this.#delay) this.#polySynth.disconnect(this.#delay); //Disconnects delay from synth
    }

    //#endregion
}

//#region other functions, that are not included inside class
/** FUnction for calculating offset time of notes
 * This functions calculates, when should tone with specific index be played
 * and converts that time into seconds (as units it uses 16-th note rhythms
 * @param key
 * @returns {number}
 */
function calculateTimeOffset(key) { // key is index
    const sixteenthNoteTime = Tone.Time('16n').toSeconds(); // Duration of a sixteenth note in seconds
    return key * sixteenthNoteTime;  // Multiply key by sixteenth note duration
}

/** Function that orders tones from all tone maps by its play time index
 *
 * @param tones
 * @param now
 * @param startIndex
 * @returns {*[]}
 */
function orderTones(tones, now, startIndex) { // tones is map of tones, now is ToneJs.now() - current time, startIndex is from which point onwards will notes be played
    let scheduledNotes = [];
    tones.forEach(tone => {
        const notes = tone.getAllNotes();  // Get all the notes for this tone
        notes.forEach((duration, index) => { // for each tone it gets its key (index - start of play) and value (length - 1n, 2n, 4n ,8, 16n)
            const numberFromIndex = duration.match(/\d+/)[0];
            console.log(numberFromIndex);
            if (index >= startIndex) {
                const timeToPlay = calculateTimeOffset(index - startIndex);  // Calculate when to play

                // Add to the scheduledNotes array
                scheduledNotes.push({
                    timeToPlay: now + timeToPlay,  // Absolute play time
                    name: tone.name,               // Name of the note (e.g., 'C4')
                    duration: duration             // Duration of the note (e.g., '4n')
                });
            }
            else if (index + (17 - numberFromIndex) >= startIndex) { // if index is lower than startIndex, bit with lenght it should still be heard

                // Add to the scheduledNotes array
                scheduledNotes.push({
                    timeToPlay: now,  // Absolute play time
                    name: tone.name,               // Name of the note (e.g., 'C4')
                    duration: ((startIndex - index) + numberFromIndex) + "n"             // Duration of the note (e.g., '4n')
                });
            }
        });
    });


    // Sort the notes by their play time
    scheduledNotes.sort((a, b) => a.timeToPlay - b.timeToPlay);
    return scheduledNotes
}

//#endregion