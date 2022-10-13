const { models } = require('./../../libs/sequelize');

async function createClient(client) {
    const clientInfo = await client.info;
    const vendedorNumber = await clientInfo.wid._serialized;

    let chats = await client.getChats();

    for (let i in chats) {
        let number = await chats[i].id._serialized;
        let name = await chats[i].name;
        let data = { number, name, vendedorNumber };

        await models.Cliente.create(data);
    }
}


async function updateCLients(client) {
    let clientInfo = await client.info;

    let vendedorNumber = await clientInfo.wid.user;

    let chats = await client.getChats();
    for (let i in chats) {
        let numberC = await chats[i].id._serialized;
        let numberNew = await chats[i].id.user;
        let nameNew = await chats[i].name;

        let cID = await numberC + '_' + vendedorNumber;
        let [Cliente, created] = await models.Cliente.findOrCreate({
            where: { id: cID },
            defaults: {
                id: cID,
                number: numberNew,
                name: nameNew,
                vendedorNumber: vendedorNumber
            }
        });

        if (created == true) {
            console.log(numberNew + 'cliente creado')
        }
    }
}





module.exports = { createClient, updateCLients }