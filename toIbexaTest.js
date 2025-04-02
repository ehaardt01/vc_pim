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
        code: rootId,
        body: {
            "success": false,
            "error": null
        }
    };
    return response;
}

try {
    main();
} catch (error) {
    throw new Error(flatten_error(error));
}