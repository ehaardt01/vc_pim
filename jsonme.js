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

function fetchRecord(id) {
    if(TEST) {
        return load_mock(snake_case(id));
    } else {
        const PATH = '/products/';
        return salsify(PATH + id);
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

function fetchPropertyRecord(record_id) {
    if(TEST) {
        return load_mock(snake_case(record_id));
    } else {
        const PATH = '/records/';
        return salsify(PATH + record_id);
    }
}

function fetchFAQ(id) {
    if(TEST) {
        return load_mock(snake_case(record_id));
    } else {
        const PATH = '/records/';
        return salsify(PATH + id);
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

function buildFAQ(id) {
    const ID = "salsify:id";
    const QUESTION = "FAQ reference - Question";
    const ANSWER = "FAQ reference - Answer";
    return fetchFAQ(id);
    let rootRecord = {
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
}

function main() {
    if(!TEST) {
        const startTime = new Date();
        const rootId = context.entity.external_id;
        const rootRecord = fetchRecord(rootId, null);
        const childRecords = fetchChildRecords(rootId);
        const tree = buildNestedStructure(rootRecord, childRecords);
        const endTime = new Date();
        const duration = endTime - startTime;

        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);

        beeceptor('/product/create_or_update?locale=fr-FR', tree);
    }
}

main();