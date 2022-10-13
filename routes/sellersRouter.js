const express = require('express');
const { models } = require('./../libs/sequelize');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vendedores = await models.Vendedor.findAll();
    res.status(200).json(vendedores);
  } catch (e) {
    console.log(e);
  }
})

router.get('/:sellerNum/clientes', async (req, res) => {
  try {
    const { sellerNum } = req.params;
    const clientes = await models.Cliente.findAll({
      where: { vendedorNumber: sellerNum }
    });
    res.status(200).json(clientes);
  } catch (e) {
    console.log(e);
  }
})

router.get('/:clientNum/mensajes', async (req, res) => {
  try {
    const { clientNum } = req.params;
    const mensajes = await models.Mensaje.findAll({
      where: { clienteId: clientNum },
      order: [['date', 'ASC']]
    });
    res.status(200).json(mensajes);
  } catch (e) {
    console.log(e);
  }
})

module.exports = router;