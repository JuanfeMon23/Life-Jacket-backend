/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains model of purchase and its different fields with validations
 */

import { DataTypes } from "sequelize";
import  { sequelize } from "../database/database.js";
import { Client } from "../models/Clients.model.js";

export const Purchase = sequelize.define('purchases', {
    idPurchase: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    purchaseDate: {
        type: DataTypes.DATEONLY,
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
    purchaseFinalPrice: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            },
            isNumeric: {
              msg: 'Este campo debe contener solo números',
            },
            len: {
              msg: 'Este campo debe tener entre 5 y 11 números',
            },
            customValidation(value) {
              const integerValue = parseInt(value, 10); // Convierte el valor en un entero
              if (isNaN(integerValue) || integerValue.toString() !== value.toString() || integerValue.toString().startsWith('0')) {
                  throw new Error('Este campo debe ser un número entero que no comience en 0');
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
    purchaseLimitations: {
        type: DataTypes.STRING(200),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            },  
            len: {
              args: [1, 200],
              msg: 'Este campo debe tener entre 1 y 200 letras',
            }
        }
    },
    purchaseDepartment: {
      type: DataTypes.STRING(80),
      allowNull : false,
      validate: {
          notNull: {
            msg: 'Este campo es obligatorio',
          }
      }   
    },
    purchaseMunicipality: {
        type: DataTypes.STRING(80),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            }
        }
    },
    purchasePecuniaryPenalty: {
        type: DataTypes.INTEGER(11),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            },
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            } 
        }  
    },
    purchaseStatus: {
      type: DataTypes.STRING(10),
      allowNull : false,
      defaultValue: "true"
    },
    idClientPurchase: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    idVehiclePurchase: {
      type: DataTypes.INTEGER,
      allowNull : false
    } 
},
{
  timestamps : false
  
}
); 

Client.hasMany(Purchase, {
  foreignKey : 'idClientPurchase',
  sourceKey : 'idClient',
  allowNull : false
})

Purchase.belongsTo(Client, {
  foreignKey: 'idClientPurchase',
  targetId: 'idClient'
})



