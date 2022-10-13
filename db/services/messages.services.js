const { models } = require('./../../libs/sequelize');


async function GETMessages(client) {
    const clientInfo = await client.info;
    const vendedorNumber = await clientInfo.wid.user;

    let chats = await client.getChats();

    let m = 0;
    let c = 0;
    for (let i in chats) {
        c++;
        let chat = chats[i];
        let messages = await chat.fetchMessages({ limit: 1000 });
        for (let j in messages) {

            var clienteNumberN = '';
            let body = await messages[j].body;
            let to = await messages[j].to;
            let from = await messages[j].from;
            let date1 = await messages[j].timestamp;
            let date = await date1 * 1000;
            let fromMe = await messages[j].fromMe;
            let idv = await messages[j].id.id;

            if (fromMe == true) {
                clienteNumberN = await messages[j].to;
            }
            else {
                clienteNumberN = await messages[j].from;
            };


            let cID = await clienteNumberN + '_' + vendedorNumber;
            let idN = idv + ' by ' + cID;



            let [Cliente, created] = await models.Mensaje.findOrCreate({
                where: {
                    id: idN

                },
                defaults: {
                    body: body,
                    to: to,
                    from: from,
                    date: date,
                    fromMe: fromMe,
                    id: idN,
                    clienteId: cID
                }
            });

            m++;
            console.log(m, c)
        }

    }

}

module.exports = { GETMessages }