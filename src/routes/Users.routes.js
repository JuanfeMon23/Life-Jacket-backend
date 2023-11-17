/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of users and its different functions
 */

import {Router} from 'express';
import { getUsers , postUser, updateUser, deleteUser,getUser, userSearch, statusUser } from '../controllers/Users.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';
import { hasLicenses } from '../middlewares/Licenses.js';
export const UserRoutes = Router();

UserRoutes.get('/Users',  getUsers);
UserRoutes.post('/Users',postUser),
UserRoutes.put('/Users/:idUser',   updateUser);
UserRoutes.delete('/Users/:idUser',  deleteUser);
UserRoutes.get('/Users/:idUser', getUser);
UserRoutes.get('/Users/SearchE/:search',  userSearch);
UserRoutes.patch('/UserS/:idUser',  statusUser);

