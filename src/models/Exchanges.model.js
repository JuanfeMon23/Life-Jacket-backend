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
    exchangeFinalPrice: {
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
    exchangeIncrementPrice: {
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
    exchangePaymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
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
    exchangeStatus: {
        type: DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue: true
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
  
  
Exchange.belongsToMany(Vehicle, {through : 'ExchangeDetails', foreignKey: 'idExchangeDetail', as: 'vehiclesExchange'});
Vehicle.belongsToMany(Exchange, {through : 'ExchangeDetails', foreignKey: 'idVehicleDetail' });