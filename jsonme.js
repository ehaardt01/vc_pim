var LOCALE = "en-GB";

function beeceptor(path, content) {
    var DOMAIN = 'https://virbac-pim.free.beeceptor.com';
    const METHOD = 'post';
    const URL = DOMAIN + path;
    web_request(URL, METHOD, content); // fixed parameter assignment
}

function salsify(path, method = 'GET', payload = null, version = 'v1') {
    if(TEST) {
        console.log('Salsify call not allowed at TEST time');
    } else {
        return salsify_request(path, method, payload, version);
    }
}

function fetchProduct(id) {
    if(TEST) {
        return load_mock(snake_case(id));
    } else {
        const PATH = '/products/';
        return salsify(PATH + id);
    }
}

function fetchRecord(record_id) {
    if(TEST) {
        return load_mock(snake_case(record_id));
    } else {
        const PATH = '/records/';
        return salsify(PATH + record_id);
    }
}

function fetchPageRecords(topId, page) {
    if(TEST) {
        console.log('fetchPageRecords not implemented in TEST mode');
    } else {
        const PATH = `/records?filter=='salsify:ancestor_ids':'${encodeURIComponent(topId)}'&per_page=100&page=${page}`;
        return salsify(PATH);
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

function main() {
    if(TEST === undefined || !TEST) {
        const startTime = new Date();
        const rootId = context.entity.external_id;
        const rootProduct = fetchProduct(rootId, null);
        const childRecords = fetchChildRecords(rootId);
        const tree = buildNestedStructure(rootProduct, childRecords);
        const endTime = new Date();
        const duration = endTime - startTime;

        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);

        beeceptor('/product/create_or_update?locale=fr-FR', tree);
    }
}

main();