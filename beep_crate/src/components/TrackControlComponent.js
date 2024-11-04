import React from 'react';
import {TrackSettingsComponent} from "./TrackSettingsComponent";
import './TrackSettingsComponent.css'
let Globals = require("../structures/GlobalVariables.mjs");

const noteSymbols = {
    whole: "1/1",
    half: "1/2",
    quarter: "1/4",
    eighth: "1/8",
    sixteenth: "1/16"
}

class TrackControlComponent extends React.Component {

    state = {
        selectedNote: "whole",
        localRythm: Globals.BEATS,
        localBpm: Globals.BPM,
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedNote !== this.state.selectedNote) {
            if (this.props.onSelectedNoteChanged) this.props.onSelectedNoteChanged(this.state.selectedNote);
        }

        if(prevState.localBpm !== this.state.localBpm) Globals.setBpm(this.state.localBpm)
        if(prevState.localRythm !== this.state.localRythm) Globals.setBeats(this.state.localRythm);
    }

    //#region handlers

    #handleNoteSelectChange = (e) => {
        if (e.target.checked && this.state.selectedNote !== e.target.value) {
            this.setState({selectedNote: e.target.value});
        }
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

                    </div>
                </div>
            </div>
        )
    }
}

export default TrackControlComponent
