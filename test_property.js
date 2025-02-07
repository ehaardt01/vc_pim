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
    let BASE_PATH = `/properties/${encodeURIComponent(id)}/enumerated_values?page=1&per_page=30`;
    let result = salsify(BASE_PATH, 'GET', null, null);
    return result && result.data ? result.data : [];
    // const PATH = 'https://app.salsify.com/api/orgs/s-e8cb4aec-71e2-433b-9355-edf0312746cc/properties/Country%20Markets/enumerated_values';
    // const method = "get";
    // const payload = {};
    // const headers = {
    //     Authorization: "Bearer H_TijzVgjG2Mr-fikMWtT9vjDmZJOx-bbWsWc8mAmqQ",
    //     "Content-Type": "application/json"
    // };
    // const options = {
    //     return_status: true
    // };
    // response = web_request(PATH, method, payload, headers, options);
    // // const PATH = '/properties/' + encodeURIComponent(id) + '/enumerated_values'
    // // return salsify(PATH);
    return response;
}
beeceptor('/product/create_or_update?locale=fr-FR', fetchEnumerated("Country Markets"));
