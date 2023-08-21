import express from 'express'
import { ClientRoutes } from './routes/Clients.routes.js';
import { SaleRoutes } from './routes/Sales.routes.js';

const app = express();

app.use(express.json());

app.use('/api', ClientRoutes);
app.use('/api', SaleRoutes);

export default app;