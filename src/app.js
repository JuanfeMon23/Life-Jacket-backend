import express from 'express';
import { ImprovementsRoute } from './routes/Improvements.routes.js';

const app = express();

app.use(express.json());

app.use('/modulo', ImprovementsRoute);


export default app;