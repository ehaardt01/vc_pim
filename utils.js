/**
 * Converts a string to snake_case by removing special characters and converting camelCase/PascalCase to snake_case.
 * @param {string} variable_name - The string to be converted to snake_case.
 * @returns {string} The converted string in snake_case format.
 * @example
 * snake_case("HelloWorld") // returns "hello_world"
 * snake_case("My-Variable123") // returns "my_variable123"
 */
function snake_case(variable_name) {
    let filteredName = variable_name.replace(/[^a-zA-Z0-9]/g, '');
    let snakeCase = '';
    for (let i = 0; i < filteredName.length; i++) {
        let char = filteredName[i];
        if (char >= 'A' && char <= 'Z') {
            if (i > 0) {
                snakeCase += '_';
            }
            char = char.toLowerCase();
        }
        snakeCase += char;
    }
    return snakeCase;
}

function load_mock(mock_filename) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "./mocks/" + mock_filename, false);
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error('Error loading JSON file:', xhr.statusText);
        return null;
    }
}

/**
 * Retrieves a record by its ID and extracts specified properties
 * @param {string} record_id - The unique identifier of the record to load
 * @param {string[]} properties - Array of property IDs to extract from the record
 * @returns {Object} An object containing the requested properties in snake_case format
 * @description Fetches a record from Salsify API and creates a new object with only
 * the specified properties. Property names are converted to snake_case.
 * Only properties that exist in the fetched record are included in the result.
 */
function load_record(record_id, properties) {
    const PATH = '/records/';
    const fetched_record = load_mock('faq_property_mock.json');
    // const fetched_record = salsify(PATH + record_id);
    let record = {"id": record_id};
    properties.forEach(property_id => {
        property_value = fetched_record[property_id];
        if (property_value) {
            property_name = snake_case(property_id);
            record[property_name] = property_value;
        }
    });
    return record;
}
