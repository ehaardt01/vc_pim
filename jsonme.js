const RETURN_NULL_VALUES = true;
const LOG_TYPE = {ERROR: "error", LOG: "log"};

/**
 * Array of property configurations for a product data model
 * @type {Array<{
*   name: string,                    // Display name of the property
*   type: string,                    // Data type ('string'|'date'|'number'|'boolean'|'enumerated'|'product'|'rich_text'|'children'|'locale'|'status'|'computed'|'quantified_product'|'digital_asset')
*   export_name?: string,            // Name used when exporting the property
*   values?: Array<{                 // Sub-properties for 'product' type
*     name: string,                  // Display name of the sub-property
*     type: string,                  // Data type of the sub-property
*     export_name: string            // Export name of the sub-property
*   }>,
*   computing_function?: Function    // Optional function for computed properties
* }>}
*/
const properties = [
   {name: "ID", type: "string", export_name: "id"},
   {name: "salsify:parent_id", type: "string", export_name: "parent_id"},
   {name: "salsify:created_at", type: "date", export_name: "created_at"},
   {name: "salsify:updated_at", type: "date", export_name: "updated_at"},
   {name: "FAQ data table", type: "product", export_name: "faq", values: [{name: "FAQ reference - Question ", type: "string", export_name: "question"}, {name: "FAQ reference - Answer", type: "string", export_name: "answer"}]},
   {name: "Country Markets", type: "enumerated", export_name: "country_markets"},
   {name: "salsify:version", type: "number", export_name: "version"},
   {name: "salsify:profile_asset_id", type: "string", export_name: "profile_asset_id"},
   {name: "salsify:system_id", type: "string", export_name: "system_id"},
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
   {name: "Computed property", type: "computed", export_name: "computed_property", computing_function: my_specific_computing_function},
   {name: "Children", type: "children", export_name: "children"},
   {name: "locale", type: "locale", export_name: "locale"},
   {name: "status", type: "status", export_name: "status"},
   {name: "Related products", type: "product", export_name: "related_products"},
   {name: "Composition-table (with qty)", type: "quantified_product", export_name: "composition", values: [{name: "salsify:id", type: "string", export_name: "id"}, {name: "Name", type: "string", export_name: "name"}]},
   {name: "Composition-table (with qty) 2", type: "quantified_product", export_name: "composition2", values: [{name: "salsify:id", type: "string", export_name: "id"}, {name: "Name", type: "string", export_name: "name"}]},
   {name: "Composition-table (with qty) 3", type: "quantified_product", export_name: "composition3", values: [{name: "salsify:id", type: "string", export_name: "id"}, {name: "Name", type: "string", export_name: "name"}]},
   {name: "A+ content", type: "digital_asset", export_name: "a_plus_content", values: [
    {name: "salsify:id", type: "string", export_name: "salsify_id"},
    {name: "salsify:source_url", type: "string", export_name: "cdn_url"},
    {name: "salsify:name", type: "string", export_name: "name"},
    {name: "salsify:status", type: "string", export_name: "salsify_status"},
    {name: "salsify:asset_resource_type", type: "string", export_name: "resource_type"},
    {name: "salsify:format", type: "string", export_name: "format"}]},
   {name: "Packaging", type: "digital_asset", export_name: "packaging", values: [
    {name: "salsify:id", type: "string", export_name: "salsify_id"},
    {name: "salsify:source_url", type: "string", export_name: "cdn_url"},
    {name: "salsify:name", type: "string", export_name: "name"},
    {name: "salsify:status", type: "string", export_name: "salsify_status"},
    {name: "salsify:asset_resource_type", type: "string", export_name: "resource_type"},
    {name: "salsify:format", type: "string", export_name: "format"}]},
];

/**
* Mapping of Salsify property types to their corresponding loader functions.
* @constant
* @type {Object.<string, Function>}
* @property {Function} string - Default loader for string properties
* @property {Function} rich_text - Default loader for rich text properties
* @property {Function} quantified_product - Loader for quantified product properties
* @property {Function} product - Loader for product properties
* @property {Function} number - Default loader for numeric properties
* @property {Function} html - Default loader for HTML properties
* @property {Function} enumerated - Loader for enumerated properties
* @property {Function} digital_asset - Loader for digital asset properties
* @property {Function} date - Default loader for date properties
* @property {Function} boolean - Default loader for boolean properties
* @property {Function} computed - Loader for computed properties
* @property {Function} children - Loader for children properties
* @property {Function} locale - Loader for locale properties
* @property {Function} status - Loader for status properties
*/
const salsify_property_types = {
   "string": property_load_default,
   "rich_text": property_load_default,
   "quantified_product": property_load_quantified_product,
   "product": property_load_product,
   "number": property_load_number,
   "html": property_load_default,
   "enumerated": property_load_enumerated,
   "digital_asset": property_load_digital_asset,
   "date": property_load_default,
   "boolean": property_load_boolean,
   "computed": property_load_computed,
   "children": property_load_children,
   "locale": property_load_locale,
   "status": property_load_status,
};

/**
 * Logs messages or errors with different logging types and optional error raising.
 * Enables more clear error message at Salsify task level
 * @param {string|Error} message_or_error - The message or error to be logged
 * @param {LOG_TYPE} [log_type=LOG_TYPE.ERROR] - The type of log (ERROR or LOG)
 * @param {boolean} [raise_error=true] - Whether to throw an error after logging
 * @throws {Error} If raise_error is true and log_type is LOG_TYPE.ERROR
 */
function log(message_or_error, log_type=LOG_TYPE.ERROR, raise_error=true) {
    switch (log_type) {
        case LOG_TYPE.ERROR:
            function getStackTrace() {
                try {
                    throw new Error('An error occurred');
                } catch (error) {
                    return error.stack;
                }
            }
            const stack_trace = getStackTrace();
            const log_message = message_or_error + "\n" + stack_trace;
            console.error(log_message);
            if (raise_error) {
                throw new Error(log_message);
            }
            break;
        case LOG_TYPE.LOG:
            console.log(message_or_error);
            return;
        default:
            break;
    }
    console.error(message_or_error);
}

/**
 * Checks if a value is undefined and logs a message accordingly
 * @param {*} value - The value to check for undefined
 * @param {string} message - The message to log if value is undefined
 * @param {boolean} [raise_error=false] - If true, logs as error and throws exception, otherwise logs as regular log
 * @returns {void}
 */
function check_undefined(value, message, raise_error=false) {
    if (value === undefined) {
        log(message, (raise_error ? LOG_TYPE.ERROR : LOG_TYPE.LOG), raise_error);
        return false;
    }
    return true;
}

/**
 * Validates the configuration of a list of properties by checking their attributes and types.
 * @param {Object[]} [properties_list=properties] - Array of property objects to validate
 * @param {string} [properties_list[].name] - Name of the property
 * @param {string} [properties_list[].type] - Type of the property (must be a valid Salsify property type)
 * @param {string} [properties_list[].export_name] - Export name of the property
 * @param {Object[]} [properties_list[].value] - Value configuration for nested properties (required for quantified_product, product, digital_asset, and children types)
 * @throws {Error} Logs error messages if validation fails:
 * - When property name is undefined
 * - When property type is unknown
 * - When export_name is undefined
 * - When value is undefined for types requiring it
 * - When value is defined for types not requiring it
 */
function check_configuration(properties_list=properties) {
    properties_list.forEach(property => {
        if (property.name  === undefined) {
            log('Property name is undefined', LOG_TYPE.ERROR);
        }
        if (!(property.type in salsify_property_types)) {
            log('Unknown property type for property ' + property.name, LOG_TYPE.ERROR);
        }
        if (property.name  === undefined) {
            log('Undefined property export_name for property ' + property.name, LOG_TYPE.ERROR);
        }
        switch (property.type) {
            case "quantified_product":
            case "product":
            case "digital_asset":
            case "children":
                if (property.value  === undefined) {
                    log('Undefined property value for property ' + property.name, LOG_TYPE.ERROR);
                }
                check_configuration(property.value);
                break;
            default:
                if (property.value  !== undefined) {
                    log('Property value for property ' + property.name + ' of type ' + property.type, LOG_TYPE.ERROR);
                }
                break;
        }
    }
)};

/**
 * Sends a POST request to the Beeceptor API endpoint
 * @param {string} path - The API endpoint path to be appended to the base domain
 * @param {*} content - The content/payload to be sent in the POST request
 * @returns {void}
 * @see {@link https://beeceptor.com/|Beeceptor Documentation}
 */
function mock_send_to_recipient_API(path, content) {
    var DOMAIN = 'https://virbac-pim.free.beeceptor.com';
    const METHOD = 'post';
    const URL = DOMAIN + path;
    web_request(URL, METHOD, content); // fixed parameter assignment
}

/**
 * Sends a POST request to the the recipient API endpoint
 * @param {string} path - The API endpoint path to be appended to the base domain
 * @param {*} content - The content/payload to be sent in the POST request
 * @returns {void}
 */
function send_to_recipient_API(path, content) {
    var DOMAIN = 'https://virbac-pim.free.beeceptor.com';
    const METHOD = 'post';
    const URL = DOMAIN + path;
    web_request(URL, METHOD, content); // fixed parameter assignment
}

/**
 * Makes a request to the Salsify API
 * @param {string} path - The API endpoint path
 * @param {string} [method='GET'] - The HTTP method to use for the request
 * @param {object|null} [payload=null] - The request payload data
 * @param {string} [version='v1'] - The API version to use
 * @returns {Promise|undefined} Returns Promise from salsify_request or undefined if MOCK is true
 * @throws {Error} Raise error if MOCK is true
 */
function mock_salsify(path, method = 'GET', payload = null, version = 'v1') {
    log('Salsify call not allowed at MOCK time', LOG_TYPE.ERROR);
}

/**
 * Makes a request to the Salsify API
 * @param {string} path - The API endpoint path
 * @param {string} [method='GET'] - The HTTP method to use for the request
 * @param {object|null} [payload=null] - The request payload data
 * @param {string} [version='v1'] - The API version to use
 * @returns {Promise|undefined} Returns Promise from salsify_request or undefined if MOCK is true
 */
function salsify(path, method = 'GET', payload = null, version = 'v1') {
    return salsify_request(path, method, payload, version);
}

/**
 * Fetches a record either from mock data or Salsify API based on MOCK environment flag
 * @param {string} id - The identifier of the record to fetch
 * @returns {Promise<Object>} A promise that resolves with the fetched record data
 * @throws {Error} If the record cannot be fetched
 */
function mock_fetchRecord(id) {
    return mock_load(snake_case(id));
}

/**
 * Fetches a record either from mock data or Salsify API based on MOCK environment flag
 * @param {string} id - The identifier of the record to fetch
 * @returns {Promise<Object>} A promise that resolves with the fetched record data
 * @throws {Error} If the record cannot be fetched
 */
function fetchRecord(id) {
    const PATH = '/products/';
    return salsify(PATH + id);
}

/**
 * Fetches records for a given page and top ID from either a mock source (in test mode) or Salsify API
 * @param {string} topId - The ancestor ID to filter records
 * @param {number} page - The page number to fetch
 * @returns {Promise<Object>} Promise that resolves to the fetched records
 * @throws {Error} Possible API errors when fetching from Salsify
 */
function mock_fetchPageRecords(topId, page) {
    return mock_load(snake_case("children"));
}

/**
 * Fetches records for a given page and top ID from either a mock source (in test mode) or Salsify API
 * @param {string} topId - The ancestor ID to filter records
 * @param {number} page - The page number to fetch
 * @returns {Promise<Object>} Promise that resolves to the fetched records
 * @throws {Error} Possible API errors when fetching from Salsify
 */
function fetchPageRecords(topId, page) {
    const PATH = `/records?filter=='salsify:ancestor_ids':'${encodeURIComponent(topId)}'&per_page=100&page=${page}`;
    return salsify(PATH);
}

/**
 * Fetches enumerated values for a given property ID
 * @param {string} id - The property ID to fetch enumerated values for
 * @returns {Object} An object containing the enumerated values data
 * @returns {Array} .data - Array of enumerated values
 * @throws {Error} When the API request fails (in non-MOCK mode)
 */
function mock_fetchEnumerated(id) {
    return mock_load(snake_case(id));
}

/**
 * Fetches and builds a hierarchical tree structure of enumerated values for a given property ID.
 * This function recursively retrieves all enumerated values, including their children, from the Salsify API.
 *
 * @param {string} id - The property ID for which to fetch enumerated values
 * @returns {Array<Object>} An array of objects representing the hierarchical structure where each object contains:
 *   - id {string} The unique identifier of the enumerated value
 *   - name {string} The name of the enumerated value
 *   - has_children {boolean} Indicates whether this value has child values
 *   - localized_names {Object} Object containing localized versions of the name
 *   - values {Array<Object>} Array of child enumerated values (if has_children is true)
 *
 * @example
 * const propertyTree = fetchEnumerated('property123');
 * // Returns:
 * // [{
 * //   id: 'value1',
 * //   name: 'Value 1',
 * //   has_children: true,
 * //   localized_names: { en: 'Value 1', fr: 'Valeur 1' },
 * //   values: [...]
 * // }, ...]
 */
function fetchEnumerated(id) {
    function mysearchEnumeratedPage(id, parent, page, perPage) {
        let BASE_PATH = `/properties/${encodeURIComponent(id)}/enumerated_values?page=${page}&per_page=${perPage}`;
        if (parent !== undefined && parent !== '') {
            BASE_PATH += `&within_value=${encodeURIComponent(parent)}`;
        }
        let result = salsify(BASE_PATH, 'GET', null, null);
        return result && result.data ? result.data : [];
    };
    function mysearchEnumerated(id, parent='') {
        let allRecords = [];
        let page = 1;
        const perPage = 120;
        let totalEntries = 0;
        let hasMoreData = true;
        while (hasMoreData) {
            let records = mysearchEnumeratedPage(id, parent, page, perPage);
            if (records.length > 0) {
                allRecords = allRecords.concat(records);
            }
            if (page === 1 && records.meta && records.meta.total_entries) {
                totalEntries = records.meta.total_entries;
            }
            hasMoreData = allRecords.length < totalEntries;
            page++;
        }
        return allRecords;
    }
    function mysearchProperty(id, parent='') {
        let records = mysearchEnumerated(id, parent);
        let tree = [];
        for (let item of records) {
            let node = {
                id: item.id,
                name: item.name,
                has_children: item.has_children,
                localized_names: item.localized_names,
                values: []
            };
            if (item.has_children) {
                node.values = mysearchProperty(id, item.id);
            }
            tree.push(node);
        }
        return tree;
    }
    return mysearchProperty(id);
}

/**
 * Fetches all child records for a given ID by paginating through the results
 * @param {number|string} id - The identifier for which to fetch child records
 * @returns {Array} An array containing all child records
 * @description This function handles pagination internally by making multiple calls to fetchPageRecords
 * until all records are retrieved. It uses the meta.total_entries from the first response to determine
 * the total number of records to fetch.
 * @throws {Error} May throw an error if the fetchPageRecords fails
 */
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

/**
 * Converts a string to snake_case by removing special characters and converting camelCase/PascalCase to snake_case.
 * @param {string} variable_name - The string to be converted to snake_case.
 * @returns {string} The converted string in snake_case format.
 * @example
 * snake_case("HelloWorld") // returns "hello_world"
 * snake_case("My-Variable123") // returns "my_variable123"
 */
function snake_case(variable_name) {
    return variable_name
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\W_]+/g, '_')
        .replace(/^_|_$/g, '')
        .toLowerCase();
}

/**
 * Loads mock data from a JSON file hosted on GitHub
 * @param {string} id - The identifier used to construct the file path. Will be converted to snake case.
 * @returns {Object|null} The parsed JSON data if successful, null if there was an error
 * @throws {Error} May throw a parsing error if the JSON is invalid
 * @example
 * const mockData = load_mock('testId'); // Loads from testId_property_mock.json
 */
function mock_load(id) {
    const PATH = 'https://raw.githubusercontent.com/ehaardt01/vc_pim/main/mocks/' + snake_case(id) + '_property_mock.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', PATH, false);
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        log('Error loading JSON file : ' + PATH + xhr.statusText, LOG_TYPE.LOG, false);
        return;
    }
}

/**
 * Determines the type of the input value with specific handling for string arrays
 * @param {*} value - The value to check
 * @returns {string} Returns one of:
 *   - 'undefined' if the value is undefined
 *   - 'string' if the value is a string
 *   - 'string_array' if the value is an array containing only strings
 *   - 'other_array' if the value is an array containing something else than strings
 *   - 'object' for any other type (of object type)
 *   - 'other' for any other type (of non object type)
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
            return 'other_array';
        }
    } else if (typeof value === 'object') {
        return 'object';
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
    if ((typeof value === 'number') || (typeof value === 'boolean') || (typeof value === 'string')) {
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
function get_localized_property_values(entity, property_id) {
    return localized_property_values(entity, property_id, LOCALE);
}

/**
 * Loads a default property value into a record object
 * Default property types are string, html, date, and rich_text
 * @param {Object} record - The target record object to modify
 * @param {Object} configured_property - The property configuration object
 * @param {*} property_value - The value to load into the record
 * @param {*} rootRecord - The root record. Rarely used except in case of computed properties
 * @returns {Object} The modified record object
 */
function property_load_default(record, configured_property, property_value, rootRecord) {
    if (property_value === undefined) return;
    value = get_localized_value(property_value);
    if ((value !== undefined)) {
        if  ((value !== null) || RETURN_NULL_VALUES) {
            record[get_property_export_name(configured_property)] = value;
        }
    }
    return record;
}

/**
 * Loads a numeric property value into a record object.
 * @param {Object} record - The target record object to load the property into.
 * @param {Object} configured_property - Configuration object for the property.
 * @param {*} property_value - The value to be loaded (may be localized).
 * @param {Object} rootRecord - The root record object.
 * @returns {Object} The updated record object.
 * @description Processes a property value by:
 * 1. Getting its localized value
 * 2. Converting to number if possible
 * 3. Adding to record if value is not null (or if RETURN_NULL_VALUES is true)
 */
function property_load_number(record, configured_property, property_value, rootRecord) {
    if (property_value === undefined) return;
    value = get_localized_value(property_value);
    if ((value !== undefined)) {
        if (value !== null) {
            const numberValue = Number(value);
            value = isNaN(numberValue) ? value : numberValue;
        }
        if  ((value !== null) || RETURN_NULL_VALUES) {
            record[get_property_export_name(configured_property)] = value;
        }
    }
    return record;
}

/**
 * Loads a boolean property value into a record
 * @param {Object} record - The target record object to load the property into
 * @param {Object} configured_property - The configuration object for the property
 * @param {*} property_value - The raw property value to load
 * @param {Object} rootRecord - The root record object
 * @returns {Object} The updated record object
 *
 * @description
 * Takes a property value, processes it as a boolean ('true'/'false' string values are converted to boolean),
 * and assigns it to the record using the configured export property name.
 * The value is only assigned if it's defined and either not null or RETURN_NULL_VALUES is true.
 */
function property_load_boolean(record, configured_property, property_value, rootRecord) {
    if (property_value === undefined) return;
    value = get_localized_value(property_value);
    if ((value !== undefined)) {
        if (value !== null) {
            if (value === 'true') value = true;
            if (value === 'false') value = false;
        }
        if  ((value !== null) || RETURN_NULL_VALUES) {
            record[get_property_export_name(configured_property)] = value;
        }
    }
    return record;
}

/**
 * Loads and extracts specific values from an asset based on its ID
 * @param {string} asset_id - The ID of the asset to find
 * @param {string} configured_property - Property name used for error reporting if asset not found
 * @param {Array<{name: string, export_name: string}>} returned_values - Array of objects specifying which values to extract from asset
 * @param {Array<Object>} asset_list - List of assets to search through
 * @returns {Object} Object containing requested values from the asset
 * @throws {Error} If asset with given ID is not found in asset_list
 */
function load_asset(asset_id, configured_property, returned_values, asset_list) {
    const ASSET_ID = "salsify:id";
    let asset = null;
    asset = asset_list.find(asset => asset[ASSET_ID] === asset_id);
    check_undefined(asset, 'Asset ' + asset_id + ' not found in configured_property ' + configured_property.name, true);
    let asset_data = {};
    returned_values.forEach(value => {
        const asset_value = asset[value.name];
        if (asset_value !== undefined) {
            asset_data[value.export_name] = asset_value;
        }
    });
    return asset_data;
}

/**
 * Loads digital asset data from a root record and processes it according to configured properties
 * @param {Object} record - The target record where the processed asset data will be stored
 * @param {Object} configured_property - Configuration object containing export name and property values
 * @param {*} property_value - The value containing asset ID(s) to be processed
 * @param {Object} rootRecord - The root record containing the digital assets list
 * @returns {Object|undefined} The updated record with asset data, or undefined if processing fails
 *
 * @example
 * // Example configured_property structure:
 * {
 *   values: [{name: "url", export_name: "asset_url"}],
 *   export_name: "digital_asset"
 * }
 *
 * @throws {Error} Logs or throws errors for various failure conditions
 */
function property_load_digital_asset(record, configured_property, property_value, rootRecord) {
    if (property_value === undefined) return;
    const ASSET_LIST = "salsify:digital_assets";
    const property_export_name = get_property_export_name(configured_property)
    const value = get_localized_value(property_value);
    if (!check_undefined(value, 'Asset value is missing in ' + configured_property)) return;
    const returned_values = configured_property["values"];
    const returned_type = retrieve_type(value);
    const asset_list = rootRecord[ASSET_LIST];
    check_undefined(asset_list, 'Asset list is missing in configured_property ' + configured_property.name, true);
    switch (returned_type) {
        case "string":
            const asset_id = value;
            const sub_value = load_asset(asset_id, configured_property, returned_values, asset_list);
            if (sub_value !== undefined) {
                record[property_export_name] = sub_value;
            }
            break;
        case "string_array":
            const records = []
            value.forEach(item => {
                const asset_id = item;
                const sub_value = load_asset(asset_id, configured_property, returned_values, asset_list);
                if (sub_value !== undefined) {
                    records.push(sub_value);
                }
            });
            if ((records.length !== 0) || RETURN_NULL_VALUES) {
                record[property_export_name] = records;
            }
            break;
        default:
            log('Unexpected type for ' + property_id + ' in ' + record.id, LOG_TYPE.ERROR);
    }
    return record;
}

/**
 * Loads a product with its quantity and associated information
 * @param {string|number} product_id - The ID of the product to load
 * @param {number} product_qty - The quantity of the product
 * @param {string} configured_property - The property name/path being configured (used for error messages)
 * @param {Object} returned_values - Object containing previously returned/cached values
 * @returns {Object|null} An object containing product ID, quantity and product info, or null if product not found and RETURN_NULL_VALUES is false
 * @throws {Error} If product_id or product_qty is undefined, or if product cannot be loaded
 */
function load_product_with_qty(product_id, product_qty, configured_property, returned_values) {
    let product_with_qty = null;
    check_undefined(product_id, 'product_id is missing in configured_property ' + configured_property.name, true);
    check_undefined(product_qty, 'product_qty is missing in configured_property ' + configured_property.name, true);
    let sub_value = load(product_id, returned_values);
    check_undefined(sub_value, 'impossible to load sub-product ' + configured_property, true);
    if  ((sub_value !== null) || RETURN_NULL_VALUES) {
        product_with_qty = {
            id: product_id,
            quantity: product_qty,
            product_info: sub_value,
        }
    }
    return product_with_qty
}

/**
 * Loads and processes quantified product information into a record based on configured properties
 * @param {Object} record - The target record to be populated with product information
 * @param {Object} configured_property - Configuration object containing property settings and values
 * @param {*} property_value - The value of the property to be processed
 * @param {Object} rootRecord - The root record object (unused in current implementation)
 * @returns {Object|undefined} The modified record with quantified product information, or undefined if processing fails
 * @throws {Error} Logs error messages or throws exceptions for various failure conditions
 *
 * @description
 * Processes product information with quantities, supporting both single objects and arrays.
 * Uses constants PRODUCT_ID ("salsify:product_id") and PRODUCT_QTY ("salsify:quantity") for data extraction.
 * Can handle two types of input structures:
 * - Single object with product ID and quantity
 * - Array of objects, each containing product ID and quantity
 */
function property_load_quantified_product(record, configured_property, property_value, rootRecord) {
    if (property_value === undefined) return;
    const PRODUCT_ID = "salsify:product_id"
    const PRODUCT_QTY = "salsify:quantity"
    const returned_values = configured_property["values"];
    const property_export_name = get_property_export_name(configured_property)
    const returned_type = retrieve_type(property_value);
    switch (returned_type) {
        case "object":
            const product_id = property_value[PRODUCT_ID];
            const product_qty = property_value[PRODUCT_QTY];
            const sub_value = load_product_with_qty(product_id, product_qty, configured_property, returned_values)
            if (sub_value !== undefined) {
                record[property_export_name] = sub_value;
            }
            break;
        case "other_array":
            const records = []
            property_value.forEach(item => {
                const product_id = item[PRODUCT_ID];
                const product_qty = item[PRODUCT_QTY];
                let sub_value = load_product_with_qty(product_id, product_qty, configured_property, returned_values)
                if (sub_value !== undefined) {
                    records.push(sub_value);
                }
            });
            if ((records.length !== 0) || RETURN_NULL_VALUES) {
                record[property_export_name] = records;
            }
            break;
        default:
            log('Unexpected type for ' + property_id + ' in ' + record.id, LOG_TYPE.ERROR);
    }
    return record;
}

/**
 * Loads and processes a property value for a product record based on configuration.
 * @param {Object} record - The target record object to be populated.
 * @param {Object} configured_property - Configuration object defining how to process the property.
 * @param {Object} configured_property.values - Values configuration for property processing.
 * @param {*} property_value - The value to be processed (can be string or array).
 * @param {*} rootRecord - The root record. Rarely used except in case of computed properties
 * @returns {Object} The updated record object with the processed property value.
 * @throws {Error} Logs error if property_values is missing in configuration or if type is unexpected.
 */
function property_load_product(record, configured_property, property_value, rootRecord) {
    if (property_value === undefined) return;
    returned_values = configured_property["values"];
    property_export_name = get_property_export_name(configured_property)
    returned_type = retrieve_type(property_value);
    switch (returned_type) {
        case "string":
            sub_value = load(property_value, returned_values);
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
                if (sub_value !== undefined) {
                    records.push(sub_value);
                }
            });
            if ((records.length !== 0) || RETURN_NULL_VALUES) {
                record[property_export_name] = records;
            }
            break;
        default:
            log('Unexpected type for ' + property_id + ' in ' + record.id, LOG_TYPE.ERROR);
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
 * @param {*} rootRecord - The root record. Rarely used except in case of computed properties
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
function Old_property_load_enumerated(record, configured_property, property_value, rootRecord) {
    if (property_value === undefined) return;
    property_descriptor = fetchEnumerated(configured_property.name)
    if (!check_undefined(property_descriptor, 'property_descriptor is missing in ' + configured_property)) {
        if (MOCK !== undefined && MOCK) {
            record[get_property_export_name(configured_property)] = 'property_descriptor is missing in ' + configured_property.name;
            return;
        } else {
            log('property_descriptor is missing in ' + configured_property.name, LOG_TYPE.ERROR);
        }
    }
    if (!check_undefined(property_descriptor.data, 'property_descriptor.data is missing in ' + configured_property)) {
        if (MOCK !== undefined && MOCK) {
            record[get_property_export_name(configured_property)] = 'property_descriptor.data is missing in ' + configured_property.name;
            return;
        } else {
            log('property_descriptor.data is missing in ' + configured_property.name, LOG_TYPE.ERROR);
        }
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
            log('Unexpected type for ' + property_id + ' in ' + record.id, LOG_TYPE.ERROR);
    }
    mapped_values = {};
    property_descriptor.data.forEach(enumerated_value => {
        check_undefined(enumerated_value, 'enumerated_value is missing in configured_property ' + configured_property.name, true);
        check_undefined(enumerated_value.localized_names, 'enumerated_value.localized_names is missing in configured_property ' + configured_property.name, true);
        localized_name = get_localized_value(enumerated_value.localized_names);
        if (localized_name === undefined) {
            localized_name = enumerated_value.name;
        }
        mapped_values[enumerated_value.id] = {localized_name: localized_name};
    });
    records = []
    enumerated_values.forEach(enumerated_value => {
        check_undefined(enumerated_value, 'enumerated_value is missing in configured_property ' + configured_property.name, true);
        check_undefined(mapped_values[enumerated_value], 'mapped_values[' + enumerated_value + '] is missing in configured_property ' + configured_property.name, true);
        localized_name = mapped_values[enumerated_value].localized_name;
        records.push({key: enumerated_value, value: localized_name});
    });
    if ((records.length !== 0) || RETURN_NULL_VALUES) {
        record[property_export_name] = records;
    }
    return record;
}

function property_load_enumerated(record, configured_property, property_value, rootRecord) {
    property_export_name = get_property_export_name(configured_property)
    // returned_type = retrieve_type(property_value);
    // let records = [];
    // switch (returned_type) {
    //     case "string":
    //         record = {
    //             key: property_value,
    //             value: localized_property_values(property_value, configured_property.name, LOCALE),
    //         }
    //         records.push(record);
    //         break;
    //     case "string_array":
    //         returned_type.forEach(item => {
    //             record = {
    //                 key: item,
    //                 value: item,
    //             }
    //             records.push(record);
    //         });
    //         break;
    //     default:
    //         log('Unexpected type for ' + property_id + ' in ' + record.id, LOG_TYPE.ERROR);
    // }
    // if ((records.length !== 0) || RETURN_NULL_VALUES) {
    //     record[property_export_name] = records;
    // }
    record[property_export_name] = property_values(record, configured_property.name);
    return record;
}

/**
 * Loads and computes a property value for a record using a configured computing function
 * @param {Object} record - The record object to which the computed property will be added
 * @param {Object} configured_property - Configuration object containing computing function and property settings
 * @param {*} property_value - The initial value of the property
 * @param {Object} rootRecord - The root record object for context in computation
 * @returns {Object|undefined} The modified record object or undefined if computing function is missing
 */
function property_load_computed(record, configured_property, property_value, rootRecord) {
    if (property_value === undefined) return;
    computing_function = configured_property["computing_function"];
    check_undefined(computing_function, 'computing_function is missing in configured_property ' + configured_property.name, true);
    property_export_name = get_property_export_name(configured_property)
    record[property_export_name] = computing_function(record, configured_property, property_value, rootRecord);
    return record;
}

/**
 * Loads locale information into a record.
 * @param {Object} record - The record object to be modified.
 * @param {Object} configured_property - The configured property settings (not used in function).
 * @param {*} property_value - The property value (not used in function).
 * @param {*} rootRecord - The root record. Rarely used except in case of computed properties
 * @returns {Object} The modified record with locale information.
 * @param {*} rootRecord - The root record. Rarely used except in case of computed properties
 */
function property_load_locale(record, configured_property, property_value, rootRecord) {
    property_export_name = get_property_export_name(configured_property)
    record[property_export_name] = LOCALE;
    return record;
}

function property_load_status(record, configured_property, property_value, rootRecord) {
    property_export_name = get_property_export_name(configured_property)
    record[property_export_name] = "active";
    return record;
}

/**
 * Loads and organizes child records into a hierarchical structure based on parent-child relationships.
 *
 * @param {Object} record - The root record object that will contain the child hierarchy
 * @param {Object} configured_property - Configuration object containing property settings
 * @param {*} property_value - The value of the property being processed (unused in current implementation)
 * @param {*} rootRecord - The root record. Rarely used except in case of computed properties
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
function property_load_children(record, configured_property, property_value, rootRecord) {
    const ID = "salsify:id";
    const PARENT_ID = "salsify:parent_id";
    const rootId = record["id"];
    const recordMap = {};
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
        record[get_property_export_name(configured_property)] = children;
    }
    return record;
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
    check_undefined(property_id, 'property_name is missing in configured_property ' + configured_property.name, true);
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
        let property_export_name = configured_property["export_name"];
        if (property_export_name !== undefined) {
            property_export_name = snake_case(property_id);
        }
        associated_function = salsify_property_types[property_type]
        if (associated_function !== undefined) {
            associated_function(record, configured_property, rootRecord[property_id], rootRecord)
        } else {
            log('property_type is wrong in ' + configured_property.name, LOG_TYPE.ERROR);
        }
        return;
    });
    return record;
}

/**
 * Computes a specific value based on record properties (example function)
 * @param {Object} record - The current record being processed
 * @param {string} configured_property - The configured property name
 * @param {*} property_value - The value of the configured property
 * @param {Object} rootRecord - The root record containing ID and Name
 * @returns {string} A concatenated string with localized values of ID and Name
 */
function my_specific_computing_function(record, configured_property, property_value, rootRecord) {
    value1 = get_localized_value(rootRecord["ID"]);
    value2 = get_localized_value(rootRecord["Name"]);
    return "Specific computed property: " + value1 + " and also " + value2;
}

function main() {
    LOCALE = flow.locale;
    const rootId = context.entity.external_id;
    let result = fetchRecord(rootId);
    send_to_recipient_API('/product/create_or_update?locale=fr-FR', result);


    return;
    MOCK = (typeof MOCK === 'undefined' ? false : true);
    if(MOCK) {
        LOCALE = 'en-GB';
        send_to_recipient_API = mock_send_to_recipient_API;
        salsify = mock_salsify;
        fetchRecord = mock_fetchRecord;
        fetchPageRecords = mock_fetchPageRecords;
        fetchEnumerated = mock_fetchEnumerated;
    } else {
        LOCALE = flow.locale;
        const rootId = context.entity.external_id;
        let result = load(rootId, properties);
        send_to_recipient_API('/product/create_or_update?locale=fr-FR', result);
    }
}

main();