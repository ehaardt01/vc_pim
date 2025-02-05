function beeceptor(path, content) {
    var DOMAIN = 'https://virbac-pim.free.beeceptor.com';
    const METHOD = 'post';
    const URL = DOMAIN + path;
    web_request(URL, METHOD, content); // fixed parameter assignment
}

function salsify(path, method = 'GET', payload = null, version = 'v1') {
    return salsify_request(path, method, payload, version);
}

function fetchRecord(id) {
    const PATH = '/products/';
    return salsify(PATH + id);
}

function fetchFAQ(id) {
    const PATH = '/records/';
    return salsify(PATH + id);
    // return fetchPageRecords(id, 1);
}

function fetchPageRecords(topId, page) {
    const PATH = `/records?filter=='salsify:ancestor_ids':'${encodeURIComponent(topId)}'&per_page=100&page=${page}`;
    return salsify(PATH);
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


function buildFAQ(id) {
    // Constants for Property Names
    const ID = "salsify:id";
    const QUESTION = "FAQ reference - Question";
    const ANSWER = "FAQ reference - Answer";
    return fetchFAQ(id);
    // Lookup FAQ
    // faq = fetchFAQ(id)
    // Local Function Variables
    let rootRecord = {
        // id: faq[ID],
        // question: faq[QUESTION],
        // answer: faq[ANSWER],
        // taxonomy: faq[TAXONOMY]
        id: id,
        question: "Texte de question",
        answer: "Texte de réponse",
        taxonomy: "Taxonomie"
    };
    return rootRecord;
}

function buildNestedStructure(root, records) {
    let rootRecord = root;
    const FAQ = "FAQ data table"
    const all_faqs = root[FAQ];
    const faqs = []
    for (const one_faq of all_faqs) {
        faqs.push(buildFAQ(one_faq));
    }
    rootRecord.faqs = faqs
    rootRecord.children = [];
    records.forEach(record => {
        rootRecord.children.push(record);
    });
    return rootRecord;
    // Constants for Property Names
    // const ID = "salsify:id";
    // const PARENT_ID = "salsify:parent_id";
    // const NAME = "ID";//"Salsify Name";
    // const TAXONOMY = "Taxonomy";
    // const FAQ = "FAQ data table"
    // // const COLOR = "Color Name";
    // // const SIZE = "Size (US)";

    // // Local Function Variables
    // const rootId = root[ID];
    // const recordMap = {};
    // const all_faqs = root[FAQ];
    // const faqs = []
    // for (const one_faq of all_faqs) {
    //     faqs.push(buildFAQ(one_faq));
    // }

    // let rootRecord = {
    //     id: root[ID],
    //     name: root[NAME],
    //     taxonomy: root[TAXONOMY],
    //     faq: faqs, //root[FAQ], //buildFAQ(10),
    //     children: []
    // };

    // // Create a map of records by ID for quick lookup
    // records.forEach(record => {
    //     const recordId = record[ID];
    //     const parentId = record[PARENT_ID];

    //     if (parentId === rootId) {
    //         // middle tier record (tier 2)
    //         recordMap[recordId] = {
    //             id: recordId,
    //             name: record[NAME],
    //             // color: record[COLOR],
    //             children: []
    //         };
    //     } else {
    //         // middle tier record (tier 3)
    //         recordMap[recordId] = {
    //             id: recordId,
    //             name: record[NAME],
    //             // size: record[SIZE]
    //         };
    //     }
    // });

    // // Attach records to their parents
    // records.forEach(record => {
    //     const currentRecord = recordMap[record[ID]];
    //     const parentId = record[PARENT_ID];
    //     if (parentId === rootId) {
    //         // Attach directly to root if the parentId is the rootId
    //         rootRecord.children.push(currentRecord);
    //     } else {
    //         const parentRecord = recordMap[parentId];
    //         if (parentRecord) {
    //             parentRecord.children.push(currentRecord);
    //         } else {
    //             // If the parent is not found, create a placeholder for the parent
    //             recordMap[parentId] = {
    //                 id: parentId,
    //                 children: [currentRecord]
    //             };
    //         }
    //     }
    // });

    // return rootRecord;
}


function main() {
    const startTime = new Date();
    const rootId = context.entity.external_id;
    const rootRecord = fetchRecord(rootId, null);
    const childRecords = fetchChildRecords(rootId);
    const tree = buildNestedStructure(rootRecord, childRecords);
    const endTime = new Date();
    const duration = endTime - startTime;

    // Calculate minutes and seconds
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);

    // Prepare the property object
    property = {
        id: rootRecord.id,
        name: rootRecord.name,
        type: rootRecord.data_type,
        multivalue: rootRecord.multi_valued,
        searchable: rootRecord.searchable,
        editable: rootRecord.editable
    };

    // Send the results to beeceptor
    beeceptor('/product/create_or_update?locale=fr-FR', tree);
    beeceptor('/product/create_or_update?locale=fr-FR', property);
    beeceptor('/product/create_or_update?locale=fr-FR', { duration: `${minutes} min ${seconds} sec` });
}

main();