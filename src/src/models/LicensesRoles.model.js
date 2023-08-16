import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';

export const LicensesRol = sequelize.define('LicenseRol',{
    idLicenseRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

