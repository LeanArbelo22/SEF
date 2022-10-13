const { Cliente, ClienteSchema } = require('./cliente.model');
const { Vendedor, VendedorSchema } = require('./vendedor.model');
const { Mensaje, MensajeSchema } = require('./mensaje.model');


function setupModels(sequelize) {
  Vendedor.init(VendedorSchema, Vendedor.config(sequelize));
  Cliente.init(ClienteSchema, Cliente.config(sequelize));

  Mensaje.init(MensajeSchema, Mensaje.config(sequelize));


  Vendedor.associate(sequelize.models);
  Cliente.associate(sequelize.models);
  Mensaje.associate(sequelize.models);
}

module.exports = setupModels;

