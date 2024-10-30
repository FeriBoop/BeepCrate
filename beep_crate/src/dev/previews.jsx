import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {TrackSettingsComponent} from "../components/TrackSettingsComponent";
import TrackSettings from "../structures/TrackSettings.mjs";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/TrackSettings">
                <TrackSettingsComponent settings={new TrackSettings({waveType: "sine"})}/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews