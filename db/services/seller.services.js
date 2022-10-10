const { now } = require('moment');
const { models } = require('./../../libs/sequelize');



async function createSeller(client, myCustomId) {
  let clientInfo = await client.info;
  let numberNew = await clientInfo.wid.user;
  let nameNew = myCustomId;

  let vID = await nameNew + '_' + numberNew;
  let [Vendedor, created] = await models.Vendedor.findOrCreate({
    where: { number: numberNew },
    defaults: {
      id: vID,
      number: numberNew,
      name: nameNew

    }
  });
  if (created == true) {
    console.log(numberNew + 'vendedor creado')
  }
  return;
}





async function updateSeller(client, myCustomId) {


}
module.exports = { createSeller }