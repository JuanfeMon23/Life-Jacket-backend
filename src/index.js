
import app from './app.js'
import { sequelize } from './database/database.js'

import './models/Licenses.model.js'
import './models/LicensesRoles.model.js'
import './models/Roles.model.js'
import './models/Users.model.js'
import './models/Clients.model.js'
import './models/Sales.model.js'
import './models/Purchases.model.js'
import './models/Exchanges.model.js'
import './models/Vehicles.model.js'
import './models/Improvements.model.js'

const connection = async (req, res) => {
    try {
        await sequelize.sync({force : false});
        app.listen(3000);
        console.log('Server is running on port',3000);
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }

}


connection();