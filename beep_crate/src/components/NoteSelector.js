import React from "react";

const NoteSelector = ({ setCurrentNote }) => {
    return (
        <div className="note-selector">
            <button onClick={() => setCurrentNote('whole')}>Whole</button>
            <button onClick={() => setCurrentNote('half')}>Half</button>
            <button onClick={() => setCurrentNote('quarter')}>Quarter</button>
            <button onClick={() => setCurrentNote('eighth')}>Eighth</button>
        </div>
    );
};

export default NoteSelector;
