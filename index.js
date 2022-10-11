require('dotenv').config();
const fs = require('fs');
const qrcode = require("qrcode-terminal");
const { addChat } = require('./controllers/save');
const { models } = require('./libs/sequelize');
const { createSeller } = require('./db/services/seller.services.js');
const routerApi = require('./routes');
const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require("whatsapp-web.js");
const { Server } = require('socket.io');
const { createServer } = require('http');
const PORT = process.env.PORT || 3002;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ['https://sef-production-a2d4.up.railway.app', 'http://localhost:3000']
    }
});

app.use(cors());
routerApi(app);
app.use(express.json());

httpServer.listen(PORT, () => {
    console.log('Port listo:', PORT)
});

io.on("connection", socket => {
    console.log("Socket conectado");

    socket.on("newSeller", async (newSellerName) => {
        console.log("Evento de socket - newSeller:", newSellerName);

        const session = newSession(newSellerName);
        generateSession(session, newSellerName, 'NUEVO');
    })
});

const newSession = (sellerName) => {
    try {
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
            // ? timeout
            // takeoverOnConflict: true,
            // takeoverTimeoutMs: 10,
            authStrategy: new LocalAuth({ clientId: sellerName, dataPath: './sessions' })
        });

        return client;

    } catch (e) {
        console.log(e);
    }
}

const generateSession = (seller, sellerName, from) => {
    seller.initialize()
        .then(() => console.log('Sesion iniciada:', from))
        .catch((e) => console.error(e));

    seller.on('qr', qr => {
        try {
            qrcode.generate(qr, { small: true });
            io.emit("qrNew", qr);
        } catch (e) {
            console.log(e);
            io.emit("qrError", e);
        }
    });

    seller.on('authenticated', () => {
        console.log('QR autenticado');
        io.emit("okSeller");
    });

    seller.on('auth_failure', () => console.log('Fallo en autenticacion'));

    seller.on('ready', async () => {
        try {
            await createSeller(seller, sellerName);
            console.log('Sesion de vendedor creada correctamente');
        } catch (e) {
            seller.destroy();
            io.emit("sellerError", e);
        }
    });

    seller.on('disconnected', () => {
        console.log('Desconectado, se borrara la sesion');
        seller.destroy();
        // seller.initialize();
        io.emit("sellerDisconnected", sellerName);
    });

    seller.on('message_create', async (msg) => {
        try {
            let sellerInfo = seller.info;
            let sellerNum = sellerInfo.wid.user;

            let chat = await msg.getChat();
            await addChat(chat, sellerNum);

            let whatsappNumber;
            let body = msg.body;
            let to = msg.to;
            let from = msg.from;
            let date1 = msg.timestamp;
            let date = date1 * 1000;
            let fromSeller = msg.fromMe;
            let whatsappMsgID = msg.id.id; // ?

            if (from === 'status@broadcast' || to === 'status@broadcast') {
                console.log('Estado de Whatsapp');
                return;
            }

            if (fromSeller) {
                whatsappNumber = msg.to;
            } else {
                whatsappNumber = msg.from;
            };

            let clientID = whatsappNumber + '_' + sellerNum; // ?
            let messageID = whatsappMsgID + ' by ' + clientID; // ?

            let message = await models.Mensaje.create({   // ? let message 
                body: body,
                to: to,
                from: from,
                date: date,
                fromMe: fromSeller,
                id: messageID,
                clienteId: clientID
            });

            io.emit("newMessage", msg)

        } catch (e) {
            console.log(e)
        }
    });
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const authorizeSeller = async (sellerSession) => {
    const worker = `${__dirname}/sessions/session-${sellerSession}/Default/Service Worker`;

    if (fs.existsSync(worker)) {
        fs.rmdirSync(worker, { recursive: true });
    }

    try {
        const existentSeller = newSession(sellerSession);
        generateSession(existentSeller, sellerSession, 'EXISTENTE');

    } catch (e) {
        console.log(e);
    }
}


const getSellersNames = async () => {
    const sellersList = await models.Vendedor.findAll({});
    const sellers = sellersList.map(seller => seller.dataValues.name);
    return sellers
}