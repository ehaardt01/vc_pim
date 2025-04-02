function flatten_error(error) {
    let error_stack = error.stack.split("\n");
    let new_stack = [];
    for (let line of error_stack) {
        new_stack.push(line.trim());
    }
    return new_stack.join(" -- ");
}

function main () {
    LOCALE = (context.current_locale === undefined) ? flow.locale : context.current_locale;
    const rootId = context.entity.external_id;
    const params = {
        body: "This is my insightful contribution.",
        // From a Workflow Javascript Bot, `id`
        // will reference the running Task's ID.
        entity_id: id,
        entity_type: "task"
    };
    post_comment(params);
    response = {
        code: 200,
        body: {
            "success": true,
            "product_id": context.entity.external_id,
            "task_id": id,
            "locale": (context.current_locale === undefined) ? flow.locale : context.current_locale,
            "error_message": "",
            "error_stack": ""
        }
    };
    return response;
}

try {
    main();
    throw new Error("This is a test error");

} catch (error) {
    const errorMessage = error.message;
    response = {
        code: 400,
        body: {
            "success": false,
            "product_id": context.entity.external_id,
            "task_id": id,
            "locale": (context.current_locale === undefined) ? flow.locale : context.current_locale,
            "error_message": error.message,
            "error_stack": error.stack
        }
    };
    // const options = { return_status: true };
    // const payload = [{ ibexa_report: JSON.stringify(response) }];
    // const response = salsify_request("/products/"+context.entity.external_id, "put", payload, "v1", options);
    product_update(context.entity.external_id, { property_values: [ { property_id: 'ibexa_report', values: [ 'boo' ] } ] });
    JSON.stringify(response);
}