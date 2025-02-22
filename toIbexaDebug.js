DEBUG = true;
fetch('https://raw.githubusercontent.com/ehaardt01/vc_pim/refs/heads/main/toIbexa.js')
    .then(response => response.text())
    .then(scriptText => {
        eval(scriptText); // Attention : utiliser eval peut poser des risques de sécurité
    });