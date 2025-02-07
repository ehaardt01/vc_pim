var LOCALE = "en-GB";
const RETURN_NULL_VALUES = true;

function beeceptor(path, content) {
    var DOMAIN = 'https://virbac-pim.free.beeceptor.com';
    const METHOD = 'post';
    const URL = DOMAIN + path;
    web_request(URL, METHOD, content); // fixed parameter assignment
}

function salsify(path, method = 'GET', payload = null, version = 'v1') {
    if(TEST) {
        console.error('Salsify call not allowed at TEST time');
    } else {
        return salsify_request(path, method, payload, version);
    }
}

function fetchRecord(id) {
    if(TEST) {
        return load_mock(snake_case(id));
    } else {
        const PATH = '/products/';
        return salsify(PATH + id);
    }
}

function fetchPageRecords(topId, page) {
    if(TEST) {
        return load_mock(snake_case("children"));
    } else {
        const PATH = `/records?filter=='salsify:ancestor_ids':'${encodeURIComponent(topId)}'&per_page=100&page=${page}`;
        return salsify(PATH);
    }
}

function fetchEnumerated(id) {
    if(TEST) {
        return load_mock(snake_case(id));
    } else {
        const PATH = 'https://app.salsify.com/api/orgs/s-e8cb4aec-71e2-433b-9355-edf0312746cc/properties/Country%20Markets/enumerated_values';
        const method = "get";
        const payload = {};
        const headers = {
          Authorization: "Bearer H_TijzVgjG2Mr-fikMWtT9vjDmZJOx-bbWsWc8mAmqQ",
          "Content-Type": "application/json"
        };
        const options = {
          return_status: true
        };
        response = web_request(PATH, method, payload, headers, options);
        // const PATH = '/properties/' + encodeURIComponent(id) + '/enumerated_values'
        // return salsify(PATH);
    }
}

function fetchChildRecords(id) {
    let allRecords = [];
    let page = 1;
    let totalRecords = 0;
    let response;

    do {
        response = fetchPageRecords(id, page);
        if (response && response.data) {
            allRecords = allRecords.concat(response.data);
            if (page === 1 && response.meta && response.meta.total_entries) {
                totalRecords = response.meta.total_entries;
            }
            page++;
        }
    } while (response && response.data && allRecords.length < totalRecords);

    return allRecords;
}

function buildNestedStructure(root, records) {
    // Constants for Property Names
    const ID = "salsify:id";
    const PARENT_ID = "salsify:parent_id";
    const NAME = "ID";//"Salsify Name";
    const TAXONOMY = "Taxonomy";
    // const COLOR = "Color Name";
    // const SIZE = "Size (US)";

    // Local Function Variables
    const rootId = root[ID];
    const recordMap = {};

    let rootRecord = {
        id: root[ID],
        name: root[NAME],
        taxonomy: root[TAXONOMY],
        children: []
    };
    rootRecord = root
    rootRecord.children = [];

    // Create a map of records by ID for quick lookup
    records.forEach(record => {
        const recordId = record[ID];
        const parentId = record[PARENT_ID];

        if (parentId === rootId) {
            // middle tier record (tier 2)
            recordMap[recordId] = {
                id: recordId,
                name: record[NAME],
                // color: record[COLOR],
                children: []
            };
        } else {
            // middle tier record (tier 3)
            recordMap[recordId] = {
                id: recordId,
                name: record[NAME],
                // size: record[SIZE]
            };
        }
    });

    // Attach records to their parents
    records.forEach(record => {
        const currentRecord = recordMap[record[ID]];
        const parentId = record[PARENT_ID];
        if (parentId === rootId) {
            // Attach directly to root if the parentId is the rootId
            rootRecord.children.push(currentRecord);
        } else {
            const parentRecord = recordMap[parentId];
            if (parentRecord) {
                parentRecord.children.push(currentRecord);
            } else {
                // If the parent is not found, create a placeholder for the parent
                recordMap[parentId] = {
                    id: parentId,
                    children: [currentRecord]
                };
            }
        }
    });

  return rootRecord;
}

const properties = [
    {name: "salsify:created_at", type: "date", export_name: "created_at"},
    {name: "salsify:updated_at", type: "date", export_name: "updated_at"},
    {name: "FAQ data table", type: "product", export_name: "faq", values: [{name: "FAQ reference - Question ", type: "string", export_name: "question"}, {name: "FAQ reference - Answer", type: "string", export_name: "answer"}]},
    {name: "Country Markets", type: "enumerated", export_name: "country_markets"},
    {name: "salsify:version", type: "number", export_name: "version"},
    {name: "salsify:profile_asset_id", type: "string", export_name: "profile_asset_id"},
    {name: "salsify:system_id", type: "string", export_name: "system_id"},
    {name: "ID", type: "string", export_name: "id"},
    {name: "Group Species", type: "enumerated", export_name: "group_species"},
    {name: "Default Sales Price", type: "number", export_name: "default_sales_price"},
    {name: "LIB_MARQUE", type: "string", export_name: "lib_marque"},
    {name: "Taxonomy", type: "enumerated", export_name: "taxonomy"},
    {name: "Business category level 1", type: "enumerated", export_name: "business_category_level_1"},
    {name: "Business category level 2", type: "enumerated", export_name: "business_category_level_2"},
    {name: "Business category level 3", type: "enumerated", export_name: "business_category_level_3"},
    {name: "Business category level 4", type: "enumerated", export_name: "business_category_level_4"},
    {name: "Visible online ?", type: "boolean", export_name: "visible_online"},
    {name: "Name", type: "string", export_name: "name"},
    {name: "B2C Short description", type: "string", export_name: "b2c_short_description"},
    {name: "B2C Full Description", type: "rich_text", export_name: "b2c_full_description"},
    {name: "B2B Short description", type: "string", export_name: "b2b_short_description"},
    {name: "SEO Product Title", type: "string", export_name: "seo_product_title"},
    {name: "Marketing Product name", type: "string", export_name: "marketing_product_name"},
    {name: "Key figures", type: "string", export_name: "key_figures"},
    {name: "Computed property", type: "string", computing_function: my_specific_computing_function},
    {name: "Parent", type: "parent", export_name: "parent"},
    {name: "Children", type: "children", export_name: "children"},
];

const salsify_property_types = {
    "string": property_load_default,
    "rich_text": property_load_default,
    "quantified_product": property_load_quantified_product,
    "product": property_load_product,
    "number": property_load_default,
    "html": property_load_default,
    "enumerated": property_load_enumerated,
    "digital_asset": property_load_digital_asset,
    "date": property_load_default,
    "boolean": property_load_default,
    "computed": property_load_computed,
    "parent": property_load_parent,
    "children": property_load_children,
};

/**
 * Main function that processes product data and sends it to beeceptor endpoint.
 * If TEST mode is not enabled, it:
 * 1. Sets the locale from flow
 * 2. Loads product data using the root entity's external ID
 * 3. Sends the result to a beeceptor endpoint
 *
 * Note: Contains commented out legacy code for tree structure building
 *
 * @global
 * @function main
 * @requires TEST - Global boolean flag for test mode
 * @requires LOCALE - Global variable for locale setting
 * @requires flow.locale - Locale information from flow context
 * @requires context.entity.external_id - External ID from context
 * @requires load - Function to load product data
 * @requires beeceptor - Function to send data to beeceptor endpoint
 * @requires properties - Global properties configuration
 * @returns {void}
 */
function main() {
    if (typeof TEST === 'undefined') {
        TEST = false;
    }
    if(!TEST) {
        LOCALE = flow.locale;
        const rootId = context.entity.external_id;
        let result = load(rootId, properties);
        beeceptor('/product/create_or_update?locale=fr-FR', result);
        // const startTime = new Date();
        // const rootId = context.entity.external_id;
        // const rootProduct = fetchProduct(rootId, null);
        // const childRecords = fetchChildRecords(rootId);
        // let tree = buildNestedStructure(rootProduct, childRecords);
        // tree.locale = LOCALE;
        // const endTime = new Date();
        // const duration = endTime - startTime;

        // const minutes = Math.floor(duration / 60000);
        // const seconds = ((duration % 60000) / 1000).toFixed(0);

        // beeceptor('/product/create_or_update?locale=fr-FR', tree);
    }
}

/**
 * Converts a string to snake_case by removing special characters and converting camelCase/PascalCase to snake_case.
 * @param {string} variable_name - The string to be converted to snake_case.
 * @returns {string} The converted string in snake_case format.
 * @example
 * snake_case("HelloWorld") // returns "hello_world"
 * snake_case("My-Variable123") // returns "my_variable123"
 */
function snake_case(variable_name) {
    let filteredName = variable_name.replace(/[^a-zA-Z0-9]/g, '_');
    let snakeCase = '';
    let i = 0;
    while (i < filteredName.length) {
        let char = filteredName[i];
        if (char >= 'A' && char <= 'Z' && i + 1 < filteredName.length && filteredName[i + 1] >= 'A' && filteredName[i + 1] <= 'Z') {
            while (i < filteredName.length && filteredName[i] >= 'A' && filteredName[i] <= 'Z') {
                snakeCase += filteredName[i].toLowerCase();
                i++;
            }
            if (i < filteredName.length && filteredName[i] !== '_') {
                snakeCase += '_';
            }
        } else {
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
    // const PATH = 'https://raw.githubusercontent.com/ehaardt01/vc_pim/main/mocks/children_property_mock.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', PATH, false);
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error('Error loading JSON file : ' + PATH, xhr.statusText);
        return undefined;
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
    return undefined;
}

/**
 * Loads a default property value into a record object
 * @param {Object} record - The target record object to modify
 * @param {Object} configured_property - The property configuration object
 * @param {*} property_value - The value to load into the record
 * @returns {Object} The modified record object
 */
function property_load_default(record, configured_property, property_value) {
    value = get_localized_value(property_value);
    if ((value !== undefined)) {
        if  ((value !== null) || RETURN_NULL_VALUES) {
            record[get_property_export_name(configured_property)] = value;
        }
    }
    return record;
}

function property_load_digital_asset(record, configured_property, property_value) {
    return record;
}

function property_load_quantified_product(record, configured_property, property_value) {
    return record;
}

function my_specific_computing_function(record, configured_property, property_value) {
    return record;
}

/**
 * Loads and processes a property value for a product record based on configuration.
 * @param {Object} record - The target record object to be populated.
 * @param {Object} configured_property - Configuration object defining how to process the property.
 * @param {Object} configured_property.values - Values configuration for property processing.
 * @param {*} property_value - The value to be processed (can be string or array).
 * @returns {Object} The updated record object with the processed property value.
 * @throws {Error} Logs error if property_values is missing in configuration or if type is unexpected.
 */
function property_load_product(record, configured_property, property_value) {
    returned_values = configured_property["values"];
    property_export_name = get_property_export_name(configured_property)
    if (returned_values === undefined) {
        console.error('property_values is missing in ' + configured_property);
        return;
    }
    returned_type = retrieve_type(property_value);
    switch (returned_type) {
        case "string":
            sub_value = load(item, returned_values);
            if ((sub_value !== undefined)) {
                if  ((sub_value !== null) || RETURN_NULL_VALUES) {
                    record[property_export_name] = sub_value;
                }
            }
            break;
        case "string_array":
            records = []
            property_value.forEach(item => {
                sub_value = load(item, returned_values);
                if (sub_value) {
                    records.push(sub_value);
                }
            });
            if ((records.length !== 0) || RETURN_NULL_VALUES) {
                record[property_export_name] = records;
            }
            break;
        default:
            console.error('Unexpected type for ' + property_id + ' in ' + rootRecord);
            break;
    }
    return record;
}

/**
 * Loads and processes enumerated property values for a record.
 * Return is always an array of objects with key and localized value.
 * @param {Object} record - The record object to be modified
 * @param {Object} configured_property - Configuration object for the property
 * @param {string} configured_property.name - Name of the configured property
 * @param {string|string[]} property_value - Value(s) to be processed, can be string or array of strings
 * @returns {Object|undefined} Modified record with added enumerated property, or undefined if validation fails
 *
 * @throws {Error} Logs error if property_name is missing in configured_property
 * @throws {Error} Logs error if property_descriptor cannot be loaded
 * @throws {Error} Logs error if property_value type is neither string nor string array
 *
 * @description
 * This function processes enumerated property values by:
 * 1. Loading property descriptor from mock data
 * 2. Converting input value(s) to array format
 * 3. Mapping enumerated values to their localized names
 * 4. Adding processed values to the record using configured export name
 */
function property_load_enumerated(record, configured_property, property_value) {
    if (configured_property.name === undefined) {
        console.error('property_name is missing in ' + configured_property);
        return;
    }
    property_descriptor = fetchEnumerated(configured_property.name)
    if (property_descriptor === undefined) {
        console.error('property_descriptor is missing in ' + configured_property.name);
        return;
    }
    property_export_name = get_property_export_name(configured_property)
    returned_type = retrieve_type(property_value);
    let enumerated_values = [];
    switch (returned_type) {
        case "string":
            enumerated_values.push(property_value);
            break;
        case "string_array":
            enumerated_values = property_value;
            break;
        default:
            console.error('Unexpected type for ' + property_id + ' in ' + record);
            break;
    }
    mapped_values = {};
    property_descriptor.data.forEach(enumerated_value => {
        localized_name = get_localized_value(enumerated_value.localized_names);
        if (localized_name === undefined) {
            localized_name = enumerated_value.name;
        }
        mapped_values[enumerated_value.id] = {localized_name: localized_name};
    });
    enumerated_values.forEach(enumerated_value => {
        localized_name = mapped_values[enumerated_value].localized_name;
        record[property_export_name] = {key: enumerated_value, value: localized_name};
    });
    return record;
}

function property_load_computed(record, configured_property, property_value) {
    return record;
}

function property_load_parent(record, configured_property, property_value) {
    return record;
}

/**
 * Loads and organizes child records into a hierarchical structure based on parent-child relationships.
 *
 * @param {Object} record - The root record object that will contain the child hierarchy
 * @param {Object} configured_property - Configuration object containing property settings
 * @param {*} property_value - The value of the property being processed (unused in current implementation)
 *
 * @returns {Object} The root record with organized child hierarchy attached
 *
 * @description
 * This function:
 * 1. Fetches child records related to the root record
 * 2. Creates a two-tier hierarchy of records (tier 2 and tier 3)
 * 3. Maps records by their IDs for efficient lookup
 * 4. Attaches child records to their respective parents
 * 5. Handles cases where parent records might not be immediately available
 *
 * @requires
 * - fetchChildRecords function to be defined
 * - get_property_export_name function to be defined
 * - RETURN_NULL_VALUES constant to be defined
 */
function property_load_children(record, configured_property, property_value) {
    const ID = "salsify:id";
    const PARENT_ID = "salsify:parent_id";
    const rootId = record["id"];
    const recordMap = {};
    const rootRecord = record;
    children = [];
    const childRecords = fetchChildRecords(rootId);
    childRecords.forEach(childRecord => { // Create a map of records by ID for quick lookup
        const recordId = childRecord[ID];
        const parentId = childRecord[PARENT_ID];
        if (parentId === rootId) { // middle tier childRecord (tier 2)
            recordMap[recordId] = {
                id: recordId,
            };
        } else { // middle tier record (tier 3)
            recordMap[recordId] = {
                id: recordId,
            };
        }
    });
    childRecords.forEach(childRecord => { // Attach records to their parents
        const currentRecord = recordMap[childRecord[ID]];
        const parentId = childRecord[PARENT_ID];
        if (parentId === rootId) { // Attach directly to root if the parentId is the rootId
            children.push(currentRecord);
        } else {
            const parentRecord = recordMap[parentId];
            if (parentRecord) {
                property_name = get_property_export_name(configured_property);
                if (parentRecord[property_name] === undefined) {
                    parentRecord[property_name] = [];
                }
                parentRecord[property_name].push(currentRecord);
            } else { // If the parent is not found, create a placeholder for the parent
                recordMap[parentId] = {
                    id: parentId,
                    children: [currentRecord]
                };
            }
        }
    });
    if ((children.length !== 0) || RETURN_NULL_VALUES) {
        rootRecord[get_property_export_name(configured_property)] = children;
    }
    return rootRecord;
}

/**
 * Retrieves the export name for a configured property.
 * If no export name is provided, the snaked property name is used.
 * @param {Object} configured_property - The property configuration object
 * @param {string} configured_property.name - The name/ID of the property
 * @param {string} [configured_property.export_name] - Optional custom export name
 * @returns {string|null} The export name to use, or null if the property name is missing
 */
function get_property_export_name(configured_property) {
    property_id = configured_property["name"];
    if (property_id === undefined) {
        console.error('property_name is missing in ' + configured_property);
        return undefined;
    }
    let property_export_name = configured_property["export_name"];
    if (property_export_name === undefined) {
        property_export_name = snake_case(property_id);
    }
    return property_export_name;
}

/**
 * Retrieves a record by its ID and extracts specified properties
 * @param {string} record_id - The unique identifier of the record to load
 * @param {string[]} configured_properties - Array of property IDs to extract from the record
 * @returns {Object} An object containing the requested properties in snake_case format
 * @description Fetches a record from Salsify API and creates a new object with only
 * the specified properties. Property names are converted to snake_case.
 * Only properties that exist in the fetched record are included in the result.
 */
function load(rootId, configured_properties) {
    var rootRecord;
    rootRecord = fetchRecord(rootId);
    let record = {"id": rootId};
    configured_properties.forEach(configured_property => {
        const property_type = configured_property["type"];
        const property_id = configured_property["name"];
        if (property_type === undefined) {
            console.error('property_type is missing in ' + configured_property);
            return;
        }
        if (property_id === undefined) {
            console.error('property_name is missing in ' + configured_property);
            return;
        }
        let property_export_name = configured_property["export_name"];
        if (property_export_name !== undefined) {
            property_export_name = snake_case(property_id);
        }
        associated_function = salsify_property_types[property_type]
        if (associated_function !== undefined) {
            associated_function(record, configured_property, rootRecord[property_id])
        } else {
            console.error('property_type is wrong in ' + configured_property.name);
            return;
        }
        return;
    });
    return record;
}

main();