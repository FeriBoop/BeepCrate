import React, {useState} from 'react';
import { exportToJson, importFromJson} from "../structures/ImportExport/ImportAndExport.mjs";

/** Test component that shows how can you import track and play it
 * @returns {Element}
 * @constructor
 */
const ImportButton = () => {
    const [track, setTrack] = useState(null);

    const handleImport = (event) => {
        importFromJson(event, (track) => {
            console.log("Imported Track:", track);
            setTrack(track); // Set the track state once it's imported
        });
    };
    const handlePlay = async () => {
        console.log(track);
        if (track) {
            await track.playFromIndex(); // Call the play method on the Track instance
        }
    };

    return (
        <div>
            <h1>Import Track</h1>
            <button onClick={handlePlay}>Play</button>
            <input
                type="file"
                accept=".json"
                onChange={handleImport} // Attach the import handler
            />
        </div>
    );
};

export default ImportButton;