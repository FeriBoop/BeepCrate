import React from 'react';
import {TrackSettingsComponent} from "./TrackSettingsComponent";
import './TrackSettingsComponent.css'
import button from "bootstrap/js/src/button";

let Globals = require("../structures/GlobalVariables.mjs");

const noteSymbols = {
    whole: "1/1",
    half: "1/2",
    quarter: "1/4",
    eighth: "1/8",
    sixteenth: "1/16"
}

/**
 * This component is a frontend for track settings and playback control.
 * @prop {(newNote: string) => {}} onSelectedNoteChanged - Callback for when the selected note changes. Its parameter is a string representing the newly selected note
 * @prop {function(boolean)} onPlayingChanged - Callback for when the playing state changes.
 * @prop {function()} onRewindToIndex - Callback for when the 'Rewind to index' button is pressed.
 * @prop {function()} onRewindToBeginning - Callback for when the 'Rewind to beginning' button is pressed.
 */
class TrackControlComponent extends React.Component {

    state = {
        selectedNote: "whole",
        localRythm: Globals.BEATS,
        localBpm: Globals.BPM,
        playing: false,
        looping: false,
        volume: 50
    }

    constructor(props) {
        super(props);

        this.state.volume = this.props.track.volume;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedNote !== this.state.selectedNote) {
            if (this.props.onSelectedNoteChanged) this.props.onSelectedNoteChanged(this.state.selectedNote);
        }

        if (prevState.localBpm !== this.state.localBpm) Globals.setBpm(this.state.localBpm)
        if (prevState.localRythm !== this.state.localRythm) Globals.setBeats(this.state.localRythm);
        if (prevState.volume !== this.state.volume) this.props.track.volume = this.state.volume;
        if(prevState.playing !== this.state.playing){
            if(this.props.onPlayingChanged) this.props.onPlayingChanged(this.state.playing);
        }
    }

    //#region handlers

    #handleNoteSelectChange = (e) => {
        if (e.target.checked && this.state.selectedNote !== e.target.value) {
            this.setState({selectedNote: e.target.value});
        }
    }

    #handlePlayButtonClick = (e) => {
        this.setState({playing: !this.state.playing});
    }

    #handleRewindToIndex = (e) => {
        if(this.props.onRewindToIndex) this.props.onRewindToIndex();
    }

    #handleRewindToBeginning = (e) => {
        if(this.props.onRewindToBeginning) this.props.onRewindToBeginning();
    }

    //#endregion

    //#region renderers
    #renderNoteButtons() {
        let el = []
        for (let key in noteSymbols) {
            let label = noteSymbols[key];

            el.push(
                <label className={"col-auto g-2 wave-radio"}>
                    {label}
                    <input type={"radio"} value={key} checked={this.state.selectedNote === key}
                           style={{width: 0, height: 0}}
                           name={"noteSelection"}
                           onChange={this.#handleNoteSelectChange}/>
                </label>
            )
        }

        return el;
    }

    //#endregion

    render() {
        return (
            <div className={this.props.className} style={this.props.style}>
                <div className={"row"}>
                    <TrackSettingsComponent className={"col g-0"} settings={this.props.track.trackSettings}/>

                    {/* Note selection & rythm/bpm */}
                    <div className={"col-auto g-0"}>
                        <div className={"row g-0"}>
                            {this.#renderNoteButtons()}
                        </div>
                        <div className={"row g-0"}>
                            <div className={"col g-0"}>
                                <p>BPM</p>
                                <input type={"number"} min={20} max={300}
                                       value={this.state.localBpm}
                                       onChange={(e) => this.setState({localBpm: e.target.value})}/>
                            </div>
                            <div className={"col g-0"}>
                                <p>RYTHM</p>
                                <input type={"number"} min={2} max={10}
                                       value={this.state.localRythm}
                                       onChange={(e) => this.setState({localRythm: e.target.value})}/>
                            </div>
                        </div>
                    </div>

                    {/* Playback control */}
                    <div className={"col-auto g-0"}>
                        <div className={"row g-0"}>
                            <input type={"range"} min={-32} max={32} value={this.state.volume}
                            onChange={(e) => this.setState({volume: e.target.value})}/>
                        </div>
                        <div className={"row g-0"}>
                            <button
                                onClick={this.#handlePlayButtonClick}>
                                {this.state.playing ? "Pause" : "Play"}
                            </button>
                            <button onClick={this.#handleRewindToIndex}>
                                Rewind to index
                            </button>
                            <button onClick={this.#handleRewindToBeginning}>
                                Rewind to beginning
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TrackControlComponent
