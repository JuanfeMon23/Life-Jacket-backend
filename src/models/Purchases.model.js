import { DataTypes } from "sequelize";
import  { sequelize } from "../database/database.js";
import { Client } from "../models/Clients.model.js";
import { Vehicle } from "../models/Vehicles.model.js"

export const Purchase = sequelize.define('purchases', {
    idPurchase: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    purchaseDate: {
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
    purchasePrice: {
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
              args: [6, 12],
              msg: 'Este campo debe tener entre 5 y 11 números',
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
    purchasePaymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
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
    purchaseCity: {
        type: DataTypes.STRING(20),
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
            len: {
                args: [7, 12],
                msg: 'Este campo debe tener entre 5 y 11 numeros',
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
        type: DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue: true
    }
}); 

Client.hasMany(Purchase, {
  foreignKey : 'idClientPurchase',
  sourceKey : 'idClient'
})

Purchase.belongsTo(Client, {
  foreignKey: 'idClientPurchase',
  targetId: 'idClient'
})


Purchase.hasOne(Vehicle, {
  foreignKey : 'idVehiclePurchase',
  sourceKey : 'idPurchase'
})

Vehicle.belongsTo(Purchase, {
  foreignKey : 'idVehiclePurchase',
  targetId : 'idPurchase'
})

