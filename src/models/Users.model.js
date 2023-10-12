import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { Roles } from './Roles.model.js';

export const User = sequelize.define('Users', {
    idUser : {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    userTypeDocument: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio',
            }
        }
    },
    userDocument: {
        type: DataTypes.INTEGER(12),
        allowNull: false,
        unique: true,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio',
            },
            isNumeric: {
                msg: 'Este campo debe contener solo números',
            },
            len: {
                args: [6, 12],
                msg: 'Este campo debe tener entre 6 y 12 números',
            },
            customValidation(value) {
                if (value.startsWith('0')) {
                  throw new Error('Este campo no puede empezar en 0');
                }
            },
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }
        }
    },
    userDepartment: {
        type: DataTypes.STRING(80),
        allowNull : false,
        validate: {
            notNull: {
                msg: 'Este campo es obligatorio',
            }
        }   
    },
    userMunicipality: {
        type: DataTypes.STRING(80),
        allowNull : false,
        validate: {
            notNull: {
                msg: 'Este campo es obligatorio',
            }
        }
    },
    userName : {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio',
            },
            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                    throw new Error('Este campo no puede contener números');
                }
            },    
            len: {
                args: [1, 20],
                msg: 'Este campo debe tener entre 1 y 20 letras',
            },
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }
        }
    },
    userLastName: {
        type: DataTypes.STRING(20),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            },
            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                  throw new Error('Este campo no puede contener números');
                }
            },    
            len: {
              args: [1, 20],
              msg: 'Este campo debe tener entre 1 y 20 letras',
            },
            noSpecialCharacters(value) {
              const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
              if (specialCharacters.test(value)) {
                throw new Error('Este campo no puede contener caracteres especiales');
              }
            }
        }
    },
    userEmail : {
        type: DataTypes.STRING(50),
        allowNull : false,
        validate : {
            isEmail : true,
            notNull: {
                msg: 'Este campo es obligatorio',
            }
        }
    },
    userPassword : {
        type: DataTypes.STRING,
        allowNull : false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio',
            },
            len: {
                args: [8, 40],
                msg: 'La contraseña debe tener entre 8 y 40 caracteres',
            }
        } 
    },
    userAddress : {
        type: DataTypes.STRING(80),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            },
            len: {
                args: [1, 80],
                msg: 'La dirección debe tener entre 1 y 80 caracteres',
            }
        }  
    },
    userPhoneNumber : {
        type: DataTypes.STRING(15),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            },
            len: {
                args: [7, 12],
                msg: 'Este campo debe tener entre 7 y 12 numeros',
              },
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }    
        }  
    },
    userOtherPhoneNumber : {
        type: DataTypes.STRING(15),
        allowNull : true,
        validate: {
            len: {
                args: [7, 12],
                msg: 'Este campo debe tener entre 7 y 12 numeros',
              },
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }    
        }  
    },
    userStatus : {
        type: DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue : true
    },
    idRolUser: {
        type: DataTypes.INTEGER,
        allowNull : false
    }
},
{
    timestamps : false

});

Roles.hasMany(User, {
    foreignKey : 'idRolUser',
     sourceKey: 'idRol',
     allowNull : false
});


User.belongsTo(Roles, {
    foreignKey : 'idRolUser',
    targetKey : 'idRol'
});