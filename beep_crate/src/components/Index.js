import React, { useRef } from "react";
import "../style/Index.css"; // Add styles if needed
import { Link } from "react-router-dom";
import Title from "./Title";

const Index = () => {
    const fileInputRef = useRef(null);

    const handleLoadTrack = () => {
        // Trigger the hidden file input to open the file explorer
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        // read file and us it for matrix, use functions already written by Rok Žerdoner
    };

    return (
        <div className="app-container">
            <Title />
            <p>
                Welcome to BeepCrate! Create, edit, and play your own musical sequences with ease.
                Use the intuitive interface to add notes, customize tracks, and experiment with
                different musical compositions. Whether you’re a beginner or a pro, BeepCrate has
                tools to help you bring your music ideas to life.
            </p>
            <p>
                Need help? Check out our <a href="/docs" target="_blank">documentation</a> for detailed instructions.
            </p>
            <div className="button-group">
                <button className="loadBtn" onClick={handleLoadTrack}>Load Track</button>
                <Link to="/matrix">
                    <button className="newBtn">New Track</button>
                </Link>
            </div>
            
            {/* Hidden file input for loading JSON files */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".json"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default Index;
