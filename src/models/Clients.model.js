/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains model of client and its different fields with validations
 */

import { DataTypes } from "sequelize";
import  { sequelize } from "../database/database.js";
import { Op } from 'sequelize';

export const Client = sequelize.define('clients', {
    idClient: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    clientTypeDocument: {
      type: DataTypes.STRING(20),
      allowNull: false
    }, 
    clientDocument: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
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
    clientDepartment: {
      type: DataTypes.STRING(80),
      allowNull : false,
      validate: {
          notNull: {
            msg: 'Este campo es obligatorio',
          }
      }   
    },
    clientMunicipality: {
        type: DataTypes.STRING(80),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
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
                args: [1, 80],
                msg: 'La dirección debe tener entre 1 y 80 caracteres',
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
              msg: 'Este campo debe tener entre 1 y 40 letras',
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
  },
  {
      timestamps : false
  }
); 

//  async function insertClient(){

//   const existingClient = await Client.findOne({ idClient: 1 });
//   try {

//     if(!existingClient){
//       await Client.create({
//         clientTypeDocument : "Prueba",
//         clientDocument : "1111111111",
//         clientName : "Prueba",
//         clientLastName : "Prueba",
//         clientDepartment : "Prueba",
//         clientMunicipality : "Prueba",
//         clientAddress : "Prueba",
//         clientPhoneNumber : "3333333333",
//         clientOtherContact : "Prueba",
//         clientOtherPhoneNumber : "4444444444"
//       });
//     }
    
//   } catch (error) {
//     //return res.status(500).json({message : error.message});
//   }
// };

// insertClient();  