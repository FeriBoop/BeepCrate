import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {WaveType, FilterType, Rolloff} from "../structures/Enums.mjs";
import './TrackSettingsComponent.css'

/**
 * A component for settings track settings. It can set all variables in the TrackSetting class aside from 'volume' and 'isMute'.
 * It requires 'settings' property to be set (a TrackSettings object).
 */
export class TrackSettingsComponent extends React.Component {

    constructor({settings: settings}) {
        super(arguments);
        this.state = {
            waveType: settings.waveType,
            detune: settings.detune,
            attack: settings.attack,
            decay: settings.decay,
            sustain: settings.sustain,
            release: settings.release,
            filterType: settings.filterType,
            cutoffFrequency: settings.cutoffFrequency,
            q: settings.q,
            rolloff: settings.rolloff,
            reverbAmount: settings.reverbAmount,
            cachedReverbAmount: settings.reverbAmount ?? 0,
            delayTime: settings.delayTime,
            cachedDelayTime: settings.delayTime ?? 0
        }
    }

    //#region Handlers

    /***
        Creates a generic handler which sets the TrackSettings property provided by 'propertyName'. Value in 'nullValue' will be stored as null.
     ***/
    #createInputHandler(propertyName, nullValue = null) {
        return (e) => {
            let val = e.target.value === nullValue ? null : e.target.value;
            console.log("New", propertyName + ":", val);
            let st = {};
            st[propertyName] = val;
            this.setState(st);
            this.props.settings[propertyName] = val;
        }
    }

    /***
     Event handler wor the checkbox which enables/disables delayTime.
     ***/
    #delayTimeCheckboxChanged = (e) => {
        if(e.target.checked){
            this.setState({delayTime: this.state.cachedDelayTime});
            this.props.settings.delayTime = this.state.cachedDelayTime;
        }
        else{
            this.setState({delayTime: null, cachedDelayTime: this.state.delayTime});
            this.props.settings.delayTime = null;
        }
    }

    #reverbAmountCheckboxChanged = (e) => {
        if(e.target.checked){
            this.setState({reverbAmount: this.state.cachedReverbAmount});
            this.props.settings.reverbAmount = this.state.cachedReverbAmount;
        }
        else{
            this.setState({reverbAmount: null, cachedReverbAmount: this.state.reverbAmount});
            this.props.settings.reverbAmount = null;
        }
    }

    //#endregion

    //#region Content generators

    /// Creates <options> elements for a select
    #populateSelect(enumType) {
        let selects = [];
        for (let option in enumType) {
            let val = enumType[option];
            selects.push(
                // Create options with enum values, or 'None' if value is null
                <option value={val ?? "none"}>{val ?? "none"}</option>
            )
        }
        return selects;
    }

    /***
     Generates radio buttons for the values of WaveType enum.
     ***/
    #populateWaveTypeRadioButtons() {
        let buttons = [];
        for (let type in WaveType) {
            let val = WaveType[type];
            if (val === "noise") continue; // stopgap until NOISE is removed from the enum
            buttons.push(
                <label className={"row wave-radio g-0"}>
                    <input type={"radio"}
                           name={"waveSelect"}
                           style={{width: 0, height: 0}} // Hide button
                           checked={this.state.waveType === val}
                           onChange={this.#createInputHandler("waveType")}
                           value={val}/>
                    <img src={"wave-" + val + ".png"} alt=""
                         style={{width: 64}}/>
                </label>
            )
        }
        return buttons;
    }

    /// creates a slider input with label and callback function
    #createSlider(label, onChangeCallback, valueGetter, labelWidth = 2) {
        return (
            <div className="col-auto">
                <div className="row container-fluid gx-0">
                    <div className={"col-" + labelWidth + " g-1"}>
                        <span className="text-center text-middle w-100">{label}</span>
                    </div>
                    <div className={"col g-1"}>
                        <input type={"range"}
                               className={"w-100"}
                               onChange={onChangeCallback}
                               value={valueGetter}
                               min={0} max={1}
                               step={0.01}
                        />
                    </div>
                    <div className={"col-auto g-1"}>
                        <input type={"number"}
                               className={"w-100"}
                               onChange={onChangeCallback}
                               value={valueGetter}
                               min={0} max={1}
                               step={0.001}
                        />
                    </div>
                </div>
            </div>
        )
    }

    //#endregion

    render() {
        return (
            <div className={"g-0 container-fluid " + (this.props.className === undefined ? "" : this.props.className)}
                 style={this.props.style}>
                <div className="row container-fluid gx-3">
                    {/*First section - Wave settings*/}
                    <div className="col-auto gx-2">
                        <h5 className={"text-center"}>WAVE</h5>
                        <div className="row container-fluid gx-0">
                            {/* Wave type selection*/}
                            <div className={"col-auto g-0"}>
                                {this.#populateWaveTypeRadioButtons()}
                            </div>
                            <div className={"col-auto g-0"}>
                                <span className="text-center">1200</span>
                                <div className="w-100"></div>
                                <input type={"range"}
                                       style={{writingMode: "vertical-lr", direction: "rtl"}}
                                       min={-1200} max={1200}
                                       step={1}
                                       value={this.state.detune}
                                       onChange={this.#createInputHandler("detune")}
                                />
                                <div className="w-100"></div>
                                <span className="text-center">-1200</span>
                            </div>
                        </div>

                    </div>

                    {/* Second section - Envelope settings*/}
                    <div className="col-sm-auto gx-2">
                        <h5 className={"text-center"}>ENVELOPE</h5>
                        {this.#createSlider("ATT", this.#createInputHandler("attack"), this.state.attack)}
                        {this.#createSlider("DEC", this.#createInputHandler("decay"), this.state.decay)}
                        {this.#createSlider("SUS", this.#createInputHandler("sustain"), this.state.sustain)}
                        {this.#createSlider("REL", this.#createInputHandler("release"), this.state.release)}
                    </div>

                    {/* Third section - Filter settings*/}
                    <div className="col-auto gx-2">
                        <h5 className={"text-center"}>FILTER</h5>
                        <div className="row gx-0">

                            {/* Filter type */}
                            <div className={"col-5 g-0"}>
                                <span className={"input-group-text"}>TYPE</span>
                            </div>
                            <select className={"col g-0"}
                                    onChange={this.#createInputHandler("filterType", "none")}
                                    value={this.state.filterType ?? "none"}
                            >
                                {this.#populateSelect(FilterType)}
                            </select>
                        </div>

                        {/* Filter cutoff frequency*/}
                        <div className="row gx-0">

                            <div className={"col-5 g-0"}>
                                <span className={"input-group-text"}>CUTOFF</span>
                            </div>
                            <input type={"number"}
                                   className={"col g-0"}
                                   disabled={this.state.filterType === null}
                                   min={1}
                                   max={22000}
                                   step={1}
                                   onChange={this.#createInputHandler("cutoffFrequency")}/>
                            <div className={"col-auto g-0"}>
                                <span className={"input-group-text"}>Hz</span>
                            </div>
                        </div>

                        {/* Rolloff */}
                        <div className="row gx-0">
                            <div className={"col-5 g-0"}>
                                <span className={"input-group-text"}>ROLLOFF</span>
                            </div>
                            <select className={"col g-0"}
                                    disabled={this.state.filterType === null}
                                    onChange={this.#createInputHandler("filterType")}
                                    value={this.state.rolloff}
                            >
                                {this.#populateSelect(Rolloff)}
                            </select>
                            <div className={"col-auto g-0"}>
                                <span className={"input-group-text"}>dB</span>
                            </div>
                        </div>
                    </div>

                    {/* Third section - Effects */}
                    <div className="col-auto gx-2">
                        <h5 className={"text-center"}>EFFECTS</h5>
                        <div className={"gx-0 row flex-row"}>
                            <div className={"col-5 g-0 my-auto"}>
                                <span className={"text-center"}>REVERB</span>
                            </div>
                            <div className={"col-2 gx-1 my-auto"}>
                                <input type={"checkbox"}
                                       checked={this.state.reverbAmount !== null}
                                       onChange={this.#reverbAmountCheckboxChanged}
                                />
                            </div>
                            <div className={"col g-0"}>
                                <input type={"number"}
                                       className={"w-100"}
                                       min={0} max={1}
                                       step={0.01}
                                       disabled={this.state.reverbAmount === null}
                                       value={this.state.reverbAmount}
                                       onChange={this.#createInputHandler("reverbAmount")}
                                />
                            </div>
                        </div>

                        <div className={"row container-fluid gx-0"}>
                            <div className={"col-5 g-0 my-auto"}>
                                <span className={"text-center"}>DELAY</span>
                            </div>
                            <div className={"col-2 gx-1 flex-column align-content-center"}>
                                <input type={"checkbox"}
                                       checked={this.state.delayTime !== null}
                                       onChange={this.#delayTimeCheckboxChanged}
                                />
                            </div>
                            <div className={"col g-0"}>
                                <input type={"number"}
                                       className={"w-100"}
                                       min={0} max={100}
                                       step={0.1}
                                       disabled={this.state.delayTime === null}
                                       value={this.state.delayTime}
                                       onChange={this.#createInputHandler("delayTime")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
