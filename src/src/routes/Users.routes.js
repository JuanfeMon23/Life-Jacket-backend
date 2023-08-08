import {Router} from 'express';
import { getUsers , postUser, updateUser, deleteUser,getUser } from '../controllers/Users.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';
export const UserRoutes = Router();

UserRoutes.get('/Users', requiredToken ,getUsers);
UserRoutes.post('/Users', requiredToken , postUser),
UserRoutes.put('/Users/:idUser', requiredToken,  updateUser);
UserRoutes.delete('/Users/:idUser', requiredToken,  deleteUser);
UserRoutes.get('/Users/:idUser', requiredToken, getUser);

