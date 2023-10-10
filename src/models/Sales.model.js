import { DataTypes } from "sequelize";
import  { sequelize } from "../database/database.js";
import { Client } from "../models/Clients.model.js";

export const Sale = sequelize.define('sales', {
    idSale: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    saleDate: {
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
    saleFinalPrice: {
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
    saleLimitations: {
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
    saleDepartment: {
      type: DataTypes.STRING(80),
      allowNull : false,
      validate: {
          notNull: {
            msg: 'Este campo es obligatorio',
          }
      }   
    },
    saleMunicipality: {
        type: DataTypes.STRING(80),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            }
        }
    },
    salePecuniaryPenalty: {
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
    saleStatus: {
        type: DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue: true
    },
    idClientSale :{
      type: DataTypes.INTEGER,
        allowNull : false
    },
    idVehicleSale :{
      type: DataTypes.INTEGER,
        allowNull : false
    }
},
{
      timestamps : false
  
}
);

Client.hasMany(Sale, {
  foreignKey : 'idClientSale',
  sourceKey : 'idClient',
  allowNull : false
})

Sale.belongsTo(Client, {
  foreignKey: 'idClientSale',
  targetId: 'idClient',
  allowNull : false
})


