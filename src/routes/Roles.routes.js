import { Router } from "express";
import { createRol, getRol, getRoles , updateRol, deleteRol } from "../controllers/Roles.controller.js";
export const RolRoutes =  Router();

RolRoutes.get('/Roles', getRoles );
RolRoutes.get('/Roles/:idRol', getRol)
RolRoutes.post('/Roles', createRol);
RolRoutes.put('/Roles/:idRol' , updateRol);
RolRoutes.delete('/Roles/:idRol', deleteRol);