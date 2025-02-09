/* ********************************************************************************************* */
/* UTILITIES                                                                                     */
/* ********************************************************************************************* */

function beeceptor(path, content) {
    const DOMAIN = 'https://virbac-pim.free.beeceptor.com/product/create_or_update?locale=fr-FR';
    const METHOD = 'POST';
    web_request(DOMAIN + path, METHOD, JSON.stringify(content)); // Ensure JSON payload
}

function salsify(path, method = 'GET', payload = null, version = 'v1') {
    return salsify_request(path, method, payload, version);
}

/* ********************************************************************************************* */
/* DATA ACCESS LAYER                                                                             */
/* ********************************************************************************************* */

function searchEnumeratedPage(property, parent, page, perPage) {
    let BASE_PATH = `/properties/${encodeURIComponent(property)}/enumerated_values?page=${page}&per_page=${perPage}`;

    if (parent) {
        BASE_PATH += `&within_value=${encodeURIComponent(parent)}`;
    }

    let result = salsify(BASE_PATH, 'GET', null, null);

    return result && result.data ? result.data : [];
}

function searchEnumerated(property, parent = '', perPage = 10) {
    let allRecords = [];
    let page = 1;
    let totalEntries = 0;
    let hasMoreData = true;

    while (hasMoreData) {
        let records = searchEnumeratedPage(property, parent, page, perPage);

        if (records.length > 0) {
            allRecords = allRecords.concat(records);
        }

        // Ensure meta is defined before accessing `total_entries`
        if (page === 1 && records.meta && records.meta.total_entries) {
            totalEntries = records.meta.total_entries;
        }

        // Stop fetching if we've retrieved all entries
        hasMoreData = allRecords.length < totalEntries;
        page++;
    }

    return allRecords;
}

function searchPropertyById(property) {
    let PROPERTY_PATH = `/properties/${encodeURIComponent(property)}`;
    let response = salsify(PROPERTY_PATH, 'GET',null,null);
    if (!response || !response.data) {
        console.error(`Failed to fetch property: ${property}`);
        return null;
    }

    return response.data;
}


/* ********************************************************************************************* */
/* BUSINESS FUNCTIONS                                                                            */
/* ********************************************************************************************* */
function getProperty(property) {
    let propertyDetails = searchPropertyById(property);
    if (!propertyDetails) return null;

    let propertyData = {
        id: propertyDetails.id,
        name: propertyDetails.name,
        type: propertyDetails.data_type,
        multivalue: propertyDetails.multi_valued,
        searchable: propertyDetails.searchable,
        editable: propertyDetails.editable
    };

    // If the property is a picklist, fetch its enumerated values
    if (propertyDetails.data_type === "enumerated") {
        propertyData.values = getEnumeratedValues(property);
    }

    return propertyData;
}

function getEnumeratedValues(property, parentId = '') {
    let records = searchEnumerated(property, parentId);
    let tree = [];

    for (let item of records) {
        let node = {
            id: item.id,
            name: item.name,
            localized_names: item.localized_names,
            values: []
        };

        // Recursively fetch children if applicable
        if (item.has_children) {
            node.values = getEnumeratedValues(property, item.id);
        }

        tree.push(node);
    }

    return tree;
}



// Example usage

// beeceptor("", getProperty("Taxonomy"));

function myfetchEnumerated(id) {
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
    result = mysearchProperty(id);
    result["locale"] = flow.locale;
    return ;
}
beeceptor("", myfetchEnumerated("Group Species"));
