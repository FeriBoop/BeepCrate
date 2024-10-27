import React, { useState, useEffect, useRef } from "react";
import '../style/Matrix.css';

const Matrix = () => {
    const initialVisibleColumns = Math.floor(window.innerWidth / 40);
    const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);
    const [totalColumns, setTotalColumns] = useState(initialVisibleColumns);
    const [matrixData, setMatrixData] = useState(Array(60).fill().map(() => Array(initialVisibleColumns).fill('')));
    const [currentNote, setCurrentNote] = useState('');

    const tones = [
        "C1", "C1#", "D1", "D1#", "E1", "F1", "F1#", "G1", "G1#", "A1", "A1#", "B1",
        "C2", "C2#", "D2", "D2#", "E2", "F2", "F2#", "G2", "G2#", "A2", "A2#", "B2",
        "C3", "C3#", "D3", "D3#", "E3", "F3", "F3#", "G3", "G3#", "A3", "A3#", "B3",
        "C4", "C4#", "D4", "D4#", "E4", "F4", "F4#", "G4", "G4#", "A4", "A4#", "B4",
        "C5", "C5#", "D5", "D5#", "E5", "F5", "F5#", "G5", "G5#", "A5", "A5#", "B5"
    ];

    const containerRef = useRef();

    const noteLengths = {
        whole: 16,
        half: 8,
        quarter: 4,
        eighth: 2
    };

    const handleClick = (row, col) => {
        const length = noteLengths[currentNote];
        const updatedData = matrixData.map((rowData, rowIndex) =>
            rowIndex === row
                ? rowData.map((cell, colIndex) => {
                    if (colIndex >= col && colIndex < col + length) {
                        return currentNote; // Set the note color
                    }
                    return cell;
                })
                : rowData
        );
        setMatrixData(updatedData);
    };

    const handleRightClick = (event, row, col) => {
        event.preventDefault();
        const length = noteLengths[currentNote];
        const updatedData = matrixData.map((rowData, rowIndex) =>
            rowIndex === row
                ? rowData.map((cell, colIndex) => {
                    if (colIndex >= col && colIndex < col + length) {
                        return ''; // Reset the cell color
                    }
                    return cell;
                })
                : rowData
        );
        setMatrixData(updatedData);
    };

    return (
        <div className="matrix-container">
            <div className="note-selector">
                <button onClick={() => setCurrentNote('whole')}>Whole</button>
                <button onClick={() => setCurrentNote('half')}>Half</button>
                <button onClick={() => setCurrentNote('quarter')}>Quarter</button>
                <button onClick={() => setCurrentNote('eighth')}>Eighth</button>
            </div>
            <div className="matrix" ref={containerRef}>
                <div className="matrix-content">
                    <div className="matrix-header">
                        <div className="matrix-tone-header">TONES</div>
                        {Array.from({ length: visibleColumns }, (_, i) => (
                            <div
                                key={i}
                                className={`matrix-cell-header ${(i + 1) % 4 === 0 ? "matrix-cell-divider" : ""}`}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                    {matrixData.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`matrix-row ${(rowIndex + 1) % 12 === 0 ? "octave-divider" : ""}`}
                        >
                            <div className="matrix-tone">{tones[rowIndex]}</div>
                            {row.slice(0, visibleColumns).map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`matrix-cell ${cell} ${(colIndex + 1) % 4 === 0 ? "matrix-cell-divider" : ""}`}
                                    onClick={() => handleClick(rowIndex, colIndex)}
                                    onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Matrix;
