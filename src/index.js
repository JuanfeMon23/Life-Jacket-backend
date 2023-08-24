import app from './app.js'
import { sequelize } from './database/database.js';
import './models/Roles.model.js';
import './models/Users.model.js';
import './models/Licenses.model.js'
import './models/LicensesRoles.model.js'

const connection = async (req,res) => {
    try {
        await sequelize.sync({force : true});
        app.listen(3000);
        console.log('Server is running on port 3000');
    } catch (error) {
        console.error(error);
    }
}

connection();