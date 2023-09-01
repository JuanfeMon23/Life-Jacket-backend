import express from 'express';
import { VehiclesRoutes } from './routes/Vehicles.routes.js';
import { OtherRoutes } from './routes/Othervehicleinformations.routes.js';

const app = express();

app.use(express.json());

app.use('/modulo', VehiclesRoutes);
app.use('/modulo', OtherRoutes);


export default app;
