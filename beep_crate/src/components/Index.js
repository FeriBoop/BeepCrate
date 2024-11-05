import React, { useRef, useState } from "react";
import "../style/Index.css";
import { Link } from "react-router-dom";
import Title from "./Title";

const Index = () => {
    const fileInputRef = useRef(null);

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
                <Link to="/matrix">
                    <button className="newBtn">New Track</button>
                </Link>
            </div>
            

        </div>
    );
};

export default Index;
