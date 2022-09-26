const {config} = require('../config/config');


let URI ='';

if (config.isProd){
URI= config.dbUrl;
}else{
    const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
 URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
}

    
// const USER = encodeURIComponent(config.dbUser);
// const PASSWORD = encodeURIComponent(config.dbPassword);
// const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;


module.exports = {
    development:{
        url: URI,
        dialect: 'postgres',
    },
    production:{
        url:URI,
        dialect: 'postgres',
    }
}