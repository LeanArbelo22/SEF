// const { Field } = require('pg-protocol/dist/messages');
const {Model, DataTypes, Sequelize}= require('sequelize');


const VENDEDOR_TABLE = 'vendedores';

const  VendedorSchema = {
    id:{
        allowNull: false,
        
        type: DataTypes.STRING
    },
    name:{
        allowNull: true,
        type: DataTypes.STRING
    },
    number:{
        allowNull: true,
        type: DataTypes.STRING,
        primaryKey: true
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
    }
    
    
}

class Vendedor extends Model {
    static associate(models){
        this.hasMany(models.Cliente, {
            as: 'clientes',
            foreignKey:'vendedorNumber',
           
        });
    }

    static config(sequelize){
        return{
            sequelize,
            tableName: VENDEDOR_TABLE,
            modelName: 'Vendedor',
            timestamp: false
        }
    }

}


module.exports ={VENDEDOR_TABLE , VendedorSchema, Vendedor }