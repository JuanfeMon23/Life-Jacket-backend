/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains model of licenses roles and its different fields with validations
 */


import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { Roles } from './Roles.model.js';
import { License } from './Licenses.model.js';

export const LicensesRols = sequelize.define('LicensesRols',{
    idLicenseRol: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    idLicenseDetail: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    idRolDetail: {
        type: DataTypes.INTEGER,
        allowNull : false
    }
}, 
{
    timestamps : false
}
)

Roles.belongsToMany(License, {
    through: "LicensesRols",
    foreignKey: 'idRolDetail',
    allowNull : false
})

License.belongsToMany(Roles, {
    through : "LicensesRols",
    foreignKey: 'idLicenseDetail',
    allowNull : false
})