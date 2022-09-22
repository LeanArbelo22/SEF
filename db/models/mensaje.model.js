
const {Model, DataTypes, Sequelize}= require('sequelize');
const {CLIENTE_TABLE}= require('./cliente.model')

const MENSAJE_TABLE = 'mensajes';

const  MensajeSchema = {
    id:{
        allowNull: true,
        
        primaryKey: true,
        type: DataTypes.STRING
    },
    body:{
        allowNull: true,
        type: DataTypes.TEXT
    },
    fromMe:{
        allowNull: true,
        type: DataTypes.BOOLEAN
         
    },
    to:{
        allowNull: true,
        type: DataTypes.STRING,
        // como queremos nombralo en la base de datos
        field: 'to' 
    },
    from:{
        allowNull: true,
        type: DataTypes.STRING,
        // como queremos nombralo en la base de datos
        field: 'from' 
    },

    
    date:{
        allowNull: true,
        type: DataTypes.DATE   ,
        // como queremos nombralo en la base de datos
       
    },
    updatedAt:{
        allowNull:false,
        type:DataTypes.DATE,
        field:'update_at',
        defaultValue:Sequelize.NOW
    },
    createdAt:{
        allowNull:false,
        type:DataTypes.DATE,
        field:'create_at',
        defaultValue:Sequelize.NOW
    },
    clienteId: {
       
        allowNull: false,
        type: DataTypes.STRING,
      
        references: {
          model: CLIENTE_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
}

class Mensaje extends Model {
    static associate(models){
        this.belongsTo(models.Cliente,
            {as: 'cliente'});
        
    }

    static config(sequelize){
        return{
            sequelize,
            tableName: MENSAJE_TABLE,
            modelName: 'Mensaje',
            timestamp: false
        }
    }

}


module.exports ={MENSAJE_TABLE, MensajeSchema, Mensaje }