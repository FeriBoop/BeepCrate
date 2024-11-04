import Track from "../Track.mjs";

/** Function that exports obj to JSON
 * it also automatically downloads a file
 * @param obj
 * @param name
 */
export function exportToJson(obj, name){
    const jsonData = JSON.stringify(obj, null, 2); // Convert object to JSON with pretty-printing
    const blob = new Blob([jsonData], { type: 'application/json' }); // Declaring binary file
    const url = URL.createObjectURL(blob); //creating url for binary file

    // Create a temporary link element to trigger the download, because react cannot write to files
    const link = document.createElement('a');
    link.href = url;
    link.download = name || 'data.json'; //download file with provided name
    document.body.appendChild(link);
    link.click(); //automatically click on download link

    // Clean up
    document.body.removeChild(link); //delete link
    URL.revokeObjectURL(url);
}

/** Function that imports from json a Track object
 * It returns a Track
 * @param event
 */
export function importFromJson(event, callback) {
    const file = event.target.files[0]; // Get the selected file. Currently only one file is allowed at the time

    if (file) {
        const reader = new FileReader(); //file reader

        // Set up the onload event to handle the file once it's read
        reader.onload = (e) => {
            try {
                const json = e.target.result; // Get the file content
                const parsedData = JSON.parse(json); // Parse the JSON string to an object

                // Creating new track from parsed one
                const track = Track.importFromJSONFile(parsedData); // Convert JSON to Track instance

                if (callback) { //when it is finnished it returns track
                    callback(track); // Call the callback with the track
                }
                // In case of error
            } catch (error) {
                return null;
            }
        };

        reader.readAsText(file); // Read the file as text
    }
}