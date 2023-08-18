import app from './app.js'
import { sequelize } from './database/database.js';
import './models/Users.model.js'
import './models/Roles.model.js'


const connection = async (req,res) => {
    try {
        await sequelize.sync();
        app.listen(3000);
        console.log('Server is running on port 3000');
    } catch (error) {
        res.send(error.message)
    }
}

connection();