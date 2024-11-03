import React, { useState, useRef, useEffect } from "react";
import '../style/Matrix.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NoteSelector from './NoteSelector';
import MatrixNavigation from './MatrixNavigation';
import MatrixHeader from './MatrixHeader';
import MatrixRow from './MatrixRow';
import Track from "../structures/Track.mjs"; // Ensure the path is correct

const Matrix = () => {
    const initialVisibleColumns = Math.floor(window.innerWidth / 40);
    const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);
    const [totalColumns, setTotalColumns] = useState(initialVisibleColumns);
    const [matrixData, setMatrixData] = useState(Array(60).fill().map(() => Array(initialVisibleColumns).fill('')));
    const [currentNote, setCurrentNote] = useState('');
    const [offset, setOffset] = useState(0);
    const [track, setTrack] = useState(new Track("UserTrack", '#FFFFFF')); // Track for user notes

    const scrollInterval = useRef(null);

    const tones = [
        "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
        "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
        "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
        "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
        "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6"
    ];

    const noteLengths = {
        whole: 16,
        half: 8,
        quarter: 4,
        eighth: 2
    };

    const addColumns = (num) => {
        setTotalColumns(prev => prev + num);
        setMatrixData(prevData =>
            prevData.map(row => [...row, ...Array(num).fill('')])
        );
    };

    const expandToFitNote = async (extraColumnsNeeded) => {
        let columnsToAdd = Math.ceil(extraColumnsNeeded / 4) * 4;
        if (columnsToAdd > 0) {
            addColumns(columnsToAdd);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    const handleLeftArrow = () => {
        if (offset > 0) {
            setOffset(prev => Math.max(0, prev - 4));
        }
    };

    const handleRightArrow = () => {
        if (offset + visibleColumns >= totalColumns) {
            addColumns(4);
        }
        setOffset(prev => prev + 4);
    };

    const startScrolling = (direction) => {
        if (scrollInterval.current) return;

        scrollInterval.current = setInterval(() => {
            if (direction === 'left') {
                handleLeftArrow();
            } else if (direction === 'right') {
                handleRightArrow();
            }
        }, 100);
    };

    const stopScrolling = () => {
        clearInterval(scrollInterval.current);
        scrollInterval.current = null;
    };

    const handleClick = async (row, col) => {
        const length = noteLengths[currentNote];
        const adjustedCol = col + offset;
        const endColumn = adjustedCol + length;

        let extraColumnsNeeded = Math.max(0, endColumn - totalColumns);
        await expandToFitNote(extraColumnsNeeded);

        setMatrixData(prevData => {
            const updatedData = prevData.map((rowData, rowIndex) =>
                rowIndex === row
                    ? rowData.map((cell, colIndex) => {
                        if (colIndex >= adjustedCol && colIndex < adjustedCol + length) {
                            // Add the note to the track
                            
                            var length2;
                            switch(length) {
                                case 16:
                                  length2 = "1n";
                                  break;
                                case 8:
                                    length2 = "2n";
                                  break;
                                  case 4:
                                    length2 = "4n";
                                  break;
                                  case 2:
                                    length2 = "8n";
                                  break;
                                default:
                                    length2 = "4n";
                              }

                            track.tones[row].insertNewNote(adjustedCol, length2); // Add the note to the track
                            return currentNote; // Update matrix cell with current note
                        }
                        return cell;
                    })
                    : rowData
            );
            return updatedData;
        });
    };

    const handleRightClick = (event, row, col) => {
        event.preventDefault();
        const length = noteLengths[currentNote];
        const actualCol = col + offset;
        setMatrixData(prevData => {
            const updatedData = prevData.map((rowData, rowIndex) =>
                rowIndex === row
                    ? rowData.map((cell, colIndex) => {
                        if (colIndex >= actualCol && colIndex < actualCol + length) {
                            // Clear the note from the matrix
                            track.tones[row].removeNote(actualCol); // Implement removeNote method in your Track class
                            return ''; // Clear the matrix cell
                        }
                        return cell;
                    })
                    : rowData
            );
            return updatedData;
        });
    };

    const handlePlay = async () => {
        await track.playFromIndex(); // Call the play method on the Track instance
    };

    return (
        <div className="matrix-container">
            <NoteSelector setCurrentNote={setCurrentNote} />
            <MatrixNavigation 
                handleLeftArrow={handleLeftArrow} 
                handleRightArrow={handleRightArrow} 
                startScrolling={startScrolling} 
                stopScrolling={stopScrolling} 
            />
            <button onClick={handlePlay}>Play Track</button> {/* Play button for the track */}
            <div className="matrix">
                <MatrixHeader visibleColumns={visibleColumns} offset={offset} />
                {matrixData.map((row, rowIndex) => (
                    <MatrixRow 
                        key={rowIndex} 
                        tones={tones} 
                        row={row} 
                        rowIndex={rowIndex} 
                        offset={offset} 
                        visibleColumns={visibleColumns} 
                        handleClick={handleClick} 
                        handleRightClick={handleRightClick} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Matrix;
