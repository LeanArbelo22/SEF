// const { Client, LocalAuth} = require("whatsapp-web.js");
// const MULTI_DEVICE = process.env.MULTI_DEVICE || 'true';
const http = require('http'); // or 'https' for https:// URLs
const https = require('https');
const fs = require('fs');
const qr = require('qr-image');

const cleanNumber = (number) => {
    number = number.replace('@c.us', '');
    number = `${number}@c.us`; // ? es lo mismo que sin hacer el replace
    return number
}

const generateImage = (base64, cb = () => {}) => {
    let qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
    qr_svg.pipe(require('fs').createWriteStream('./mediaSend/qr-code.svg'));
    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
    console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
    cb() // ?
}

const checkEnvFile = () => {
    const pathEnv = `${__dirname}/../.env`;
    const exist = fs.existsSync(pathEnv);
    if(!exist){
        console.log(`ATENCION! te falta crear tu archivo .env, de lo contrario no funcionara`)
    }
}

const saveExternalFile = (url) => new Promise((resolve, reject) => {
    const ext = url.split('.').pop()
    const checkProtocol = url.split('/').includes('https:');
    const handleHttp = checkProtocol ? https : http;
    const name = `${Date.now()}.${ext}`;
    const file = fs.createWriteStream(`${__dirname}/../mediaSend/${name}`);
    console.log(url)
     handleHttp.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close();  // close() is async, call cb after close completes.
            resolve(name)
        });
        file.on('error', function() {
            console.log('errro')
            file.close();  // close() is async, call cb after close completes.
            resolve(null)
        });
    });
})

const isValidNumber = (rawNumber) => {
    const regexGroup = /\@g.us\b/gm; // ? g o c
    const exist = rawNumber.match(regexGroup);
    return !exist
}

function setDate (unix_timestamp){
    var date = new Date(unix_timestamp * 1000);
    let newDate = date.toLocaleString("es-MX", {timeZone: "America/Argentina/Cordoba"});
    return newDate;
}

module.exports = {
    cleanNumber,
    generateImage,
    checkEnvFile,
    saveExternalFile,
    isValidNumber,
    setDate
}




























module.exports = {setDate, cleanNumber, saveExternalFile, generateImage, checkEnvFile, isValidNumber}