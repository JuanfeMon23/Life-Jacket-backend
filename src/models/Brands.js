import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";



export const Brands = sequelize.define('Brand', {

    idBrand : {
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    VehicleType : {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio'
            }
        }
    },
    NameBrand : {
        type : DataTypes.STRING(60),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio'
            },
        }
    },
    BrandLine  : {
        type : DataTypes.STRING(60),
        allowNull : false,
        validate : {
            notNull : {
                msg : 'Campo obligatorio.'
            }
        }
        },
    
}, {
    timestamps: false
})










