// Matrix.jsx
import React, { useState } from "react";
import '../style/Matrix.css';

const Matrix = () => {
    const [matrixData, setMatrixData] = useState(Array(60).fill(Array(12).fill(false)));
    const tones = [
        "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
        "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
        "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
        "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
        "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
    ];

    const handleClick = (row, col) => {
        const updatedData = matrixData.map((rowData, rowIndex) =>
            rowIndex === row
                ? rowData.map((cell, colIndex) => (colIndex === col ? !cell : cell))
                : rowData
        );
        setMatrixData(updatedData);
    };

    const handleRightClick = (event, row, col) => {
        event.preventDefault(); // Prevent default context menu
        const updatedData = matrixData.map((rowData, rowIndex) =>
            rowIndex === row
                ? rowData.map((cell, colIndex) => (colIndex === col ? false : cell))
                : rowData
        );
        setMatrixData(updatedData);
    };

    return (
        <div className="matrix">
            {/* Header row with TONES label and numbered column headers */}
            <div className="matrix-header">
                <div className="matrix-tone-header">TONES</div>
                {Array.from({ length: matrixData[0].length }, (_, i) => (
                    <div
                        key={i}
                        className={`matrix-cell-header ${((i + 1) % 4 === 0) ? "thick-border" : ""}`}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>

            {matrixData.map((row, rowIndex) => (
                <div key={rowIndex} className={`matrix-row ${((rowIndex + 1) % 12 === 0) ? "solid-border" : ""}`}>
                    <div className="matrix-tone">{tones[rowIndex]}</div>
                    {row.map((cell, colIndex) => (
                        <div
                            key={colIndex}
                            className={`matrix-cell ${cell ? "active" : ""} ${((colIndex + 1) % 4 === 0) ? "thick-border" : ""}`}
                            onClick={() => handleClick(rowIndex, colIndex)}
                            onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)} // Right-click event handler
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Matrix;
