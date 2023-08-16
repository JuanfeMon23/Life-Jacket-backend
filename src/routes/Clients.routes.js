import {Router} from 'express';
import {getClients, getClient, postClient, updateClient, statusClient, searchClient} from '../controllers/Clients.controller.js';

export const ClientRoutes = Router();

ClientRoutes.get('/Clients', getClients);

ClientRoutes.get('/Clients/:idClient', getClient);

ClientRoutes.post('/Clients', postClient);

ClientRoutes.put('/Clients/:idClient', updateClient);

ClientRoutes.patch('/Clients/:idClient', statusClient);

ClientRoutes.get('/Clients/SearchE/:search', searchClient);