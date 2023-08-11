import app from "./app.js";
import {sequelize} from "./database/database.js";
import "./models/Clients.model.js";



const connection = async (req, res) => {
    try {
        await sequelize.sync();
        app.listen(3000);
        console.log("Server running on port 3000");
    } catch (error) {
        console.log("error");
    }
}
 
connection();