import React from 'react';
import {TrackSettingsComponent} from "./TrackSettingsComponent";
import '../style/SharedStyle.css'
import '../style/TrackControlComponent.css'

let Globals = require("../structures/GlobalVariables.mjs");

/**
 * An array of note symbol names.
 * @type {string[]}
 */
const noteSymbols = ["whole", "half", "quarter", "eighth", "sixteenth"]

/**
 * This component is a frontend for track settings and playback control.
 * @prop {Track} Track - A mandatory Track object.
 * @prop {function(string)} onSelectedNoteChanged - Callback for when the selected note changes. Its parameter is a string representing the newly selected note
 * @prop {function(boolean)} onPlayingChanged - Callback for when the playing state changes.
 * @prop {function()} onRewindToIndex - Callback for when the 'Rewind to index' button is pressed.
 * @prop {function()} onRewindToBeginning - Callback for when the 'Rewind to beginning' button is pressed.
 * @see Track
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
        if (prevState.volume !== this.state.volume)
            this.props.track.volume = this.state.volume;
        if(prevState.playing !== this.state.playing){
            if(this.props.onPlayingChanged) this.props.onPlayingChanged(this.state.playing);
        }
    }

    /**
     * Sets the playing state.
     * @param {boolean} playing - true if sound is playing, false otherwise
     */
    setIsPlaying(playing){
        this.setState({playing: playing});
    }

    //#region handlers

    /** @private
     * Handler for not selection change.
     */
    #handleNoteSelectChange = (e) => {
        if (e.target.checked && this.state.selectedNote !== e.target.value) {
            this.setState({selectedNote: e.target.value});
        }
    }
    /** @private
     * Handler for play/pause button clicks .
     */
    #handlePlayButtonClick = (e) => {
        this.setState({playing: !this.state.playing});
    }

    /** @private
     * Handler for rewind to index button click.
     */
    #handleRewindToIndex = (e) => {
        if(this.props.onRewindToIndex) this.props.onRewindToIndex();
    }

    /** @private
     * handler for rewind to beginning button click.
     */
    #handleRewindToBeginning = (e) => {
        if(this.props.onRewindToBeginning) this.props.onRewindToBeginning();
    }

    //#endregion

    //#region renderers

    /** @private
     * Creates radio buttons with images for notes.
     * Assumes each note symbol name has a corresponding 'note-{name}.svg' icon file in public/icons.
     * @returns {*[]} - An array of <label> elements.
     * @see noteSymbols
     */
    #renderNoteButtons() {
        let el = []
        for (let key of noteSymbols) {

            el.push(
                <label className={"col image-radio note-radio"} key={key}>
                    <img src={`icons/note-${key}.svg`} alt={key}/>
                    <input type={"radio"} value={key} checked={this.state.selectedNote === key}
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
                <div className={"d-flex flex-column no-gutters"}>
                    {/* Playback control */}
                    <div className={" d-flex flex-column"}>
                        <h5 className={"text-center"}>VOLUME</h5>
                        <div className={"row g-0"}>
                            <input type={"range"} min={-32} max={32} value={this.state.volume}
                                   onChange={(e) => this.setState({volume: e.target.value})}/>
                        </div>
                        <div className={"w-100 h-50"}>{/*Spacer*/}</div>
                        <h5 className={"text-center"}>PLAYBACK</h5>
                        <div className={"row d-flex justify-content-center g-0"}>
                            <button className={"col playback-control"}
                                    onClick={this.#handlePlayButtonClick}>
                                <img src={this.state.playing ? "icons/button-pause.svg" : "icons/button-play.svg"} alt={"Play button icon"}/>
                            </button>
                            <button className={"col playback-control"}
                                    style={this.props.playPositionSelected === 'index' ? {backgroundColor: '#aaaaaa'} : null}
                                    onClick={this.#handleRewindToIndex}>
                                <img src={"icons/button-rewind-to-index.svg"}
                                     alt={"Play button icon"}/>
                            </button>
                            <button className={"col playback-control"}
                                    style={this.props.playPositionSelected === 'start' ? {backgroundColor: '#aaaaaa'} : null}
                                    onClick={this.#handleRewindToBeginning}>
                                <img src={"icons/button-rewind-to-start.svg"}
                                     alt={"Play button icon"}/>
                            </button>

                        </div>
                    </div>

                    {/* Note selection & rythm/bpm */}
                    <div className={"d-flex flex-column justify-content-start"}>
                        <h5 className={"text-center"}>NOTE SELECTION</h5>
                        <div className={"row d-flex justify-content-center g-0"}>
                            {this.#renderNoteButtons()}
                        </div>
                        <div className={"w-100 h-25"}></div>
                        <div className={"row g-0"}>
                            <div className={"col d-flex flex-column"}>
                                <p className={"text-center"}>BPM</p>
                                <input type={"number"} min={20} max={300}
                                       className={"w-50 align-self-center"}
                                       value={this.state.localBpm}
                                       onChange={(e) => this.setState({localBpm: e.target.value})}
                                       disabled={true/* enable when BPM issues are fixed*/}/>
                            </div>
                            <div className={"col d-flex flex-column"}>
                                <p className={"text-center gy-0"}>RYTHM</p>
                                <input type={"number"} min={2} max={10}
                                       className={"w-50 align-self-center"}
                                       value={this.state.localRythm}
                                       onChange={(e) => this.setState({localRythm: e.target.value})}
                                       disabled={true /* enable when BEATS issues are fixed*/}
                                />
                            </div>
                        </div>
                    </div>

                    <TrackSettingsComponent className={"d-flex flex-column overflow-y-auto overflow-x-hidden"} settings={this.props.track.trackSettings}/>
                </div>
            </div>
        )
    }
}

export default TrackControlComponent
