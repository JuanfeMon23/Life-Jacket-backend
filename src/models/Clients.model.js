import { DataTypes } from "sequelize";
import  { sequelize } from "../database/database.js";

export const Client = sequelize.define('clients', {
    idClient: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    clientDocument: {
        type: DataTypes.STRING(12),
        allowNull: false,
        validate: {
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
    clientName: {
        type: DataTypes.STRING(20),
        allowNull: false,
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
    clientLastName: {
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
    clientExpeditionPlace: {
        type: DataTypes.DATE,
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            },
            isDate: {
              msg: 'La fecha debe tener un formato válido',
            }
        }   
    },
    clientAddress: {
        type: DataTypes.STRING(80),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            },
            len: {
                args: [1, 40],
                msg: 'La dirección debe tener entre 1 y 40 caracteres.',
            }
        }  
    },
    clientPhoneNumber: {
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
    clientOtherContact: {
        type: DataTypes.STRING(40),
        allowNull : true,
        validate: {
            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                  throw new Error('Este campo no puede contener números');
                }
            },    
            len: {
              args: [1, 30],
              msg: 'Este campo debe tener entre 1 y 30 letras',
            },
            noSpecialCharacters(value) {
              const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
              if (specialCharacters.test(value)) {
                throw new Error('Este campo no puede contener caracteres especiales');
              }
            }
        }
    },
    clientOtherPhoneNumber: {
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
    clientStatus: {
        type: DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue: true
    }
}); 
