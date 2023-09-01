import express from 'express'
import { ClientRoutes } from './routes/Clients.routes.js';

const app = express();

app.use(express.json());

app.use('/api', ClientRoutes);

export default app;