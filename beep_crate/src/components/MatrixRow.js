import React from "react";

const MatrixRow = ({ tones, row, rowIndex, offset, visibleColumns, handleClick, handleRightClick }) => {
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
