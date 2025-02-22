function beeceptor(path, content) {
    const API_DOMAIN = 'https://virbac-pim.free.beeceptor.com/';
    const METHOD_POST = 'POST';
    web_request(API_DOMAIN + path, METHOD_POST, content);
}

function wrapWithArgs(fn, fnName) {
    return function (...args) {
        callStack.push({ name: fnName, args: JSON.stringify(args) });
        try {
            return fn.apply(this, args);
        } catch (error) {
            if (!error_treated) {
                error_treated = true;
                let stackLines = error.stack.split("\n").map(line => line.trim());
                let newStack = [];
                let functionIndex = callStack.length - 1;
                let increment = stackLines.length;
                for (let line of stackLines) {
                    if (isOdd(increment)) {
                        call_stack_idx = Math.floor(increment / 2) - 1;
                        if (call_stack_idx >= 0) {
                            let { name, args } = callStack[call_stack_idx];
                            newStack.push(`Function: ${name}, Args: ${args} -> ${line}`);
                        } else {
                            newStack.push(line);
                        }
                    }
                    increment--;
                }
                const wrappedError = new Error(error.message);
                wrappedError.stack = newStack.join("\n");
                throw wrappedError;
            } else {
                throw error;
            }
        }
    };
}

// Calling main and storing result
// var result = main();
// beeceptor("result", result);
const foo3 = wrapWithArgs(function (arg1, arg2) {
    throw "Error from foo3";
}, "foo3");

const foo2 = wrapWithArgs(function (arg1) {
    foo3(arg1, "arg3");
}, "foo2");

const foo1 = wrapWithArgs(function (arg1, arg2) {
    foo2(arg1);
}, "foo1");

function main() {
    try {
        foo1("myarg1", "myarg2");
    } catch (error) {
        throw "Error from main";
    }
}

main();