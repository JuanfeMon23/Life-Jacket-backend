import {Router} from 'express';
import {getClients, postClient, updateClient, statusClient, searchClient} from '../controllers/Clients.controller.js';

export const ClientRoutes = Router();

ClientRoutes.get('/Clients', getClients);

ClientRoutes.post('/Clients', postClient);

ClientRoutes.put('/Clients/:idClient', updateClient);

ClientRoutes.patch('/Clients/:idClient', statusClient);

ClientRoutes.get('/Clients/SearchE/:search', searchClient);