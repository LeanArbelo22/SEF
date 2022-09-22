const express = require('express');
const { Module } = require('module');
const {models} = require('./../libs/sequelize');

const router = express.Router();



router.get('/', async (req,res) =>{
    const vendedores = await models.Vendedor.findAll();

    res.json(
    vendedores
    )
//   )
  })
  
  
  
  
  router.get('/:numberS/clientes', async (req,res) =>{
    const {numberS} = req.params;
    const clientes = await models.Cliente.findAll({
      where: {
        vendedorNumber: numberS
      }
    });
    res.json(clientes)
    })
  
  
  
    router.get('/:numberC/mensajes', async (req,res) =>{
      const {numberC} = req.params;
      const mensajes = await models.Mensaje.findAll({
        where: {
          clienteId: numberC
        },
        order: [
          ['date', 'ASC']
      ]
      });
      res.json(mensajes)
      })
        
module.exports = router;