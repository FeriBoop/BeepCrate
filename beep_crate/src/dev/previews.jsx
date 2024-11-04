import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {TrackSettingsComponent} from "../components/TrackSettingsComponent";
import TrackSettings from "../structures/TrackSettings.mjs";
import Track from "../structures/Track.mjs";
import TrackControlComponent from "../components/TrackControlComponent";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/TrackSettings">
                <TrackSettingsComponent settings={new TrackSettings({waveType: "sine"})}/>
            </ComponentPreview>
            <ComponentPreview
                path="/TrackControlComponent">
                <TrackControlComponent track={new Track("Preview track", "#0f0f0f")}/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews