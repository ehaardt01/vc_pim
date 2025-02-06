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
    let i = 0;
    while (i < filteredName.length) {
        let char = filteredName[i];
        if (char >= 'A' && char <= 'Z' && i + 1 < filteredName.length && filteredName[i + 1] >= 'A' && filteredName[i + 1] <= 'Z') {
            while (i < filteredName.length && filteredName[i] >= 'A' && filteredName[i] <= 'Z') {
                snakeCase += filteredName[i].toLowerCase();
                i++;
            }
            if (i < filteredName.length) {
                snakeCase += '_';
            }
        } else {
            if (char >= 'A' && char <= 'Z') {
                if (i > 0) {
                    snakeCase += '_';
                }
                char = char.toLowerCase();
            }
            snakeCase += char;
            i++;
        }
    }
    return snakeCase;
}

function load_mock(id) {
    const PATH = "https://raw.githubusercontent.com/ehaardt01/vc_pim/main/mocks/" + snake_case(id) + '_property_mock.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', PATH, false);
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error('Error loading JSON file:' + PATH, xhr.statusText);
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
function load(rootId, properties) {
    const rootRecord = fetchProduct(rootId);
    let record = {"id": rootRecord[id]};
    properties.forEach(property_id => {
        const fetched_property_record = load_mock(property_id);
        if (fetched_property_record) {
            property_value = fetched_record[property_id];
            if (property_value) {
                property_name = snake_case(property_id);
                localized_value = property_value[LOCALE];
                if (localized_value) {
                    record[property_name] = localized_value;
                } else {
                    record[property_name] = property_value;
                }
            }
        }
    });
    return record;
}
