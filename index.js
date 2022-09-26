//librerias
require('dotenv').config()
const fs = require('fs');
const qrcode = require("qrcode-terminal");
const qr = require('qr-image');
const express = require('express');
const { Client, LocalAuth } = require("whatsapp-web.js");
const port =  process.env.PORT || 4000;
const cors = require('cors');
const {Server} = require('socket.io');
const {createServer} =  require('http')
// funciones y variables
// const { generateImage, cleanNumber, checkEnvFile, isValidNumber } = require('./controllers/handle')
// const { connectionReady } = require('./controllers/connection')
const { saveMedia, addChat} = require('./controllers/save');
// const { getMessages, responseMessages } = require('./controllers/flows')
// const { sendMedia, sendMessage, lastTrigger, sendMessageButton, readChat } = require('./controllers/send');
const {models} = require('./libs/sequelize');
  const {createSeller} = require('./db/services/seller.services.js');
  const {updateCLients} = require('./db/services/client.services.js');
  const {GETMessages} = require('./db/services/messages.services.js');
const  routerApi = require('./routes');
const { Socket } = require('dgram');




const app= express();
const httpServer = createServer(app);
const io = new  Server(httpServer, {
  cors:{
 origin:'http://localhost:3000'
}
});


app.use(cors());
routerApi(app);

app.use(express.json());

httpServer.listen(port, () => {
  console.log('port listo')
});

// const whitelist =['urls permitidas','']
// const options = {
//   origin: (origin, callback) =>{
//     if(whitelist.includes(origin)){
//       callback(null,true);
//     }else{
//       callback(new Error('no permitido'));
//     }
//   }
// }
// app.use(cors(options));


io.on("connection", socket =>{
  console.log("conectado");

  socket.on("newSeller", (newSellerName) => {
    console.log(newSellerName);
    withOutSession(newSellerName);
    
    })
        
    

})













/**Leemos el mensaje*/
// const listenMessage = (client) => client.on('message', async msg => {
//     const { from, body, hasMedia } = msg;

    // if(!isValidNumber(from)){
//         return
//     }

//     // Este bug evitar que se publiquen estados
//     if (from === 'status@broadcast') {
//         return
//     }
//     message = body.toLowerCase();
//     console.log('BODY',message)
//     const number = cleanNumber(from)
//     await readChat(number, message)

//     /**
//      * Guardamos el archivo multimedia que envia
//      */
//     if (process.env.SAVE_MEDIA && hasMedia) {
//         const media = await msg.downloadMedia();
//         saveMedia(media);
//     }

//     /**
//     * Ver si viene de un paso anterior
//     * Aqui podemos ir agregando más pasos
//     * a tu gusto!
//     */

//     const lastStep = await lastTrigger(from) || null;
//     if (lastStep) {
//         const response = await responseMessages(lastStep)
//         await sendMessage(client, from, response.replyMessage);
//     }

//     /**
//      * Respondemos al primero paso si encuentra palabras clave
//      */
//     const step = await getMessages(message);

//     if (step) {
//         const response = await responseMessages(step);

//         /**
//          * Si quieres enviar botones
//          */

//         await sendMessage(client, from, response.replyMessage, response.trigger);

//         if(response.hasOwnProperty('actions')){
//             const { actions } = response;
//             await sendMessageButton(client, from, null, actions);
//             return
//         }

//         if (!response.delay && response.media) {
//             sendMedia(client, from, response.media);
//         }
//         if (response.delay && response.media) {
//             setTimeout(() => {
//                 sendMedia(client, from, response.media);
//             }, response.delay)
//         }
//         return
//     }

//     //Si quieres tener un mensaje por defecto
//     if (process.env.DEFAULT_MESSAGE === 'true') {
//         const response = await responseMessages('DEFAULT')
//         await sendMessage(client, from, response.replyMessage, response.trigger);

//         /**
//          * Si quieres enviar botones
//          */
//         if(response.hasOwnProperty('actions')){
//             const { actions } = response;
//             await sendMessageButton(client, from, null, actions);
//         }
//         return
//     }
// });


const  withOutSession =  async (id) => {

     
    console.log('No tenemos session guardada');
   
    const client = new Client({
        restartOnAuthFail: true,
        puppeteer: {
           
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ],
        },
        authStrategy: new LocalAuth({ clientId: id, dataPath: './sessions'}),
    
    });

    client.initialize();
    
    client.on('qr', qr =>{ try {
      qrcode.generate(qr, { small: true });
      console.log(qr);
      io.emit("qrNew", qr )

    } catch (error) {
      console.log(error)
    }
        
        
    });

    client.on('ready', async () => {
        // connectionReady();
      //   await createSeller(client, id);
      //   await updateCLients(client)
      //  await  GETMessages(client);
        io.emit("okSeller")
        console.log('iniciado')
    });


    
    client.on('message_create', async (msg) =>{
      let clientInfo =  client.info;
         let vendedorNumber =     clientInfo.wid.user;
  
       let chat =  await msg.getChat();
      let add = await addChat(chat, vendedorNumber );
  
       var clienteNumberN = '';
      let body =  msg.body;
      let to = msg.to;
      let from = msg.from;
      let date1 = msg.timestamp;
     let date =   date1*1000;
      let fromMe =  msg.fromMe;
      let idv =  msg.id.id;

      //  Este bug evitar que se publiquen estados
    if (from === 'status@broadcast' || to === 'status@broadcast') {
      console.log('estado')
        return
    }
  
      if(fromMe==true){
         clienteNumberN =  msg.to; 
     }
     else{
         clienteNumberN =  msg.from;
     };
  
     let cID=   clienteNumberN+'_'+vendedorNumber;
     let idN = idv +' by '+ cID;
  
  
       let m =  models.Mensaje.create({ 
         body:body,
         to:to,
         from:from,
         date:date,
         fromMe:fromMe,
         id:idN,
         clienteId:cID
  
       })
  
       })
  
  

    return 
}

// codigo wemerson
  
async function auth(myCustomId){
    const authStrategy = new LocalAuth({
        clientId: myCustomId,
         dataPath: './sessions' 
    })


const worker = `${__dirname}/sessions/session-${myCustomId}/Default/Service Worker`
if (fs.existsSync(worker)) {
   fs.rmdirSync(worker, { recursive: true })
}

const client = new Client({
    restartOnAuthFail: true,
    puppeteer: { 
       
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
      },
   takeoverOnConflict: true,
   takeoverTimeoutMs: 10,
    authStrategy,
 })

client.initialize()
   .then(async () => {
      
      console.log(`WHATSAPP WEB initialize`)
   })
   .catch((err) => {
      console.error(err)   
   })



   client.on('message_create', async (msg) =>{


    
    
    let clientInfo =  client.info;
       let vendedorNumber =     clientInfo.wid.user;

     let chat =  await msg.getChat();
    let add = await addChat(chat, vendedorNumber );

     var clienteNumberN = '';
    let body =  msg.body;
    let to = msg.to;
    let from = msg.from;
    let date1 = msg.timestamp;
   let date =   date1*1000;
    let fromMe =  msg.fromMe;
    let idv =  msg.id.id;

   //  Este bug evitar que se publiquen estados
   if (from === 'status@broadcast' || to === 'status@broadcast') {
    return
}


    if(fromMe==true){
       clienteNumberN =  msg.to; 
   }
   else{
       clienteNumberN =  msg.from;
   };

   let cID=   clienteNumberN+'_'+vendedorNumber;
   let idN = idv +' by '+ cID;


     let m =  models.Mensaje.create({ 
       body:body,
       to:to,
       from:from,
       date:date,
       fromMe:fromMe,
       id:idN,
       clienteId:cID

     })

     })

   client.on('ready', async () => {
   
    
    // connectionReady();
    await createSeller(client, myCustomId);
    // await updateCLients(client)
  //  await  GETMessages(client);

   console.log('finalizado');

});

}
//d

const delSession = (id) => {
  const delSeller = `${__dirname}/sessions/session-${id}`
  if (fs.existsSync(delSeller)) {
    fs.rmdirSync(delSeller, { recursive: true })
  }
  
}




 

auth('mati');
// auth('elias');
// auth('mauro');
 


//  withOutSession ('mati');
