
import express from 'express';
import { VehiclesRoutes } from './routes/Vehicles.routes.js';
import { OtherRoutes } from './routes/Othervehicleinformations.routes.js';
import { ClientRoutes } from './routes/Clients.routes.js';
import { SaleRoutes } from './routes/Sales.routes.js';
const app = express();

app.use(express.json());

app.use('/modulo', VehiclesRoutes);
app.use('/modulo', OtherRoutes);
app.use('/api', ClientRoutes);
app.use('/api', SaleRoutes);

export default app;

