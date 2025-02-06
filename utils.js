/**
 * Converts a string to snake_case by removing special characters and converting camelCase/PascalCase to snake_case.
 * @param {string} variable_name - The string to be converted to snake_case.
 * @returns {string} The converted string in snake_case format.
 * @example
 * snake_case("HelloWorld") // returns "hello_world"
 * snake_case("My-Variable123") // returns "my_variable123"
 */
function snake_case(variable_name) {
    // Remplacer les caractères non alphanumériques par des underscores
    let filteredName = variable_name.replace(/[^a-zA-Z0-9]/g, '_');

    // Initialiser la variable pour stocker le résultat
    let snakeCase = '';
    let i = 0;

    while (i < filteredName.length) {
        let char = filteredName[i];

        // Si le caractère est une majuscule et qu'il est suivi par une autre majuscule, traitez-le comme un acronyme
        if (char >= 'A' && char <= 'Z' && i + 1 < filteredName.length && filteredName[i + 1] >= 'A' && filteredName[i + 1] <= 'Z') {
            // Ajoutez toutes les majuscules consécutives sans underscore entre elles
            while (i < filteredName.length && filteredName[i] >= 'A' && filteredName[i] <= 'Z') {
                snakeCase += filteredName[i].toLowerCase();
                i++;
            }
            // Ajoutez un underscore après l'acronyme si ce n'est pas la fin de la chaîne et que le caractère suivant n'est pas un underscore
            if (i < filteredName.length && filteredName[i] !== '_') {
                snakeCase += '_';
            }
        } else {
            // Si le caractère est une majuscule, ajoutez un underscore avant
            if (char >= 'A' && char <= 'Z') {
                if (i > 0 && snakeCase[snakeCase.length - 1] !== '_') {
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
    const PATH = 'https://raw.githubusercontent.com/ehaardt01/vc_pim/main/mocks/' + snake_case(id) + '_property_mock.json';
    // const PATH = 'https://raw.githubusercontent.com/ehaardt01/vc_pim/main/mocks/faq_w1_1_property_mock.json';
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

/**
 * Retrieves the localized value from a string or an object containing localized values. Locale is globally defined
 * in the global variable LOCALE.
 * @param {(string|Object)} value - The value to get the localization from. Can be a string or an object with locale keys.
 * @returns {?string} The localized string value if found, null otherwise.
 *
 * @example
 * // Returns "Hello" for a simple string
 * get_localized_value("Hello")
 *
 * @example
 * // Returns "Bonjour" if LOCALE is set to "fr-FR"
 * get_localized_value({"en-US": "Hello", "fr-FR": "Bonjour"})
 */
function get_localized_value(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'object' && value !== null) {
        if (value.hasOwnProperty(LOCALE)) {
            return value[LOCALE];
        }
    }
    return null;
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
                value = get_localized_value(rootRecord[property_name]);
                if (value) {
                    record[property_export_name] = value;
                }
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
                        sub_value = load(item, returned_values, false);
                        if (sub_value) {
                            record[property_export_name] = sub_value;
                        }
                        break;
                    case "string_array":
                        records = []
                        rootRecord[property_name].forEach(item => {
                            sub_value = load(item, returned_values, false);
                            if (sub_value) {
                                records.push(sub_value);
                            }
                        });
                        if (records.length !== 0) {
                            record[property_export_name] = records;
                        }
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
    });
    return record;
}
