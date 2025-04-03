const RETURN_NULL_VALUES = true;
const LOG_TYPE = {ERROR: "error", LOG: "log"};
const TARGET_DOMAIN = 'https://staging-unity.virbac.com/api/v1/products';
const TARGET_DOMAIN_2 = 'https://virbac-pim.free.beeceptor.com/product/create_or_update?locale=fr-FR';
// const TARGET_DOMAIN = 'https://virbac-pim.free.beeceptor.com/product/create_or_update?locale=fr-FR';
const MOCK_DOMAIN = 'https://raw.githubusercontent.com/ehaardt01/vc_pim/main/mocks/';
const NOT_TRANSLATED = "";
let RESULT = "";
let TASK_ID = "";
let PRODUCT_ID = "";
let LOCALE = "";

// https://staging-unity.virbac.com/api/v1/login
// https://staging-unity.virbac.com/api/v1/products
// https://unity:unity00!@staging-unity.virbac.com/api/v1/login
// https://unity:unity00!@staging-unity.virbac.com/api/v1/products
// {
//     "username": "pim_api",
//     "password": "YzVjMmFiNzVhZTFk1"
// }
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDM1MDYyMDQsImV4cCI6MTc3NTA0MjIwNCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoicGltX2FwaSJ9.yy3vfyyYkQ8qnNXg3FWQSJwCDESzQeYiwvMRm6M8Z2M

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
const SYSTEM_PROPERTIES = [
    {name: "ID", type: "string", export_name: "id"},
    {name: "salsify:system_id", type: "string", export_name: "system_id"},
    {name: "salsify:created_at", type: "date", export_name: "created_at"},
    {name: "salsify:updated_at", type: "date", export_name: "updated_at"},
    {name: "salsify:version", type: "number", export_name: "version"},
    {name: "salsify:parent_id", type: "string", export_name: "parent_id"},
    {name: "Children", type: "children", export_name: "children"},
    {name: "locale", type: "locale", export_name: "locale"},
];
const properties = SYSTEM_PROPERTIES.concat([
    {name: "ID", type: "string", export_name: "id"},
    {name: "Name", type: "string", export_name: "name"},
    {name: "CODE_REF_LOCALE", type: "string", export_name: "code_ref_locale"},
    {name: "Brand data table", type: "product", export_name: "brand_data_table", values: [{name: "Brand Name", type: "string", export_name: "brand_name"}]},
    {name: "Country Markets", type: "enumerated", export_name: "country_markets"},
    {name: "Group Species", type: "enumerated", export_name: "group_species"},
    {name: "Animal stage", type: "enumerated", export_name: "animal_stage"},
    {name: "Flavour", type: "enumerated", export_name: "flavour"},
    {name: "B2C Short description", type: "string", export_name: "b2c_short_description"},
    {name: "B2C Full Description", type: "string", export_name: "b2c_full_description"},
    {name: "Feeding guide / daily ration", type: "html", export_name: "feeding_guide_daily_ration"},
    {name: "SEO Product Title", type: "string", export_name: "seo_product_title"},
    {name: "SEO Meta description", type: "string", export_name: "seo_meta_description"},
    {name: "Tutorials", type: "html", export_name: "tutorials"},
    {name: "Marketing Product name", type: "string", export_name: "marketing_product_name"},
    {name: "Related product", type: "product", export_name: "related_product"},
    {name: "A+ content", type: "digital_asset", export_name: "a_content", values: [{name: "salsify:id", type: "string", export_name: "salsify_id"},{name: "salsify:source_url", type: "string", export_name: "cdn_url"},{name: "salsify:name", type: "string", export_name: "name"},{name: "salsify:status", type: "string", export_name: "salsify_status"},{name: "salsify:asset_resource_type", type: "string", export_name: "resource_type"},{name: "salsify:format", type: "string", export_name: "format"}]},
    {name: "Packaging", type: "digital_asset", export_name: "packaging", values: [{name: "salsify:id", type: "string", export_name: "salsify_id"},{name: "salsify:source_url", type: "string", export_name: "cdn_url"},{name: "salsify:name", type: "string", export_name: "name"},{name: "salsify:status", type: "string", export_name: "salsify_status"},{name: "salsify:asset_resource_type", type: "string", export_name: "resource_type"},{name: "salsify:format", type: "string", export_name: "format"}]},
    {name: "Key benefit summary text", type: "string", export_name: "key_benefit_summary_text"},
    {name: "Visible online ?", type: "string", export_name: "visible_online"},
    {name: "Key figures", type: "string", export_name: "key_figures"},
    {name: "FAQ data table", type: "product", export_name: "faq_data_table", values: [{name: "FAQ reference - Question", type: "string", export_name: "question"}, {name: "FAQ reference - Answer", type: "string", export_name: "answer"}]},
    {name: "Sellable online ?", type: "string", export_name: "sellable_online"},
    {name: "Sellable SKU format size", type: "enumerated", export_name: "sellable_sku_format_size"},
    {name: "Composition - Analytical constituents", type: "composition", export_name: "composition_analytical_constituents"},
    {name: "Composition - Functional ingredients", type: "composition", export_name: "composition_functional_ingredients"},
    {name: "Composition - Functional ingredients - Notes", type: "string", export_name: "composition_functional_ingredients_notes"},
    {name: "Composition - Analytical constituents - Notes", type: "string", export_name: "composition_analytical_constituents_notes"},
    {name: "Composition - Ingredients / Additives", type: "composition", export_name: "composition_ingredients_additives"},
    {name: "Composition - Ingredients / Additives - Notes", type: "string", export_name: "composition_ingredients_additives_notes"},
    {name: "Composition - Vitamins and trace elements", type: "composition", export_name: "composition_vitamins_and_trace_elements"},
    {name: "Composition - Vitamins and trace elements - Notes", type: "string", export_name: "composition_vitamins_and_trace_elements_notes"},
    {name: "Composition", type: "string", export_name: "composition"},
    {name: "Sellable SKU Measurement unit", type: "enumerated", export_name: "sellable_sku_measurement_unit"},
    {name: "Sellable SKU Unit Value", type: "number", export_name: "sellable_sku_unit_value"},
    {name: "Benefit data table", type: "product", export_name: "benefit_data_table", values: [{name: "Benefit data table - item label", type: "string", export_name: "label"}, {name: "Benefit data table - long description", type: "string", export_name: "description"}]},
    {name: "Key Selling Points", type: "rich_text", export_name: "key_selling_points"},
    {name: "Animal size", type: "enumerated", export_name: "animal_size"},
    {name: "Range category", type: "enumerated", export_name: "range_category"},
    {name: "Type of food", type: "enumerated", export_name: "type_of_food"},
    {name: "Neutered", type: "enumerated", export_name: "neutered"},
    {name: "Weight Ranges", type: "string", export_name: "weight_ranges"},
    {name: "Key ingredients", type: "rich_text", export_name: "key_ingredients"}
]);

/**
 * Logs messages or errors with different logging types and optional error raising.
 * Enables more clear error message at Salsify task level
 * @param {string|Error} message_or_error - The message or error to be logged
 * @param {LOG_TYPE} [log_type=LOG_TYPE.ERROR] - The type of log (ERROR or LOG)
 * @param {boolean} [raise_error=true] - Whether to throw an error after logging
 * @throws {Error} If raise_error is true and log_type is LOG_TYPE.ERROR
 */
function log (message_or_error, log_type=LOG_TYPE.ERROR, raise_error=true) {
    switch (log_type) {
        case LOG_TYPE.ERROR:
            function getError(message) {
                try {
                    throw new Error(message);
                } catch (err) {
                    return err;
                }
            }
            error = getError(message_or_error)
            console.error(JSON.stringify(error, null, 4));
            if (raise_error) {
                throw error;
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
 * Flattens an error stack trace by joining its lines with double dashes.
 * @param {Error} error - The error object containing the stack trace to flatten
 * @returns {string} A single string where stack trace lines are separated by " -- "
 */
function flatten_error(error) {
    let error_stack = error.stack.split("\n");
    let new_stack = [];
    for (let line of error_stack) {
        new_stack.push(line.trim());
    }
    return new_stack.join(" -- ");
}

/**
 * Checks if a value is undefined and logs a message accordingly
 * @param {*} value - The value to check for undefined
 * @param {string} message - The message to log if value is undefined
 * @param {boolean} [raise_error=false] - If true, logs as error and throws exception, otherwise logs as regular log
 * @returns {void}
 */
function check_undefined (value, message, raise_error=false) {
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
function check_configuration (properties_list=properties) {
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
    });
}

/**
 * Sends a POST request to the Beeceptor API endpoint
 * @param {string} path - The API endpoint path to be appended to the base domain
 * @param {*} content - The content/payload to be sent in the POST request
 * @returns {void}
 * @see {@link https://beeceptor.com/|Beeceptor Documentation}
 */
function mock_send_to_recipient_API (path, content) {
    const METHOD = 'post';
    const URL = TARGET_DOMAIN_2 + path;
    let secret = "Bearer NORMAL"; // Set ERROR or NORMAL
    const HEADERS = {
        Authorization: secret,
        "Content-Type": "application/json"
    };
    const OPTIONS = {
        return_status: true
    };

    let response = {};
    let new_response = {};
    try {
        const xhr = new XMLHttpRequest();
        xhr.open(METHOD, URL, false); // synchronous request

        Object.keys(HEADERS).forEach(header => {
            xhr.setRequestHeader(header, HEADERS[header]);
        });
        let stringifiedContent = JSON.stringify(content);
        xhr.send(stringifiedContent);
        response = {
            code: xhr.status,
            body: xhr.responseText ? JSON.parse(xhr.responseText) : null
        };
    } catch (error) {
        console.error("Error in mock_send_to_recipient_API:", error);
        response = { code: 500, error: error.message };
    }
    if (response === undefined) {
        new_response = {
            code: 400,
            body: {
                success: false,
                origin: "Ibexa API",
                product_id: PRODUCT_ID,
                task_id: TASK_ID,
                locale: LOCALE,
                message_body: "The Ibexa API did not return a response."
            }
        };
    } else {
        new_response = {
            code: response.code,
            body: {
                success: response.body.success,
                origin: "Ibexa API",
                product_id: PRODUCT_ID,
                task_id: TASK_ID,
                locale: LOCALE,
                message_body: JSON.stringify(response.body)
            }
        };
    }
    return new_response;
}

/**
 * Sends a POST request to the the recipient API endpoint
 * Authorization: Basic dW5pdHk6dW5pdHkwMCE=
 * X-Token-Auth: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDM1OTE3MDEsImV4cCI6MTc3NTEyNzcwMSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoicGltX2FwaSJ9.b9EBfaXgpmmI2U3VxMIJm7LvfpM86EJ7Gw3dm2It_RA
 * @param {string} path - The API endpoint path to be appended to the base domain
 * @param {*} content - The content/payload to be sent in the POST request
 * @returns {void}
 */
function send_to_recipient_API (path, content) {
    const METHOD = 'post';
    const URL = TARGET_DOMAIN + path;
    let secret = "Bearer " + secret_value("ibexa_bearer_token");
    const HEADERS = {
        "Authorization": "Basic dW5pdHk6dW5pdHkwMCE=",
        "X-Token-Auth": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDM1OTE3MDEsImV4cCI6MTc3NTEyNzcwMSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoicGltX2FwaSJ9.b9EBfaXgpmmI2U3VxMIJm7LvfpM86EJ7Gw3dm2It_RA",
        "Content-Type": "application/json"
    };
    const OPTIONS = {
        return_status: true
    };
    let response = web_request(URL, METHOD, content, HEADERS, OPTIONS);
    let response_success = true;
    if ((response.code < 200) || (response.code > 299)) {
        response_success = false;
    }
    let new_response = {};
    if (response === undefined) {
        new_response = {
            code: 400,
            body: {
                success: false,
                origin: "Ibexa API",
                product_id: PRODUCT_ID,
                task_id: TASK_ID,
                locale: LOCALE,
                message_body: "The Ibexa API did not return a response."
            }
        };
    } else {
        new_response = {
            code: response.code,
            body: {
                success: response_success,
                origin: "Ibexa API",
                product_id: PRODUCT_ID,
                task_id: TASK_ID,
                locale: LOCALE,
                message_body: JSON.stringify(response.body)
            }
        };
    }
    if (TARGET_DOMAIN_2 !== undefined) {
        const URL_2 = TARGET_DOMAIN_2 + path;
        let response_2 = web_request(URL_2, METHOD, content, HEADERS, OPTIONS);
    }
    return new_response;
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
function mock_salsify (path, method = 'GET', payload = null, version = 'v1') {
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
function salsify (path, method = 'GET', payload = null, version = 'v1') {
    return salsify_request(path, method, payload, version);
}

/**
 * Fetches a record either from mock data or Salsify API based on MOCK environment flag
 * @param {string} id - The identifier of the record to fetch
 * @returns {Promise<Object>} A promise that resolves with the fetched record data
 * @throws {Error} If the record cannot be fetched
 */
function mock_fetchRecord (id) {
    return mock_load(snake_case(id));
}

/**
 * Fetches a record either from mock data or Salsify API based on MOCK environment flag
 * @param {string} id - The identifier of the record to fetch
 * @returns {Promise<Object>} A promise that resolves with the fetched record data
 * @throws {Error} If the record cannot be fetched
 */
function fetchRecord (id) {
    const PATH = '/products/';
    return salsify(PATH + encodeURIComponent(id));
}

/**
 * Fetches records for a given page and top ID from either a mock source (in test mode) or Salsify API
 * @param {string} topId - The ancestor ID to filter records
 * @param {number} page - The page number to fetch
 * @returns {Promise<Object>} Promise that resolves to the fetched records
 * @throws {Error} Possible API errors when fetching from Salsify
 */
function mock_fetchPageRecords (topId, page) {
    return mock_load(snake_case("children"));
}

/**
 * Fetches records for a given page and top ID from either a mock source (in test mode) or Salsify API
 * @param {string} topId - The ancestor ID to filter records
 * @param {number} page - The page number to fetch
 * @returns {Promise<Object>} Promise that resolves to the fetched records
 * @throws {Error} Possible API errors when fetching from Salsify
 */
function fetchPageRecords (topId, page) {
    const PATH = `/records?filter=='salsify:ancestor_ids':'${encodeURIComponent(topId)}'&per_page=100&page=${page}`;
    return salsify(PATH);
}

/**
 * Mocks fetching enumerated data by loading from a snake-cased identifier
 * @param {string} id - The identifier to fetch enumerated data for
 * @returns {*} The mocked data corresponding to the snake-cased identifier
 */
function mock_fetchEnumerated (id) {
    return mock_load(snake_case(id));
}

/**
 * Retrieves paginated enumerated values for a specific property.
 * @param {string} id - The ID of the property to search for enumerated values.
 * @param {string} [parent] - Optional parent value to filter results within.
 * @param {number} page - The page number to retrieve.
 * @param {number} perPage - The number of items per page.
 * @returns {Array} An array of enumerated values. Returns empty array if no data found.
 */
function searchEnumeratedPage (id, parent, page, perPage) {
    let BASE_PATH = `/properties/${encodeURIComponent(id)}/enumerated_values?page=${page}&per_page=${perPage}`;
    if (parent !== undefined && parent !== '') {
        BASE_PATH += `&within_value=${encodeURIComponent(parent)}`;
    }
    let result = salsify(BASE_PATH, 'GET', null, null);
    return result;
}

/**
 * Searches and retrieves all enumerated records by paginating through the results.
 * @param {string|number} id - The identifier to search for.
 * @param {string} [parent=''] - Optional parent identifier to filter results.
 * @returns {Array} An array containing all matching enumerated records.
 */
function searchEnumerated (id, parent='') {
    let allRecords = [];
    let page = 1;
    const perPage = 120;
    let totalEntries = 0;
    let hasMoreData = true;
    while (hasMoreData) {
        let search_results = searchEnumeratedPage(id, parent, page, perPage);
        if (search_results !== undefined && search_results.data !== undefined) {
            if (search_results.data.length > 0) {
                allRecords = allRecords.concat(search_results.data);
            }
            if (page === 1 && search_results.meta && search_results.meta.total_entries) {
                totalEntries = search_results.meta.total_entries;
            }
        } else {
            hasMoreData = false;
        }
        hasMoreData = allRecords.length < totalEntries;
        page++;
    }
    return allRecords;
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
function fetchEnumerated (id) {
    function mysearchProperty(id, parent='') {
        let records = searchEnumerated(id, parent);
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
    return mysearchProperty(id, '');;
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
function fetchChildRecords (id) {
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
function snake_case (variable_name) {
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
function mock_load (id) {
    const PATH = MOCK_DOMAIN + snake_case(id) + '_property_mock.json';
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
function retrieve_type (value) {
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
function get_localized_value (value) {
    if ((typeof value === 'number') || (typeof value === 'boolean') || (typeof value === 'string')) {
        return value;
    }
    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
        // TODO Uncomment to return a concatenated string instead of a String array
        // if (value.length > 0) {
        //     return value.join('\n');
        // }
        return value[0];  // Return first string from array in case one only
    }
    if (typeof value === 'object' && value !== null) {
        if (value.hasOwnProperty(LOCALE)) {
            return value[LOCALE];
        } else {
            // TODO Uncomment to return a "not translated" message
            // return NOT_TRANSLATED;
            return value;
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
function get_localized_property_values (entity, property_id) {
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
function property_load_default (record, configured_property, property_value, rootRecord) {
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
 * Loads HTML property values into a record object
 * @param {Object} record - The target record object to store the property value
 * @param {Object} configured_property - The property configuration object
 * @param {*} property_value - The property value to process
 * @param {Object} rootRecord - The root record object (unused parameter)
 * @returns {Object|undefined} The updated record object or undefined if property_value is undefined
 */
function property_load_html (record, configured_property, property_value, rootRecord) {
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
 * Processes and loads composition data from a CSV-formatted string into a record object.
 * The CSV string should contain three columns: name, value, and unit, separated by semicolons.
 *
 * @param {Object} record - The target record object to store the processed composition.
 * @param {Object} configured_property - Configuration object for the property.
 * @param {string|undefined} property_value - Multiline CSV string containing composition data.
 * @param {Object} rootRecord - The root record object (unused in current implementation).
 * @returns {Object} The modified record object with added composition data.
 *
 * @example
 * // Input CSV format:
 * // name1;value1
 * // name2;value2
 *
 * @example
 * // Resulting composition array format:
 * // [{name: "name1", value: "value1"},
 * //  {name: "name2", value: "value2"}]
 */
function property_load_composition (record, configured_property, property_value, rootRecord) {
    // We expect a multiline string representing a CSV with ';' separator. The CSV should have 3 columns: name, value, unit
    if (property_value === undefined) {return;}
    value = get_localized_value(property_value);
    if ((value !== undefined) && (value !== null) && (typeof value === 'string')) {
        // We have to check that the entry string is well formed (multiple line with, for each, 2 values separated by a comma)
        const lines = value.split('\n');
        const composition = [];
        for (let line of lines) {
            const values = line.split(';');
            if (values.length >= 2) {
                composition.push({name: values[0], value: values[1]});
            }
        }
        record[get_property_export_name(configured_property)] = composition;
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
function property_load_number (record, configured_property, property_value, rootRecord) {
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
function property_load_boolean (record, configured_property, property_value, rootRecord) {
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
function load_asset (asset_id, configured_property, returned_values, asset_list) {
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
function property_load_digital_asset (record, configured_property, property_value, rootRecord) {
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
            log('Unexpected type for ' + property_id + ' in ' + record.id, LOG_TYPE.ERROR + '. Current type is: ' + returned_type);
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
function load_product_with_qty (product_id, product_qty, configured_property, returned_values) {
    let product_with_qty = null;
    check_undefined(product_id, 'product_id is missing in configured_property ' + configured_property.name, true);
    check_undefined(product_qty, 'product_qty is missing in configured_property ' + configured_property.name, true);
    let sub_value = load(product_id, returned_values);
    if (sub_value === undefined) {return;}
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
function property_load_quantified_product (record, configured_property, property_value, rootRecord) {
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
function property_load_product (record, configured_property, property_value, rootRecord) {
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
 * Loads and processes enumerated property values for a record
 * @param {Object} record - The target record to load the property into
 * @param {Object} configured_property - Configuration object for the property
 * @param {*} property_value - The value(s) to be processed
 * @param {Object} rootRecord - The root record object
 * @returns {Object} The updated record with the processed enumerated values
 *
 * @description
 * This function handles enumerated property values by:
 * 1. Fetching enumerated values for the property
 * 2. Flattening any hierarchical structure into mapped values
 * 3. Processing single values (string) or multiple values (string_array)
 * 4. Converting IDs to their localized names
 * 5. Storing results as an array of {key, value} pairs in the record
 *
 * @throws {Error} Logs error if property type is neither string nor string_array
 */
function property_load_enumerated (record, configured_property, property_value, rootRecord) {
    if (property_value === undefined) return;
    const property_export_name = get_property_export_name(configured_property)
    const returned_type = retrieve_type(property_value);
    let records = fetchEnumerated(configured_property.name);
    if (records === undefined) {
        records = [];
    }
    const mapped_values = [];
    function flatten_tree(records, mapped_values) {
        try {
            records.forEach(enumerated_value => {
                let localized_name = get_localized_value(enumerated_value.localized_names);
                localized_name = localized_name === undefined ? enumerated_value.name : localized_name;
                mapped_values[enumerated_value.id] = localized_name;
                if (enumerated_value.has_children) {
                    flatten_tree(enumerated_value.values, mapped_values);
                }
            });
        } catch (error) {
            console.log('Error while processing enumerated values for ' + configured_property.name, LOG_TYPE.ERROR);
        }
    }
    flatten_tree(records, mapped_values);
    let enumerated_list = [];
    switch (returned_type) {
        case "string":
            let value = mapped_values[property_value];
            value = value === undefined ? property_value : value;
            // TODO Uncomment to use the adapted value
            // if (typeof value === 'string') {
            //     value = value
            // } else if (typeof value === 'object' && value !== null) {
            //     value = value[LOCALE] || property_value;
            // } else {
            //     value = property_value;
            // }
            new_record = {
                key: property_value,
                value: value,
            }
            enumerated_list.push(new_record);
            break;
        case "string_array":
            property_value.forEach(item => {
                let value = mapped_values[item];
                value = value === undefined ? item : value;
                new_record = {
                    key: item,
                    value: value,
                }
                enumerated_list.push(new_record);
            });
            break;
        default:
            log('Unexpected type for ' + property_id + ' in ' + new_record.id, LOG_TYPE.ERROR);
    }
    if ((enumerated_list.length !== 0) || RETURN_NULL_VALUES) {
        record[property_export_name] = enumerated_list;
    }
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
function property_load_computed (record, configured_property, property_value, rootRecord) {
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
function property_load_locale (record, configured_property, property_value, rootRecord) {
    property_export_name = get_property_export_name(configured_property)
    record[property_export_name] = LOCALE;
    return record;
}

function property_load_status (record, configured_property, property_value, rootRecord) {
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
function property_load_children (record, configured_property, property_value, rootRecord) {
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
function get_property_export_name (configured_property) {
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
function load (rootId, configured_properties) {
    let record = {"id": rootId};
    record["task_id"] = TASK_ID;
    if (configured_properties === undefined) {return record;}
    var rootRecord;
    rootRecord = fetchRecord(rootId);
    if (rootRecord === undefined) {return record;}
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
            log('property_type (' + property_type + ') is wrong in ' + property_id, LOG_TYPE.ERROR);
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
function my_specific_computing_function (record, configured_property, property_value, rootRecord) {
    value1 = get_localized_value(rootRecord["ID"]);
    value2 = get_localized_value(rootRecord["Name"]);
    return "Specific computed property: " + value1 + " and also " + value2;
}

/**
* Mapping of Salsify property types to their corresponding loader functions.
* @constant
* @type {Object.<string, Function>}
* @property {Function} string - Default loader for string properties
* @property {Function} composition - Default loader for string properties
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
    "composition": property_load_composition,
    "rich_text": property_load_default,
    "product": property_load_product,
    "number": property_load_number,
    "html": property_load_html,
    "enumerated": property_load_enumerated,
    "digital_asset": property_load_digital_asset,
    "date": property_load_default,
    "boolean": property_load_boolean,
    "children": property_load_children,
    "quantified_product": property_load_quantified_product,
    "computed": property_load_computed,
    "locale": property_load_locale,
    "status": property_load_status,
 };

function check_response(response) {
    if (!response || Object.keys(response).length === 0) {
        throw new Error('Empty response from recipient API');
    }
    if (response?.code && response.code !== 200) {
        const errorBody = response?.body ? JSON.stringify(response.body) : 'No error details';
        throw new Error('Error while sending data to recipient API: ' + response.code + ' - ' + errorBody);
    }
}

/**
 * Main function that handles the flow execution whether in mock mode or production mode.
 * In mock mode, it sets up mock functions and a fixed locale.
 * In production mode, it loads data for a given root ID and sends it to the recipient API.
 *
 * @global {boolean} MOCK - Determines if the application runs in mock mode
 * @global {string} LOCALE - The locale setting for the application
 * @global {Function} send_to_recipient_API - Function to send data to recipient API
 * @global {Object} salsify - Salsify integration object
 * @global {Function} fetchRecord - Function to fetch a single record
 * @global {Function} fetchPageRecords - Function to fetch page records
 * @global {Function} fetchEnumerated - Function to fetch enumerated values
 * @global {Object} flow - Contains flow-related information including locale
 * @global {Object} context - Contains context information including entity data
 * @global {Object} properties - Contains properties configuration
 *
 * @returns {void}
 */
function main () {
    MOCK = (typeof MOCK === 'undefined' ? false : true);
    DEBUG = (typeof DEBUG === 'undefined' ? false : true);
    if(MOCK) {
        LOCALE = "en";
        TASK_ID = "TASK001"
        PRODUCT_ID = "CDS2";
        send_to_recipient_API = mock_send_to_recipient_API;
        salsify = mock_salsify;
        fetchRecord = mock_fetchRecord;
        fetchPageRecords = mock_fetchPageRecords;
        fetchEnumerated = mock_fetchEnumerated
        const record_id = PRODUCT_ID;
        result = load(record_id, properties);
        let response = send_to_recipient_API('', result);
        // check_response(response)
        return response;
    } else {
        LOCALE = (context.current_locale === undefined) ? flow.locale : context.current_locale;
        TASK_ID = id
        PRODUCT_ID = context.entity.external_id;
        const rootId = PRODUCT_ID;

        // let response = send_to_recipient_API('', fetchRecord(rootId));
        // return response;

        let result = load(rootId, properties);
        let response = send_to_recipient_API('', result);
        // check_response(response)
        return response;
    }
}

let response = ""
try {
    response = main();
} catch (error) {
    response = {
        code: 400,
        body: {
            success: false,
            origin: "js script",
            product_id: PRODUCT_ID,
            task_id: TASK_ID,
            locale: LOCALE,
            message_body: flatten_error(error)
        }
    };
}
const now = new Date();
const dateString = now.toISOString();
product_update(context.entity.external_id, { property_values: [ { property_id: 'ibexa_report', values: [ "Last update: " + dateString + " - Response: " + JSON.stringify(response) ] } ] });
let call_status = "success";
if (!response.body.success) {
    call_status = response.body.origin;
}
product_update(context.entity.external_id, { property_values: [ { property_id: 'ibexa_status', values: [ call_status ] } ] });
