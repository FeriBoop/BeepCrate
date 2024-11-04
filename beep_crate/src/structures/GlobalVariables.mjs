/** Global variables
 * here are defined all global variables like beats_per_minute, beats and position of track play
 * use: var <globalVarName> = require('./GlobalVariables.mjs');
 */

export var BPM = 120; // Beats per minute (how many units will be inside 1 second - 60 means one, 120 means 2, 180 means three and 30 means 0.5)
export var BEATS = 4; // How many units inside one larger module (e.g. 2, 3, 4, ... ,10)
export var TRACK_PLAY_POSITION = 0; // Position from where will the play at x started playing

/// Sets the BPM global variable
export function setBpm(newBpm){
    BPM = newBpm;
}

/// Sets the BEATS global variable
export function setBeats(newBeats){
    BEATS = newBeats;
}

/// Sets the TRACK_PLAY_POSITION global variable
export function setTrackPlayPosition(newPos){
    TRACK_PLAY_POSITION = newPos;
}
