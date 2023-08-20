import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { Roles } from './Roles.model.js';
import { License } from './Licenses.model.js';

export const LicensesRol = sequelize.define('LicensesRol',{
    idLicenseRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    timestamps : false
})

Roles.belongsToMany(License, {
    through: LicensesRol
})

License.belongsToMany(Roles, {
    through : LicensesRol
})