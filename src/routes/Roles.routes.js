/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of roles and its different functions
 */

import { Router } from "express";
import { createRol, getRol, getRoles , updateRol, deleteRol, addLicenses } from "../controllers/Roles.controller.js";
import { requiredToken } from '../middlewares/validatingToken.js';
export const RolRoutes =  Router();

RolRoutes.get('/Roles', getRoles );
RolRoutes.get('/Roles/:idRol', requiredToken, getRol)
RolRoutes.post('/Roles', createRol);
RolRoutes.put('/Roles/:idRol' , requiredToken, updateRol);
RolRoutes.delete('/Roles/:idRol', requiredToken, deleteRol);
RolRoutes.post('/Roles/:idRol/Licenses/:idLicense', addLicenses);