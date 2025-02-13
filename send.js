const RETURN_NULL_VALUES = true;
const LOG_TYPE = {ERROR: "error", LOG: "log"};

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
    let secret = "Bearer " + secret_value("ibexa_bearer_token");
    const HEADERS = {
        Authorization: secret,
        "Content-Type": "application/json"
    };
    const OPTIONS = {
        return_status: true
    };
    let response = web_request(URL, METHOD, content, HEADERS, OPTIONS);
    if (response === undefined) {
        response = {};
    }
    return response;

    // function concatenateProperties(obj) {
    //     let properties = "";
    //     function parseObj(currentObj, parentKey = "") {
    //         for (const key in currentObj) {
    //             const fullKey = parentKey ? `${parentKey}.${key}` : key;
    //             if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
    //                 parseObj(currentObj[key], fullKey);
    //             } else {
    //                 properties += ` - ${fullKey}: ${currentObj[key]}\n`;
    //             }
    //         }
    //     }
    //     parseObj(obj);
    //     return properties.trim();
    // }
    // const result = concatenateProperties(response);

    // if ((response.status < 200) || (response.status > 299)) {
    //     return "Resolution A";
    //     // throw new Error("Manual error message");
    //     // We encountered a 'Error' with message: '- message: Unable to complete web request due to exception.'. Please double check your syntax.
    // } else {
    //     return "Resolution B";
    //     // throw new Error("Manual success message");
    //     // We encountered a 'Error' with message: '- message: Success'. Please double check your syntax.
    // }
}

function main() {
    const rootId = context.entity.external_id;
    let result = {};
    result["root_id"] = rootId;
    result["current_locale"] = context.current_locale
    result["flow_locale"] = flow.locale
    let send_result = send_to_recipient_API('/product/create_or_update?locale=fr-FR', result);
    send_result["root_id"] = rootId;
    send_result["current_locale"] = context.current_locale
    send_result["flow_locale"] = flow.locale
    return send_result;
}

main();