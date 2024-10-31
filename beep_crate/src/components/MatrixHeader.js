import React from "react";

const MatrixHeader = ({ visibleColumns, offset }) => {
    return (
        <div className="matrix-header">
            <div className="matrix-tone-header">TONES</div>
            {Array.from({ length: visibleColumns }, (_, i) => (
                <div
                    key={i + offset}
                    className={`matrix-cell-header ${(i + 1) % 4 === 0 ? "matrix-cell-divider" : ""}`}
                >
                    {i + 1 + offset}
                </div>
            ))}
        </div>
    );
};

export default MatrixHeader;
