import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';

export const License = sequelize.define('License',{
    idLicense : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    licenseName : {
        type: DataTypes.STRING,
        validate : {
            notEmpty: true
        }
    }
});

