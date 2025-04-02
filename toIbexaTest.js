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
    response = {
        code: 200,
        body: {
            "success": true,
            "product_id": context.entity.external_id,
            "task_id": id,
            "locale": (context.current_locale === undefined) ? flow.locale : context.current_locale,
            "error_stack": ""
        }
    };
    throw new Error("This is a test error");
    return response;
}

try {
    main();
    product_update(context.entity.external_id, { property_values: [ { property_id: 'ibexa_report', values: [ "" ] } ] }); // No error, we reset the ibexa_report field
} catch (error) {
    response = {
        code: 400,
        body: {
            "success": false,
            "product_id": context.entity.external_id,
            "task_id": id,
            "locale": (context.current_locale === undefined) ? flow.locale : context.current_locale,
            "error_stack": flatten_error(error)
        }
    };
    product_update(context.entity.external_id, { property_values: [ { property_id: 'ibexa_report', values: [ JSON.stringify(response) ] } ] });
    JSON.stringify(response);
}