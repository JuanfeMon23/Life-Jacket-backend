/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of roles and its different functions
 */

import { Router } from "express";
import { createRol, getRol, getRoles , updateRol, deleteRol } from "../controllers/Roles.controller.js";
export const RolRoutes =  Router();

RolRoutes.get('/Roles', getRoles );
RolRoutes.get('/Roles/:idRol', getRol)
RolRoutes.post('/Roles', createRol);
RolRoutes.put('/Roles/:idRol' , updateRol);
RolRoutes.delete('/Roles/:idRol', deleteRol);