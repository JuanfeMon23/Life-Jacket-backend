import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { Roles } from './Roles.model.js';

export const User = sequelize.define('Users', {
    idUser : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userDocumentType: {
        type: DataTypes.STRING(25),
        validate : {
            notEmpty : true
        }
    },
    userDocumentNumber : {
        type: DataTypes.INTEGER(15),
        validate : {
            notEmpty : true
        }
    },
    userDepartment: {
        type: DataTypes.STRING(15),
        validate : {
            notEmpty : true
        }  
      },
      userMunicipality: {
          type: DataTypes.STRING,
          allowNull : false,
          validate: {
              notNull: {
                msg: 'Este campo es obligatorio',
              }
          }
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