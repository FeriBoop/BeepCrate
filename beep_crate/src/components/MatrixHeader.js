import React from "react";
import {TRACK_PLAY_POSITION, setTrackPlayPosition} from "../structures/GlobalVariables.mjs";

/**
 * MatrixHeader component
 * 
 * Displays the header row for the matrix, showing column numbers and tone header label.
 * Adds dividers every 4 columns for improved readability.
 *
 * @param {Object} props - Properties passed to the component.
 * @param {number} props.visibleColumns - Number of columns currently visible in the matrix.
 * @param {number} props.offset - Starting offset for the visible columns, used to calculate column numbers.
 * @returns {JSX.Element} The rendered component.
 */
const MatrixHeader = ({ visibleColumns, offset }) => {
    const [playPosition, setPlayPosition] = React.useState(TRACK_PLAY_POSITION);

    return (
        <div className="matrix-header sticky-top">
            <div className="matrix-tone-header">TONES</div>
            {Array.from({ length: visibleColumns }, (_, i) => (
                <div
                    key={i + offset}
                    className={`matrix-cell-header ${(i + 1) % 4 === 0 ? "matrix-cell-divider" : ""} ${(i + offset) === playPosition ? "play-index" : ""}`}
                    onClick={() => {
                        setPlayPosition(i + offset);
                        setTrackPlayPosition(i + offset)
                    }}
                >
                    {i + 1 + offset}
                </div>
            ))}
        </div>
    );
};

export default MatrixHeader;
