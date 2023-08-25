import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { Roles } from './Roles.model.js';

export const User = sequelize.define('Users', {
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
    userOtherPhoneNumber : {
        type: DataTypes.STRING,
        validate : {
            notEmpty : true
        } 
    },
        idRolUser : {
            type: DataTypes.INTEGER,
            references: {
                model: Roles,
                key: 'idRol'
            }
        }
    ,
    userStatus : {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    }
});

Roles.hasMany(User, {
    foreignKey : 'idRolUser',
     sourceKey: 'idRol'
});


User.belongsTo(Roles, {
    foreignKey : 'idRolUser',
    targetKey : 'idRol'
});