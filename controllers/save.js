const mimeDb = require('mime-db')
const fs = require('fs')
const {models} = require('./../libs/sequelize')
/**
 * Guardamos archivos multimedia que nuestro cliente nos envie!
 * @param {*} media 
 */
const saveMedia = (media) => {
    const extensionProcess = mimeDb[media.mimetype]
    const ext = extensionProcess.extensions[0]
    fs.writeFile(`./media/${Date.now()}.${ext}`, media.data, { encoding: 'base64' }, function (err) {
        console.log('** Archivo Media Guardado **');
    });
}

const addChat = async (chat, vendedorNumber) => {
   
      
       let numberC =  chat.id._serialized;
       let numberNew  =  chat.id.user;
       let nameNew  =  chat.name;

       let cID =  numberC+'_'+vendedorNumber;

       //  Este bug evitar que se publiquen estados
   if (numberC === 'status@broadcast' || numberNew === 'status@broadcast') {
    console.log('estado');

    return
}

      let [Cliente, created] = await models.Cliente.findOrCreate({
        where: { id: cID  },
        defaults: {
          id: cID,
          number: numberNew,
          name: nameNew,
          vendedorNumber: vendedorNumber
        }
      });
return
}






module.exports = {saveMedia, addChat}