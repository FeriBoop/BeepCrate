import React from "react";

const MatrixNavigation = ({ handleLeftArrow, handleRightArrow, startScrolling, stopScrolling }) => {
    return (
        <div className="matrix-navigation">
            <button 
                onMouseDown={() => startScrolling('left')}
                onMouseUp={stopScrolling}
                onMouseLeave={stopScrolling}
                onClick={handleLeftArrow}
            >
                <i className="fas fa-chevron-left"></i>
            </button>
            <button 
                onMouseDown={() => startScrolling('right')}
                onMouseUp={stopScrolling}
                onMouseLeave={stopScrolling}
                onClick={handleRightArrow}
            >
                <i className="fas fa-chevron-right"></i>
            </button>
        </div>
    );
};

export default MatrixNavigation;
