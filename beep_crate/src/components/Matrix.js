import React, { useState, useRef } from "react";
import '../style/Matrix.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NoteSelector from './NoteSelector';
import MatrixNavigation from './MatrixNavigation';
import MatrixHeader from './MatrixHeader';
import MatrixRow from './MatrixRow';

const Matrix = () => {
    const initialVisibleColumns = Math.floor(window.innerWidth / 40);
    const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);
    const [totalColumns, setTotalColumns] = useState(initialVisibleColumns);
    const [matrixData, setMatrixData] = useState(Array(60).fill().map(() => Array(initialVisibleColumns).fill('')));
    const [currentNote, setCurrentNote] = useState('');
    const [offset, setOffset] = useState(0);

    const scrollInterval = useRef(null);

    const tones = [
        "C1", "C1#", "D1", "D1#", "E1", "F1", "F1#", "G1", "G1#", "A1", "A1#", "B1",
        "C2", "C2#", "D2", "D2#", "E2", "F2", "F2#", "G2", "G2#", "A2", "A2#", "B2",
        "C3", "C3#", "D3", "D3#", "E3", "F3", "F3#", "G3", "G3#", "A3", "A3#", "B3",
        "C4", "C4#", "D4", "D4#", "E4", "F4", "F4#", "G4", "G4#", "A4", "A4#", "B4",
        "C5", "C5#", "D5", "D5#", "E5", "F5", "F5#", "G5", "G5#", "A5", "A5#", "B5"
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
                            return currentNote;
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
                            return '';
                        }
                        return cell;
                    })
                    : rowData
            );
            return updatedData;
        });
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
