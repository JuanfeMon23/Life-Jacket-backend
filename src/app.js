
import express from 'express';
import cookieParser from 'cookie-parser';
import {UserRoutes} from './routes/Users.routes.js'
import {LoginRouter } from './routes/Login.routes.js';
import {RolRoutes } from './routes/Roles.routes.js';
import {LicenseRoutes } from './routes/Licenses.routes.js';
import { VehiclesRoutes } from './routes/Vehicles.routes.js'
import { OtherRoutes } from './routes/Othervehicleinformations.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));

app.use('/modulo', VehiclesRoutes);
app.use('/modulo', OtherRoutes);


export default app;

