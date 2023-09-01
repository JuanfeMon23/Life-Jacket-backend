import {Router} from 'express';
import { getUsers , postUser, updateUser, deleteUser,getUser, userSearch } from '../controllers/Users.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';
export const UserRoutes = Router();

UserRoutes.get('/Users', getUsers);
UserRoutes.post('/Users',   postUser),
UserRoutes.put('/Users/:idUser',  updateUser);
UserRoutes.delete('/Users/:idUser',   deleteUser);
UserRoutes.get('/Users/:idUser',  getUser);
UserRoutes.get('/Users/SearchE/:search', userSearch);

