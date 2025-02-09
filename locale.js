
function beeceptor(content) {
    const DOMAIN = 'https://virbac-pim.free.beeceptor.com/product/create_or_update?locale=fr-FR';
    const METHOD = 'POST';
    web_request(DOMAIN, METHOD, JSON.stringify(content)); // Ensure JSON payload
}

const result = {
    locale: flow.locale
}
beeceptor(result);
