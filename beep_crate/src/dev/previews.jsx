import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {TrackSettings} from "../components/TrackSettingsComponent";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/TrackSettings">
                <TrackSettings/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews