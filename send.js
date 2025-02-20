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
    } else {
        if ((response.code < 200) || (response.code > 299)) {
            response["returned_status"] = "error " + response.code;
        } else {
            response["returned_status"] = "success " + response.code;
        }
    }
    return response;
}

function main() {
    const rootId = context.entity.external_id;
    const PATH = '/products/DWD';
    let rootRecord = salsify_request(PATH, 'GET', null, 'v1');
    rootRecord["root_id"] = rootId;
    rootRecord["current_locale"] = context.current_locale
    rootRecord["flow_locale"] = flow.locale
    send_to_recipient_API('/product/create_or_update?locale=fr-FR', rootRecord);
}

main();