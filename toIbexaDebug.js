DEBUG = true;
fetch('https://raw.githubusercontent.com/ehaardt01/vc_pim/refs/heads/main/toIbexa.js')
    .then(response => response.text())
    .then(scriptText => {
        eval(scriptText);
    });
return RESULT;