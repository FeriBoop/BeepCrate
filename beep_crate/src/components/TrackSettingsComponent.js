import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import {WaveType, FilterType, Rolloff} from "../structures/Enums.mjs";
import '../style/SharedStyle.css'

/**
 * A component for manipulating track settings. It can set all variables in the TrackSetting class aside from 'volume' and 'isMute'.
 * @prop {TrackSettings} settings - mandatory, A TrackSettings object,
 * @see TrackSettings
 */
export class TrackSettingsComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            waveType: props.settings.waveType,
            detune: props.settings.detune,
            attack: props.settings.attack,
            decay: props.settings.decay,
            sustain: props.settings.sustain,
            release: props.settings.release,
            filterType: props.settings.filterType,
            cutoffFrequency: props.settings.cutoffFrequency,
            q: props.settings.q,
            rolloff: props.settings.rolloff,
            reverbAmount: props.settings.reverbAmount,
            cachedReverbAmount: props.settings.reverbAmount ?? 0,
            delayTime: props.settings.delayTime,
            cachedDelayTime: props.settings.delayTime ?? 0
        }
    }

    //#region Handlers

    /*** @private
     Creates a value setting handler for the specified TrackSettings property.
     @prop {string} propertyName - Specified TrackSettings property
     @prop {any} nullValue - Value which will be stored as null.
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

    /*** @private
     Event handler for the checkbox which enables/disables delayTime.
     ***/
    #delayTimeCheckboxChanged = (e) => {
        if (e.target.checked) {
            this.setState({delayTime: this.state.cachedDelayTime});
            this.props.settings.delayTime = this.state.cachedDelayTime;
        } else {
            this.setState({delayTime: null, cachedDelayTime: this.state.delayTime});
            this.props.settings.delayTime = null;
        }
    }
    /*** @private
     Event handler for the checkbox which enables/disables reverb.
     ***/
    #reverbAmountCheckboxChanged = (e) => {
        if (e.target.checked) {
            this.setState({reverbAmount: this.state.cachedReverbAmount});
            this.props.settings.reverbAmount = this.state.cachedReverbAmount;
        } else {
            this.setState({reverbAmount: null, cachedReverbAmount: this.state.reverbAmount});
            this.props.settings.reverbAmount = null;
        }
    }

    //#endregion

    //#region Content generators

    /** @private
     * Creates <option> elements with values defined in the provided enum. Values that are 'null' will be converted to "none" strings.
     * @param enumType - The enum object.
     * @returns {*[]} - An array of <option> elements.
     * @see
     */
    #populateSelect(enumType) {
        let selects = [];
        for (let option in enumType) {
            let val = enumType[option] ?? "none";
            selects.push(// Create options with enum values, or 'None' if value is null
                <option key={val} value={val}>{val}</option>)
        }
        return selects;
    }

    /** @private
     * Generates radio buttons with images for each value of the WaveType enum.
     * Assumes each value has a corresponding wave-{value}.svg in public/icons.
     * @returns {*[]} - An array of <label> elements
     * @see WaveType
     */
    #populateWaveTypeRadioButtons() {
        let buttons = [];
        for (let type in WaveType) {
            let val = WaveType[type];
            buttons.push(<label className={"image-radio no-gutters"}
                                style={{maxWidth: "64px"}}
                                key={val}>
                <input type={"radio"}
                       name={"waveSelect"}
                       checked={this.state.waveType === val}
                       onChange={this.#createInputHandler("waveType")}
                       value={val}/>
                <img src={`icons/wave-${val}.svg`} alt=""/>
            </label>)
        }
        return buttons;
    }

    /** @private
     * Creates a slider with a label and a numeric input. The value range is set to [0, 1].
     * @param {string} label - Text to display alongside the slider.
     * @param onChangeCallback - Value change callback
     * @param valueGetter - Value tied to control
     * @param labelWidth - Column width of the label [0-12]
     * @returns {Element} - The slider element
     */
    #createSlider(label, onChangeCallback, valueGetter, labelWidth = 2) {
        return (<div className="row d-flex flex-row g-2">
            <div className={"col-" + labelWidth + " d-flex flex-column justify-content-center"}>
                <span className="text-center text-middle w-100">{label}</span>
            </div>
            <div className={"col d-flex flex-column justify-content-center"}>
                <input type={"range"}
                       className={"w-100 align-self-stretch"}
                       onChange={onChangeCallback}
                       value={valueGetter}
                       min={0} max={1}
                       step={0.01}
                />
            </div>
            <div className={"col-auto"}>
                <input type={"number"}
                       className={"w-100"}
                       onChange={onChangeCallback}
                       value={valueGetter}
                       min={0} max={1}
                       step={0.001}
                />
            </div>
        </div>)
    }

    //#endregion

    render() {
        return (<div className={this.props.className}
                     style={this.props.style}>
            <div className="d-flex flex-column no-gutters">

                {/*First section - Wave settings*/}
                <div className="">
                    <h5 className={"text-center"}>WAVE</h5>
                    <div className="d-flex flex-column g-0 justify-content-center">
                        {/* Wave type selection*/}
                        <div className={"row d-flex flex-row g-0"}>
                            {this.#populateWaveTypeRadioButtons()}
                        </div>
                        <div className={"row d-flex flex-row-reverse justify-content-stretch align-content-center"}>
                            <span className="col-auto text-center">1200</span>
                            <input type={"range"}
                                   className={"col"}
                                   min={-1200} max={1200}
                                   step={1}
                                   value={this.state.detune}
                                   onChange={this.#createInputHandler("detune")}
                            />
                            <span className="col-auto text-center">-1200</span>
                        </div>
                    </div>

                </div>

                {/* Second section - Envelope settings*/}
                <div className="d-flex flex-column">
                    <h5 className={"text-center"}>ENVELOPE</h5>
                    {this.#createSlider("ATT", this.#createInputHandler("attack"), this.state.attack)}
                    {this.#createSlider("DEC", this.#createInputHandler("decay"), this.state.decay)}
                    {this.#createSlider("SUS", this.#createInputHandler("sustain"), this.state.sustain)}
                    {this.#createSlider("REL", this.#createInputHandler("release"), this.state.release)}
                </div>

                {/* Third section - Filter settings*/}
                <div className="d-flex flex-column g-0">
                    <h5 className={"text-center"}>FILTER</h5>

                    {/* Filter type */}
                    <div className="row g-0">
                        <div className={"col-5"}>
                            <span className={"input-group-text"}>TYPE</span>
                        </div>
                        <select className={"col"}
                                onChange={this.#createInputHandler("filterType", "none")}
                                value={this.state.filterType ?? "none"}
                        >
                            {this.#populateSelect(FilterType)}
                        </select>
                    </div>

                    {/* Filter cutoff frequency*/}
                    <div className="row g-0">
                        <div className={"col-5"}>
                            <span className={"input-group-text"}>CUTOFF</span>
                        </div>
                        <input type={"number"}
                               className={"col"}
                               disabled={this.state.filterType === null}
                               min={1}
                               max={22000}
                               step={1}
                               value={this.state.cutoffFrequency}
                               onChange={this.#createInputHandler("cutoffFrequency")}/>
                        <div className={"col-auto"}>
                            <span className={"input-group-text"}>Hz</span>
                        </div>
                    </div>

                    {/* Rolloff */}
                    <div className="row g-0">
                        <div className={"col-5"}>
                            <span className={"input-group-text"}>ROLLOFF</span>
                        </div>
                        <select className={"col"}
                                disabled={this.state.filterType === null}
                                onChange={this.#createInputHandler("rolloff")}
                                value={this.state.rolloff}
                        >
                            {this.#populateSelect(Rolloff)}
                        </select>
                        <div className={"col-auto"}>
                            <span className={"input-group-text"}>dB</span>
                        </div>
                    </div>
                </div>

                {/* Third section - Effects */}
                <div className="d-flex flex-column ">
                    <h5 className={"text-center"}>EFFECTS</h5>
                    <table>
                        <tbody>
                        <tr>
                            <td><span className={"text-center"}>REVERB</span></td>
                            <td><input type={"checkbox"}
                                       checked={this.state.reverbAmount !== null}
                                       onChange={this.#reverbAmountCheckboxChanged}
                            /></td>
                            <td><input type={"number"}
                                       className={"w-100"}
                                       min={0} max={1}
                                       step={0.01}
                                       disabled={this.state.reverbAmount === null}
                                       value={this.state.reverbAmount ?? this.state.cachedReverbAmount}
                                       onChange={this.#createInputHandler("reverbAmount")}
                            /></td>
                        </tr>
                        <tr>
                            <td><span className={"text-center"}>DELAY</span>
                            </td>
                            <td>
                                <input type={"checkbox"}
                                       checked={this.state.delayTime !== null}
                                       onChange={this.#delayTimeCheckboxChanged}
                                />
                            </td>
                            <td><input type={"number"}
                                       className={"w-100"}
                                       min={0} max={100}
                                       step={0.1}
                                       disabled={this.state.delayTime === null}
                                       value={this.state.delayTime ?? this.state.cachedDelayTime}
                                       onChange={this.#createInputHandler("delayTime")}
                            /></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>)
    }
}
