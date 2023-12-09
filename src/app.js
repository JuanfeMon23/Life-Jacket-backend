
import express from 'express';
import cookieParser from 'cookie-parser';
import {UserRoutes} from './routes/Users.routes.js'
import {LoginRouter } from './routes/Login.routes.js';
import {RolRoutes } from './routes/Roles.routes.js';
import {LicenseRoutes } from './routes/Licenses.routes.js';
import { VehiclesRoutes } from './routes/Vehicles.routes.js';
import { ExchangeRoutes } from './routes/Exchanges.routes.js';
import { ClientRoutes } from './routes/Clients.routes.js';
import { ImprovementsRoutes } from './routes/Improvements.routes.js';
import { SaleRoutes } from './routes/Sales.routes.js';
import { PurchaseRoutes } from './routes/Purchases.routes.js';
import { BrandRoutes } from './routes/Brand.routes.js';
import { DashboardRoutes } from './routes/Dashboard.routes.js';
import { DepartmentsRoutes } from './routes/Departments.routes.js';
import cors from 'cors';
import dotenv from 'dotenv'


dotenv.config();
const FRONTEND = process.env.FRONTEND;
export const JWT_SECRET = process.env.JWT_SECRET
export const EMAIL = process.env.EMAIL
export const PASSWORD = process.env.PASSWORD
export const EMAIL_PORT = process.env.EMAIL_PORT


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : true,
    credentials : true
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
app.use('/api', ImprovementsRoutes);
app.use('/api', BrandRoutes);
app.use('/api', DashboardRoutes);
app.use('/api', DepartmentsRoutes);


export default app;

