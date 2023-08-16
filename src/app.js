import express from 'express';
import { VehiclesRoutes } from './routes/Vehicle.route.js';
import { OtherRoutes } from './routes/othervehicleinformation.route.js';

const app = express();

app.use(express.json());

app.use('/modulo', VehiclesRoutes);
app.use('/modulo', OtherRoutes);


export default app;
