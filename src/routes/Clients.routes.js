/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of client and its different functions
 */

import {Router} from 'express';
import {getClients, postClient, updateClient, deleteClient, statusClient, searchClient} from '../controllers/Clients.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';

export const ClientRoutes = Router();

ClientRoutes.get('/Clients', requiredToken , getClients);

ClientRoutes.post('/Clients', requiredToken , postClient);

ClientRoutes.put('/Clients/:idClient', requiredToken , updateClient);

ClientRoutes.delete('/Clients/:idClient',requiredToken , deleteClient);

ClientRoutes.patch('/Clients/:idClient',requiredToken , statusClient);

ClientRoutes.get('/Clients/SearchE/:search',requiredToken , searchClient);