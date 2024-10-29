/**
 * Class Tone
 * This class defines one frequency or Tone, which can be played unitBlocks.size() times
 * use: import Tone from '<path_to_this>.mjs'
 */

export default class Tone {
    //#region values
    #name               // name of tone (e.g. 'c1', 'd1',...)
    #frequency;         // Frequency in Hz
    #unitBlocks;        // Map of when will this tone be played - key is index (positive integer number) and value is length (positive intger number)
    //#endregion

    //#region constructor
    /** Default constructor
     *
     * @param name
     * @param frequency
     */
    constructor(name, frequency) {
        this.#name = name;
        this.#frequency = frequency;
        this.#unitBlocks = new Map();
    }

    //#endregion

    //#region Getters and Setters
    /** Get name
     * @returns {*}
     */
    get name() {
        return this.#name;
    }

    /** Set name
     * @param value
     */
    set name(value) {
        this.#name = value;
    }

    /** Get frequency
     * @returns {number}
     */
    get frequency() {
        return this.#frequency;
    }

    /** Set frequency
     * Hz
     * @param value
     */
    set frequency(value) {
        this.#frequency = value;
    }

    //#endregion

    //#region Tone related methods
    /** Gets a length of a note at specified index
     * @param key
     * @returns {*|null}
     */
    getLengthOfNote(key) {
        return (!this.#unitBlocks.has(key)) ? this.#unitBlocks.get(key) : null;
    }

    /** Inserts new or updates note at key position with value length
     * @param key (natural number)
     * @param value (natural number)
     */
    insertNewNote(key, value) {
        this.#unitBlocks.set(key, value);
    }

    /** Removes a note from map
     * @param key
     * @returns {boolean} - true if successfully deleted, otherwise false
     */
    removeNote(key) {
        if (this.#unitBlocks.has(key)) {
            this.#unitBlocks.delete(key);
            return true;
        } else
            return false;
    }

    /** Get all notes from map
     * @returns $ObjMap
     */
    getAllNotes() {
        return this.#unitBlocks;
    }

    //#endregion
}
