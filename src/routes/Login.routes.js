import { Router } from "express";
import { Login , Logout } from "../controllers/Login.controller.js";

export const LoginRouter = Router();

LoginRouter.post('/Login', Login);
LoginRouter.post('/Logout', Logout);