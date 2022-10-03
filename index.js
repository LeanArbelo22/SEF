//librerias
require('dotenv').config()
const fs = require('fs');
const qrcode = require("qrcode-terminal");
const qr = require('qr-image');
const express = require('express');
const { Client, LocalAuth } = require("whatsapp-web.js");
const port =  process.env.PORT ;
const cors = require('cors');
const {Server} = require('socket.io');
const {createServer} =  require('http')
// funciones y variables
/* codigo comentado 1 */
const { saveMedia, addChat} = require('./controllers/save');
const {models} = require('./libs/sequelize');
const {createSeller} = require('./db/services/seller.services.js');
const {updateCLients} = require('./db/services/client.services.js');
const {GETMessages} = require('./db/services/messages.services.js');
const  routerApi = require('./routes');
const { Socket } = require('dgram'); // ?


const app= express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors:{
    origin: ['https://sef-production-a2d4.up.railway.app', 'http://localhost:3000']
  }
});

app.use(cors());
routerApi(app);

app.use(express.json());

httpServer.listen(port, () => {
  console.log('port listo')
});

/* codigo comentado 2 */

io.on("connection", socket => {
  console.log("conectado");

  socket.on("newSeller", (newSellerName) => {
    console.log(newSellerName);
    withOutSession(newSellerName);
  })
})

/* codigo comentado 3 */

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
    
    client.on('qr', qr => { 
      try {
        qrcode.generate(qr, { small: true });

        console.log(qr);
        io.emit("qrNew", qr )

      } catch (error) {
          console.log(error)
      }
    });

    client.on('ready', async () => {
      try {
        //connectionReady();
          await createSeller(client, id);
        //await updateCLients(client)
        //await  GETMessages(client);
          io.emit("okSeller", client)
          console.log('iniciado')
      }
      catch (e) {
        console.log(e)
        io.emit("failSeller")
      }
    });

  client.on('disconnected', () => {
    client.destroy();
    client.initialize();
  })
    client.on('message_create', async (msg) =>{
      let clientInfo = client.info;
      let vendedorNumber = clientInfo.wid.user;
  
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
      } else {
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

      io.emit("newMessage", msg)
    })
}

/* ********** */
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
    // await  GETMessages(client);
    console.log('finalizado');
  });
}

const delSession = (id) => {
  const delSeller = `${__dirname}/sessions/session-${id}`
  if (fs.existsSync(delSeller)) {
    fs.rmdirSync(delSeller, { recursive: true })
  }
}

// auth('mati');
// auth('elias');
// auth('mauro');

// auth ('leandro');
// auth ('mati');