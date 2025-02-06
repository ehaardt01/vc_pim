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
    {name: "salsify:created_at", type: "direct", export_name: "created_at"},
    {name: "salsify:updated_at", type: "direct", export_name: "updated_at"},
    {name: "FAQ data table", type: "record", export_name: "faq", values: [{name: "FAQ reference - Question ", type: "direct", export_name: "question"}, {name: "FAQ reference - Answer", type: "direct", export_name: "answer"}]},
    {name: "Country Markets", type: "enumerated", export_name: "country_markets"},
    {name: "salsify:version", type: "direct", export_name: "version"},
    {name: "salsify:profile_asset_id", type: "direct", export_name: "profile_asset_id"},
    {name: "salsify:system_id", type: "direct", export_name: "system_id"},
    {name: "ID", type: "direct", export_name: "id"},
    {name: "Group Species", type: "direct", export_name: "group_species"},
    {name: "Default Sales Price", type: "direct", export_name: "default_sales_price"},
    {name: "LIB_MARQUE", type: "direct", export_name: "lib_marque"},
    {name: "Taxonomy", type: "direct", export_name: "taxonomy"},
    {name: "Business category level 1", type: "direct", export_name: "business_category_level_1"},
    {name: "Business category level 2", type: "direct", export_name: "business_category_level_2"},
    {name: "Business category level 3", type: "direct", export_name: "business_category_level_3"},
    {name: "Business category level 4", type: "direct", export_name: "business_category_level_4"},
    {name: "Visible online ?", type: "direct", export_name: "visible_online"},
    {name: "Name", type: "direct", export_name: "name"},
    {name: "B2C Short description", type: "direct", export_name: "b2c_short_description"},
    {name: "B2C Full Description", type: "direct", export_name: "b2c_full_description"},
    {name: "B2B Short description", type: "direct", export_name: "b2b_short_description"},
    {name: "SEO Product Title", type: "direct", export_name: "seo_product_title"},
    {name: "Marketing Product name", type: "direct", export_name: "marketing_product_name"},
    {name: "Key figures", type: "direct", export_name: "key_figures"},
];

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

main();