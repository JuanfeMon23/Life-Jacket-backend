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

UserRoutes.get('/Users', requiredToken , hasLicenses(['Usuarios']) ,  getUsers);

UserRoutes.post('/Users', requiredToken , hasLicenses(['Usuarios']) ,postUser),

UserRoutes.put('/Users/:idUser', requiredToken , hasLicenses(['Usuarios']) ,   updateUser);

UserRoutes.delete('/Users/:idUser', requiredToken , hasLicenses(['Usuarios']) ,  deleteUser);

UserRoutes.get('/Users/:idUser', requiredToken , hasLicenses(['Usuarios']) , getUser);

UserRoutes.patch('/UserS/:idUser', requiredToken , hasLicenses(['Usuarios']) ,   statusUser);

