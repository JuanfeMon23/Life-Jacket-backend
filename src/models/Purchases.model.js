import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';

export const Purchase = sequelize.define('Purchase', {
    idPurchase : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    purchaseDate: {
        type: DataTypes.DATE,
        validate : {
            notNull :  {
                msg : 'Este campo es obligatorio'
            }
        }

    },
    purchasePrice: {
        type: DataTypes.INTEGER,
        validate : {
            notNull :  {
                msg : 'Este campo es obligatorio'
            }
        }
    },
    purchasePayMethod: {
        type: DataTypes.STRING,
        validate : {
            notNull :  {
                msg : 'Este campo es obligatorio'
            }
        }
    },
    purchaseLimitations :{
        type : DataTypes.STRING,
        validate : {
            notNull :  {
                msg : 'Este campo es obligatorio'
            }
        }
    },
    purchaseCity: {
        type: DataTypes.STRING,
        validate : {
            notNull :  {
                msg : 'Este campo es obligatorio'
            }
        }
    },
    purchasePecunaryPenalty: {
        type: DataTypes.STRING,
        validate : {
            notNull :  {
                msg : 'Este campo es obligatorio'
            }
        }
    },
    purchaeStatus: {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
})