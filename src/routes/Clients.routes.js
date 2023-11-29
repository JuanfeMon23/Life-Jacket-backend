/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of client and its different functions
 */

import {Router} from 'express';
import {getClients, postClient, updateClient, deleteClient, statusClient} from '../controllers/Clients.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';
import { hasLicenses } from '../middlewares/Licenses.js';

export const ClientRoutes = Router();

ClientRoutes.get('/Clients', requiredToken , hasLicenses(['Clientes']) , getClients);

ClientRoutes.post('/Clients', requiredToken , hasLicenses(['Clientes']), postClient);

ClientRoutes.put('/Clients/:idClient', requiredToken , hasLicenses(['Clientes']),  updateClient);

ClientRoutes.delete('/Clients/:idClient',requiredToken , hasLicenses(['Clientes']),  deleteClient);

ClientRoutes.patch('/Clients/:idClient',requiredToken , hasLicenses(['Clientes']),  statusClient);

