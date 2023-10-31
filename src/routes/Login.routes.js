import { Router } from "express";
import { Login , Logout, verifyToken } from "../controllers/Login.controller.js";

export const LoginRouter = Router();

LoginRouter.post('/Login', Login);
LoginRouter.post('/Logout', Logout);
LoginRouter.get('/Verify', verifyToken);