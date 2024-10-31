import React from "react";

const MatrixRow = ({ tones, row, rowIndex, offset, visibleColumns, handleClick, handleRightClick }) => {
    return (
        <div key={rowIndex} className={`matrix-row ${(rowIndex + 1) % 12 === 0 ? "octave-divider" : ""}`}>
            <div className="matrix-tone">{tones[rowIndex]}</div>
            {row.slice(offset, offset + visibleColumns).map((cell, colIndex) => (
                <div
                    key={colIndex + offset}
                    className={`matrix-cell ${cell} ${(colIndex + 1) % 4 === 0 ? "matrix-cell-divider" : ""}`}
                    onClick={() => handleClick(rowIndex, colIndex)}
                    onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                ></div>
            ))}
        </div>
    );
};

export default MatrixRow;
