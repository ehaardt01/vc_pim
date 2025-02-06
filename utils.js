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

/**
 * Loads mock data from a JSON file hosted on GitHub
 * @param {string} id - The identifier used to construct the file path. Will be converted to snake case.
 * @returns {Object|null} The parsed JSON data if successful, null if there was an error
 * @throws {Error} May throw a parsing error if the JSON is invalid
 * @example
 * const mockData = load_mock('testId'); // Loads from testId_property_mock.json
 */
function load_mock(id) {
    const PATH = "https://raw.githubusercontent.com/ehaardt01/vc_pim/main/mocks/" + snake_case(id) + '_property_mock.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', PATH, false);
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error('Error loading JSON file : ' + PATH, xhr.statusText);
        return null;
    }
}

/**
 * Determines the type of the input value with specific handling for string arrays
 * @param {*} value - The value to check
 * @returns {string} Returns one of:
 *   - 'undefined' if the value is undefined
 *   - 'string' if the value is a string
 *   - 'string_array' if the value is an array containing only strings
 *   - 'other' for any other type
 */
function retrieve_type(value) {
    if (typeof value === 'undefined') {
        return 'undefined';
    } else if (typeof value === 'string') {
        return 'string';
    } else if (Array.isArray(value)) {
        if (value.every(item => typeof item === 'string')) {
            return 'string_array';
        } else {
            return 'other';
        }
    } else {
        return 'other';
    }
}

function retrieve_records(string_array) {
    let records = [];
    string_array.forEach(item => {
        records.push(fetchPropertyRecord(item));
    });
    return records;
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
function load(rootId, properties, is_product=true) {
    var rootRecord;
    if (is_product) {
        rootRecord = fetchProduct(rootId);
    } else {
        rootRecord = fetchRecord(rootId);
    }
    let record = {"id": rootId};
    properties.forEach(property => {
        const property_type = property["type"];
        const property_name = property["name"];
        if (!property_type) {
            console.error('property_type is missing in ' + property);
            return;
        }
        if (!property_name) {
            console.error('property_name is missing in ' + property);
            return;
        }
        let property_export_name = property["export_name"];
        if (!property_export_name) {
            property_export_name = snake_case(property_name);
        }
        switch (property_type) {
            case "direct":
                record[property_export_name] = rootRecord[property_name];
                break;
            case "record":
                returned_values = property["values"];
                if (!returned_values) {
                    console.error('property_values is missing in ' + property);
                    return;
                }
                returned_type = retrieve_type(rootRecord[property_name]);
                switch (returned_type) {
                    case "string":
                        record[property_export_name] = load(rootRecord[property_name], returned_values, false);
                        break;
                    case "string_array":
                        record[property_export_name] = []
                        rootRecord[property_name].forEach(item => {
                            record[property_export_name].push(load(item, returned_values, false));
                        });
                        break;
                    default:
                        console.error('Unexpected type for ' + property_name + ' in ' + rootRecord);
                        break;
                }
                break;
            case "enumerated":
                returned_type = retrieve_type(rootRecord[property_name]);
                switch (returned_type) {
                    case "string":
                        record[property_export_name] = rootRecord[property_name];
                        break;
                    case "string_array":
                        record[property_export_name] = rootRecord[property_name].join(',');
                        break;
                    default:
                        console.error('Unexpected type for ' + property_name + ' in ' + rootRecord);
                        break;
                }
                break;
                // Ajoutez autant de cases que nécessaire
            default:
                console.error('property_type ('+ property_type + ') is unknown in ' + property);
                break;
        }
        // if (property_type === "record") {
        //     let fetched_record = fetchPropertyRecord(property_id);
        //     if (fetched_record) {
        //         let property_name = snake_case(property_id);
        //         record[property_name] = fetched_record;
        //     }
        // } else {

        // const fetched_property_record = load_mock(property_id);
        // if (fetched_property_record) {
        //     property_value = fetched_record[property_id];
        //     if (property_value) {
        //         property_name = snake_case(property_id);
        //         localized_value = property_value[LOCALE];
        //         if (localized_value) {
        //             record[property_name] = localized_value;
        //         } else {
        //             record[property_name] = property_value;
        //         }
        //     }
        // }
    });
    return record;
}
