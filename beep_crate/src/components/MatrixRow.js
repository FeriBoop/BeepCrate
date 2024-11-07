import React from "react";

/**
 * MatrixRow component
 * 
 * Represents a single row in the matrix, with each cell potentially displaying part of a note.
 * Displays a row of cells with clickable and right-clickable actions.
 * Also manages styling to distinguish note cells and apply dividers.
 *
 * @param {Object} props - Properties passed to the component.
 * @param {string[]} props.tones - Array of tone names or values corresponding to each row.
 * @param {Object[]} props.row - Array representing the row data, where each cell may contain note information.
 * @param {number} props.rowIndex - Index of the current row, used for rendering and tone labeling.
 * @param {number} props.offset - Column offset to display only a portion of the row within the visible range.
 * @param {number} props.visibleColumns - Number of columns visible within the matrix view at any time.
 * @param {Function} props.handleClick - Function to handle left-click events on each cell.
 * @param {Function} props.handleRightClick - Function to handle right-click events on each cell.
 */
const MatrixRow = ({ tones, row, rowIndex, offset, visibleColumns, handleClick, handleRightClick }) => {
    
    /**
     * getCellClassName function
     *
     * Generates the appropriate CSS class for a matrix cell based on its note and position.
     * Applies specific styling for note cells and adds a divider every 4 cells for visual clarity.
     *
     * @param {number} colIndex - The column index relative to the row.
     * @param {Object} cell - Cell object containing note information (e.g., startIndex, cellCount, note).
     * @returns {string} - A string representing the cell's CSS class.
     */
    const getCellClassName = (colIndex, cell) => {
        const { startIndex, cellCount, note } = cell; // Assuming each cell has a note object like { startIndex, cellCount, note }

        // Check if the cell corresponds to the note's start position and length
        if (startIndex <= colIndex && colIndex < startIndex + cellCount) {
            // Apply a color based on the note
            return `matrix-cell ${note} ${((colIndex + 1) % 4 === 0) ? "matrix-cell-divider" : ""}`;
        }

        return `matrix-cell ${((colIndex + 1) % 4 === 0) ? "matrix-cell-divider" : ""}`;
    };

    return (
        <div key={rowIndex} className={`matrix-row ${(rowIndex + 1) % 12 === 0 ? "octave-divider" : ""}`}>
            <div className="matrix-tone">{tones[rowIndex]}</div>
            {row.slice(offset, offset + visibleColumns).map((cell, colIndex) => (
                <div
                    key={colIndex + offset}
                    className={getCellClassName(colIndex + offset, cell)}  // Dynamic class name based on note and position
                    onClick={() => handleClick(rowIndex, colIndex)}
                    onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                ></div>
            ))}
        </div>
    );
};

export default MatrixRow;
