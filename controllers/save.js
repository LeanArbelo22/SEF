const mimeDb = require('mime-db');
const fs = require('fs');
const {models} = require('./../libs/sequelize');

// *******************************************************
/*
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
// *******************************************************

const addChat = async (chat, sellerNum) => {
       let clientNum = chat.id._serialized;
       let newNumber = chat.id.user;
       let newName = chat.name;
       let clientID =  clientNum + '_' + sellerNum;

      //  Este bug evitar que se publiquen estados
      if (clientNum === 'status@broadcast' || newNumber === 'status@broadcast') { 
          console.log('Estado de Whatsapp');
          return;
      }
      
      // ?? Cliente, created 
      let [Cliente, created] = await models.Cliente.findOrCreate({
        where: { id: clientID  },
        defaults: {
          id: clientID,
          number: newNumber,
          name: newName,
          vendedorNumber: sellerNum
        }
      });
      
      return
}

module.exports = {saveMedia, addChat}