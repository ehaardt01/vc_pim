function beeceptor(path, content) {
    const DOMAIN = 'https://asics.free.beeceptor.com';
    const METHOD = 'POST';
    web_request(DOMAIN + path, METHOD, content);
}

function salsify(path, method = 'GET', payload = null, version = 'v1') {
    return salsify_request(path, method, payload, version);
}

function fetchRecord(id) {
    const BASE_PATH = '/products/';
    return salsify(BASE_PATH + id);
}

function mergeRecords(child, parent) {
    const DIGITAL_ASSETS_KEY = "salsify:digital_assets";
    const DIGITAL_ASSET_ID_KEY = "salsify:id";
    
    // Child properties fully overwrite parent properties
    let merged = { ...parent, ...child };

    // Ensure digital assets are merged uniquely
    if (Array.isArray(parent[DIGITAL_ASSETS_KEY]) || Array.isArray(child[DIGITAL_ASSETS_KEY])) {
        const combinedAssets = [...(child[DIGITAL_ASSETS_KEY] || []), ...(parent[DIGITAL_ASSETS_KEY] || [])];

        // Remove duplicates based on salsify:id
        const uniqueAssets = [];
        const seenIds = new Set();

        for (const asset of combinedAssets) {
            if (!seenIds.has(asset[DIGITAL_ASSET_ID_KEY])) {
                seenIds.add(asset[DIGITAL_ASSET_ID_KEY]);
                uniqueAssets.push(asset);
            }
        }

        merged[DIGITAL_ASSETS_KEY] = uniqueAssets;
    }

    return merged;
}


function crawlUpTree(id, structure = []) {
    const PARENT_KEY = "salsify:parent_id";
    let mergedRecord;

    let record = fetchRecord(id);
    if (record && record[PARENT_KEY]) {
        let parentRecord = crawlUpTree(record[PARENT_KEY], structure); // Recursive call with structure tracking
        mergedRecord = mergeRecords(record, parentRecord); // Merge the records
    } else {
        mergedRecord = record; // Base case: No parent, return the record itself
    }

    // Append the current ID to the structure array (ensuring highest parent is first)
    structure.push(id);
    
    // Assign the structure array to the final merged record
    mergedRecord["salsify:structure"] = structure;

    return mergedRecord; // Dedicated return at the bottom
}


// Start process
const ENTITY_ID_KEY = "external_id";
const id = context.entity[ENTITY_ID_KEY];
var finalObject = crawlUpTree(id);
beeceptor("/test/", finalObject);
