
function beeceptor(path, content) {
    const API_DOMAIN = 'https://virbac-pim.free.beeceptor.com/';
    const METHOD_POST = 'POST';
    web_request(API_DOMAIN + path, METHOD_POST, content);
}
var id = "DWD";
var obj1 = salsify_request(`/products/${id}`,"GET",null,'v1')
var obj2 = salsify_request(`/products/${id}`,"GET",null,null)

beeceptor("obj1", obj1);
beeceptor("obj2", obj2);
beeceptor("context", context);