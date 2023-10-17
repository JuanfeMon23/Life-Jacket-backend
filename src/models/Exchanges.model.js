import { DataTypes } from "sequelize";
import  { sequelize } from "../database/database.js";
import { Client } from "./Clients.model.js";
import { Vehicle } from "./Vehicles.model.js"

export const Exchange = sequelize.define('exchanges', {
    idExchange: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    exchangeDate: {
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
    exchangeCashPrice: {
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
              msg: 'Este campo debe tener entre 0 y 11 números',
            },
            noSpecialCharacters(value) {
              const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
              if (specialCharacters.test(value)) {
                throw new Error('Este campo no puede contener caracteres especiales');
              }
            }
        } 
    },
    exchangeLimitations: {
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
    exchangeDepartment: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {
          notNull: {
            msg: 'Este campo es obligatorio',
          }
      }   
    },
    exchangeMunicipality: {
        type: DataTypes.STRING,
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            }
        }
    },
    exchangePecuniaryPenalty: {
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
    exchangeStatus: {
        type: DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue: true
    },
    idClientExchange: {
      type: DataTypes.INTEGER,
      allowNull : false
    }
},
{
  timestamps : false
}
); 



Client.hasMany(Exchange, {
    foreignKey : 'idClientExchange',
    sourceKey : 'idClient',
    allowNull : false
})
  
Exchange.belongsTo(Client, {
    foreignKey: 'idClientExchange',
    targetId: 'idClient',
    allowNull : false
})
  
