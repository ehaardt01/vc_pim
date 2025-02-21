function beeceptor(path, content) {
    const API_DOMAIN = 'https://virbac-pim.free.beeceptor.com/';
    const METHOD_POST = 'POST';
    web_request(API_DOMAIN + path, METHOD_POST, content);
}

// Centralized error handling function
function handleError(functionName, functionDescription, parameters, error) {
    return {
        success: false,
		"function": functionName,
        "description": functionDescription,
        "parameters": parameters,
        "message": error.message || String(error),
        "timestamp": new Date().toISOString(),
        "error": error
    };
}

function salsify(path, method = 'GET', payload = null, version = 'v1') {
	const FUNCTION_NAME = `${salsify.name}(path, method, payload, version)`;
    const MESSAGE_FETCH_SALSIFY = "JS helper function wrapper for all salsify_request functions.";
    let response;

    try {
        response = salsify_request(path, method, payload, version);
    } catch (error) {
        throw handleError(
            FUNCTION_NAME,
            MESSAGE_FETCH_SALSIFY,
            { path, method, payload, version },
            error
        );
    }

    return response;
}


function fetchRecord(id, version = 'v1') {
    const FUNCTION_NAME = `${fetchRecord.name}(id, version)`;
    const FUNCTION_DESCRIPTION = "Fetch 1 record by External Id";
    const PATH = `/products/${id}`;
    const METHOD_GET = 'GET';
    let response;

    try {
        response = salsify(PATH, METHOD_GET, null, version);
    } catch (error) {
        throw handleError(
            FUNCTION_NAME,
            FUNCTION_DESCRIPTION,
            { id, version, requestPath: PATH },
            error
        );
    }

    return response;
}


function main() {
    const FUNCTION_NAME = `${main.name}()`;
    const FUNCTION_DESCRIPTION = "Main function execution";
    const id = "fakeid";

    let result = {
        "success": false,  // Default to false, updated on success
        "error": null
    };

    try {
        const response = fetchRecord(id);
        result.success = true;
    } catch (error) {
        const formattedError = handleError(
            FUNCTION_NAME,
            FUNCTION_DESCRIPTION,
            { id },
            error
        );
        result.error = JSON.stringify(formattedError,null,4); // Store the error object
        throw(formattedError);
    }
    return result;
}

// Calling main and storing result
// var result = main();
// beeceptor("result", result);
result = {
    "error": "The error",
    "message": "The error message",
}
throw(JSON.stringify(result,null,4));
