'use strict';
const{CLIENTE_TABLE, ClienteSchema} = require('./../models/cliente.model');
const{VENDEDOR_TABLE, VendedorSchema} = require('./../models/vendedor.model');
const{MENSAJE_TABLE, MensajeSchema} = require('./../models/mensaje.model');




module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(VENDEDOR_TABLE, VendedorSchema);
    await queryInterface.createTable(CLIENTE_TABLE, ClienteSchema);
    await queryInterface.createTable(MENSAJE_TABLE, MensajeSchema);
  },

  async down (queryInterface) {
    await queryInterface.drop(VENDEDOR_TABLE);
    await queryInterface.drop(CLIENTE_TABLE);
    await queryInterface.drop(MENSAJE_TABLE);
  }
};
