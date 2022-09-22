// const { Field } = require('pg-protocol/dist/messages');
const {Model, DataTypes, Sequelize}= require('sequelize');
const {VENDEDOR_TABLE}= require('./vendedor.model');

const CLIENTE_TABLE = 'clientes';

const  ClienteSchema = {
    id:{
        allowNull: true,
       
        primaryKey: true,
        type: DataTypes.STRING
    },
    name:{
        allowNull: false,
        type: DataTypes.STRING
    },
    number:{
        
        allowNull: true,
        type: DataTypes.STRING,
        // como queremos nombralo en la base de datos
        
    },
    createdAt:{
        allowNull:false,
        type:DataTypes.DATE,
        field:'create_at',
        defaultValue:Sequelize.NOW
    },
    updatedAt:{
        allowNull:false,
        type:DataTypes.DATE,
        field:'update_at',
        defaultValue:Sequelize.NOW
    },
    vendedorNumber: {
        field: 'vendedor_number',
        allowNull: false,
        type: DataTypes.STRING,
      
        references: {
          model: VENDEDOR_TABLE,
          key: 'number'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
}

class Cliente extends Model {
    static associate(models){
        this.belongsTo(models.Vendedor,
             {as: 'vendedor'});
        this.hasMany(models.Mensaje, {
                as:'mensajes',
                foreignKey:'clienteId'
            });
    }

    static config(sequelize){
        return{
            sequelize,
            tableName: CLIENTE_TABLE,
            modelName: 'Cliente',
            timestamp: false,
           
        }
    }

}


module.exports ={CLIENTE_TABLE, ClienteSchema, Cliente }