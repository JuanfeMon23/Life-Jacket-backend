import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { Rol } from './Rol.model.js';

export const User = sequelize.define('users', {
    idUser : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName : {
        type: DataTypes.STRING,
        validate : {
            notEmpty : true
        }
    },
    userLastName : {
        type: DataTypes.STRING,
        validate : {
            notEmpty : {msg : 'plase enter your name.'}
        } 
    },
    userEmail : {
        type: DataTypes.STRING,
        validate : {
            isEmail : true,
            notEmpty : true
        }
    },
    userPassword : {
        type: DataTypes.STRING,
        validate : {
            notEmpty : true,
            min: 8
        } 
    },
    userAddress : {
        type: DataTypes.STRING,
        validate : {
            notEmpty : true
        } 
    },
    userPhoneNumber : {
        type: DataTypes.STRING,
        validate : {
            notEmpty : true
        } 
    },
    userStatus : {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    }
})


User.hasOne(Rol,{
    foreignKey: 'idRol',
    sourceKey : 'idRol',
})
