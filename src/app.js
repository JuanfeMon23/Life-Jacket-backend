
import express from 'express';
import cookieParser from 'cookie-parser';
import {UserRoutes} from './routes/Users.routes.js'
import {LoginRouter } from './routes/Login.routes.js';
import {RolRoutes } from './routes/Roles.routes.js';
import {LicenseRoutes } from './routes/Licenses.routes.js';
import { VehiclesRoutes } from './routes/Vehicles.routes.js';
import { OtherRoutes } from './routes/Othervehicleinformations.routes.js';
import { ExchangeRoutes } from './routes/Exchanges.routes.js';
import { ClientRoutes } from './routes/Clients.routes.js';
import { ImprovementsRoutes } from './routes/Improvements.routes.js';
import { SaleRoutes } from './routes/Sales.routes.js';
import { PurchaseRoutes } from './routes/Purchases.routes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));

app.use('/api', UserRoutes);
app.use('/api', LoginRouter);
app.use('/api', RolRoutes);
app.use('/api', LicenseRoutes);
app.use('/api', ClientRoutes);
app.use('/api', ExchangeRoutes);
app.use('/api', SaleRoutes);
app.use('/api', PurchaseRoutes);
app.use('/api', VehiclesRoutes);
app.use('/api', OtherRoutes);
app.use('/api', ImprovementsRoutes);


export default app;

