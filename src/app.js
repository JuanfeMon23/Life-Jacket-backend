import express from 'express';
import cookieParser from 'cookie-parser';
import {UserRoutes} from './routes/Users.routes.js'
import { LoginRouter } from './routes/Login.routes.js';
import { RolRoutes } from './routes/Roles.routes.js';
import { LicenseRoutes } from './routes/Licenses.routes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));

app.use('/api',UserRoutes, LoginRouter, RolRoutes, LicenseRoutes);


export default app;