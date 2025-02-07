function salsify(path, method = 'GET', payload = null, version = 'v1') {
    return salsify_request(path, method, payload, version);
}

function beeceptor(path, content) {
    var DOMAIN = 'https://virbac-pim.free.beeceptor.com' + path;
    const METHOD = 'post';
    const URL = DOMAIN + path;
    web_request(URL, METHOD, JSON.stringify(content)); // fixed parameter assignment
}

function fetchEnumerated(id) {
    let BASE_PATH = `/properties/${encodeURIComponent(id)}/enumerated_values?page=1&per_page=120`;
    let result = salsify(BASE_PATH, 'GET', null, null);
    let property_record = {
        data: result && result.data ? result.data : []
    }
    return property_record;
}
beeceptor('/product/create_or_update?locale=fr-FR', fetchEnumerated("Country Markets"));
