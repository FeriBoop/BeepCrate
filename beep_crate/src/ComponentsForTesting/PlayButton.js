import React, { useEffect, useState } from 'react';
import Track from "../structures/Track.mjs";

/** Test component for play functionality
 * USE: import Play from <path-to-this-file>
 * @returns {Element}
 * @constructor
 */
function Play(){
    const [track, setTrack] = useState(null);
    //creates new track
    React.useEffect(() => {
        const newTrack = new Track("Track1", '#FFFFFF');
        newTrack.tones[19].insertNewNote(0,"4n");
        newTrack.tones[19].insertNewNote(6,"4n");
        newTrack.tones[19].insertNewNote(10,"4n");
        newTrack.tones[19].insertNewNote(14,"4n");
        newTrack.tones[19].insertNewNote(18,"4n");
        newTrack.tones[47].insertNewNote(4,"1n");
        newTrack.tones[47].insertNewNote(0,"8n");
        newTrack.tones[30].insertNewNote(16,"8n");
        newTrack.tones[30].insertNewNote(19,"4n");
        newTrack.tones[34].insertNewNote(17,"8n");
        newTrack.tones[34].insertNewNote(19,"4n");
        newTrack.tones[38].insertNewNote(18,"8n");
        newTrack.tones[38].insertNewNote(19,"4n");
        newTrack.tones[42].insertNewNote(19,"4n");
        newTrack.tones[46].insertNewNote(19,"4n");
        newTrack.tones[50].insertNewNote(19,"4n");
        newTrack.tones[54].insertNewNote(19,"4n");
        setTrack(newTrack);
    }, []);

    //play the track
    const handlePlay = async () => {
        if (track) {
            track.exportToAFile("testExport.json");
            await track.playFromIndex(); // Call the play method on the Track instance
        }
    };

    return ( //creates play button
        <button onClick={handlePlay}>Play</button>
    );
}
export default Play;