import React, {useState, useRef, useEffect} from "react";
import '../style/Matrix.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import MatrixNavigation from './MatrixNavigation';
import MatrixHeader from './MatrixHeader';
import MatrixRow from './MatrixRow';
import Track from "../structures/Track.mjs"; // Ensure the path is correct
import Title from "./Title";
import TrackControlComponent from "./TrackControlComponent";
import {exportToJson, importFromJson} from "../structures/ImportExport/ImportAndExport.mjs";
import Tone from "../structures/Tone.mjs";

/**
 * Matrix component represents a musical note matrix where users can add,
 * remove, and manipulate notes across 5 octaves and multiple columns.
 * The component also supports loading/saving tracks, and playing them.
 */
const Matrix = () => {
    const handlePlaybackStop = () => {
        console.log("Playback stopped")
        if (trackControlRef.current) {
            trackControlRef.current.setIsPlaying(false);
        }
    }

    const initialVisibleColumns = Math.floor(window.innerWidth / 40);
    const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);
    const [totalColumns, setTotalColumns] = useState(initialVisibleColumns);
    const [matrixData, setMatrixData] = useState(Array(60).fill().map(() => Array(initialVisibleColumns).fill('')));
    const [currentNote, setCurrentNote] = useState('whole');
    const [offset, setOffset] = useState(0);
    const [track, setTrack] = useState(new Track("UserTrack", '#FFFFFF', 5, 0, handlePlaybackStop)); // Track for user notes
    const [playPosition, setPlayPosition] = useState("start");

    const fileInputRef = useRef(null);
    const trackControlRef = useRef(null);

    const scrollInterval = useRef(null);

    const tones = [
        "B6", "A#6", "A6", "G#6", "G6", "F#6", "F6", "E6", "D#6", "D6", "C#6", "C6",  
        "B5", "A#5", "A5", "G#5", "G5", "F#5", "F5", "E5", "D#5", "D5", "C#5", "C5",  
        "B4", "A#4", "A4", "G#4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C#4", "C4",  
        "B3", "A#3", "A3", "G#3", "G3", "F#3", "F3", "E3", "D#3", "D3", "C#3", "C3",  
        "B2", "A#2", "A2", "G#2", "G2", "F#2", "F2", "E2", "D#2", "D2", "C#2", "C2",  
    ];

    const noteLengths = {
        whole: 16,
        half: 8,
        quarter: 4,
        eighth: 2,
        sixteenth: 1
    };

    /**
     * Load a track from a JSON file
     */
    const [importedTrack, setImportedTrack] = useState();

    const handleLoadTrack = () => {
        fileInputRef.current.click();
    };

    /**
     * Handle file input change event for loading a track from JSON.
     * @param {*} event - File input change event
     */
    const handleFileChange = (event) => {
        importFromJson(event, (track) => {
            console.log("Imported Track:", track);
            setImportedTrack(track); // Save the track in state
        });
    };

    /**
     * Effect to load imported track data into the matrix when an imported track is set.
     */
    useEffect(() => {
        if (importedTrack) {
            // Calculate the required number of columns based on the imported track
            const maxColumnsNeeded = importedTrack.tones.reduce((max, tone) => {
                const notes = tone.getAllNotes();
                return Math.max(max, notes.size); // Get the maximum number of notes across all tones
            }, 0);

            // Update the total columns if the imported data requires more
            if (maxColumnsNeeded > totalColumns) {
                addColumns(maxColumnsNeeded - totalColumns); // Add necessary columns
            }

            const newMatrixData = Array(60).fill().map(() => Array(totalColumns).fill(''));
            importedTrack.tones.forEach((tone, rowIndex) => {
                const notes = tone.getAllNotes(); // Get the unitBlocks Map
                notes.forEach((length, x) => { // Correctly destructure length and x
                    let length2;
                    let cellCount;
                    switch (length) {
                        case "1n":
                            cellCount = noteLengths.whole;
                            length2 = "whole";
                            break;
                        case "2n":
                            cellCount = noteLengths.half;
                            length2 = "half";
                            break;
                        case "4n":
                            cellCount = noteLengths.quarter;
                            length2 = "quarter";
                            break;
                        case "8n":
                            cellCount = noteLengths.eighth;
                            length2 = "eighth";
                            break;
                        case "16n":
                            cellCount = noteLengths.sixteenth;
                            length2 = "sixteenth";
                            break;
                        default:
                            console.warn(`Unknown note length: ${length}`);
                            return;
                    }

                    // Fill the cells based on the length
                    for (let i = 0; i < cellCount; i++) {
                        if (x + i < totalColumns) {
                            newMatrixData[rowIndex][x + i] = {note: length2, startIndex: x, cellCount}; // Fill the cell with the tone name
                        }
                    }
                });
            });
            setMatrixData(newMatrixData);
            // Add handler to new object
            importedTrack.onPlaybackStopped = handlePlaybackStop;
            setTrack(importedTrack);
        }
    }, [importedTrack, totalColumns]);
    /**
     * Add columns to the matrix as needed to fit additional notes.
     * @param {number} num - Number of columns to add
     */
    const addColumns = (num) => {
        setTotalColumns(prev => prev + num);
        setMatrixData(prevData =>
            prevData.map(row => [...row, ...Array(num).fill('')])
        );
    };

    /**
     * Expand columns to fit a note if it overflows the current matrix view.
     * @param {number} extraColumnsNeeded - Number of extra columns needed
     */
    const expandToFitNote = async (extraColumnsNeeded) => {
        let columnsToAdd = Math.ceil(extraColumnsNeeded / 4) * 4;
        if (columnsToAdd > 0) {
            addColumns(columnsToAdd);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    /**
     * Navigate left in the matrix, reducing offset if possible.
     */
    const handleLeftArrow = () => {
        if (offset > 0) {
            setOffset(prev => Math.max(0, prev - 4));
        }
    };

    /**
     * Start scrolling in the specified direction ('left' or 'right').
     * @param {string} direction - Direction to scroll
     */
    const handleRightArrow = () => {
        if (offset + visibleColumns >= totalColumns) {
            addColumns(4);
        }
        setOffset(prev => prev + 4);
    };

    /**
     * Stop scrolling in either direction.
     */
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

    /**
     * Handle left-click on a matrix cell to add a note.
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    const handleClick = async (row, col) => {
        const length = noteLengths[currentNote];
        const cellCount = length;
        const adjustedCol = col + offset;
        const endColumn = adjustedCol + length;
// Determine if extra columns are needed to fit the note length
        let extraColumnsNeeded = Math.max(0, endColumn - totalColumns);
        await expandToFitNote(extraColumnsNeeded);
// Check if any cell in the range already has a note
        const isOccupied = matrixData[row].slice(adjustedCol, endColumn).some(cell => cell !== '');
        if (isOccupied) {
            alert("Please remove the existing note first.");
            return;
        }

        // Determine the note symbol (e.g., "4n") based on the length
        let length2;
        switch (length) {
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
            case 1:
                length2 = "16n";
                break;
            default:
                length2 = "4n";
        }
// Insert the note only at the first cell in the range in `track`
        track.tones[row].insertNewNote(adjustedCol, length2);

        // Update the matrix data to store both the note length and start index
        setMatrixData(prevData => {
            const updatedData = prevData.map((rowData, rowIndex) =>
                rowIndex === row
                    ? rowData.map((cell, colIndex) =>
                        (colIndex >= adjustedCol && colIndex < endColumn)
                            ? {note: currentNote, startIndex: adjustedCol, cellCount}
                            : cell
                    )
                    : rowData
            );
            return updatedData;
        });
    };

    /**
     * Handle right-click on a matrix cell to remove a note.
     * @param {Event} event - Mouse event for the right-click
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    const handleRightClick = (event, row, col) => {
        event.preventDefault();
        const actualCol = col + offset;
// Find the note that starts at the clicked column
        const noteData = matrixData[row][actualCol];
        if (!noteData || !noteData.note) {
            return; // No note at the clicked position
        }

        const {startIndex, cellCount} = noteData;
        const endColumn = startIndex + cellCount;

        setMatrixData(prevData => {
            const updatedData = prevData.map((rowData, rowIndex) =>
                rowIndex === row
                    ? rowData.map((cell, colIndex) =>
                        (colIndex >= startIndex && colIndex < endColumn) ? '' : cell
                    )
                    : rowData
            );

            // Remove the note only from the track at the correct start column
            track.tones[row].removeNote(startIndex);

            return updatedData;
        });
    };

    /**
     * Play the track
     */
    const handlePlayChanged = (playing) => {
        if (!playing) track.stopPlayingTrack()
        else if (playPosition === "index") track.playFromIndex().then();
        else if (playPosition === "start") track.playFromBeginning().then();
    }

    /**
     * Save the track to a JSON file
     */
    const handleSave = () => {
        if (track) {
            track.exportToAFile("testExport.json")
        }
    }

    return (
        <div className="vh-100 d-flex flex-column">
            <Title/>

            <div className={"d-flex flex-row overflow-hidden"}>
                <div className={"d-flex flex-column overflow-y-auto"}>
                    <div className={"d-flex flex-row justify-content-start"}>
                        <button onClick={handleLoadTrack}>Load Track</button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{display: "none"}}
                            accept=".json"
                            onChange={handleFileChange}
                        />
                        <button onClick={handleSave}>Save</button>
                    </div>

                    <TrackControlComponent className={"d-flex flex-column"}
                                           track={track}
                                           ref={trackControlRef}
                                           onSelectedNoteChanged={setCurrentNote}
                                           playPositionSelected={playPosition}
                                           onPlayingChanged={handlePlayChanged}
                                           onRewindToIndex={() => {
                                               setPlayPosition("index")
                                           }}
                                           onRewindToBeginning={() => {
                                               setPlayPosition("start")
                                           }}
                    />
                    {/* Load/save buttons*/}

                </div>

                <MatrixNavigation
                    handleLeftArrow={handleLeftArrow}
                    handleRightArrow={handleRightArrow}
                    startScrolling={startScrolling}
                    stopScrolling={stopScrolling}
                />

                <div className="matrix">
                    <MatrixHeader visibleColumns={visibleColumns} offset={offset}/>
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
        </div>
    );
};

export default Matrix;
