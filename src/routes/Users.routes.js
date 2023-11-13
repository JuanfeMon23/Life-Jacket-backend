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
export const UserRoutes = Router();

UserRoutes.get('/Users', requiredToken,  getUsers);
UserRoutes.post('/Users', requiredToken,  postUser),
UserRoutes.put('/Users/:idUser', requiredToken,  updateUser);
UserRoutes.delete('/Users/:idUser', requiredToken, deleteUser);
UserRoutes.get('/Users/:idUser', requiredToken, getUser);
UserRoutes.get('/Users/SearchE/:search', requiredToken, userSearch);
UserRoutes.patch('/UserS/:idUser', requiredToken, statusUser);

