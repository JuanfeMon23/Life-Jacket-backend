import express from 'express';
import cookieParser from 'cookie-parser';
import {UserRoutes} from './routes/Users.routes.js'
import { LoginRouter } from './routes/Login.routes.js';
import { RolRoutes } from './routes/Roles.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use('/api',UserRoutes, LoginRouter, RolRoutes);


export default app;