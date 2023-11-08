import { Router } from "express";
import { Login , Logout } from "../controllers/Users.controller.js";
import { requiredToken } from "../middlewares/validatingToken.js";
import { verifyToken } from "../controllers/Users.controller.js";

export const LoginRouter = Router();

LoginRouter.post('/Login', Login);
LoginRouter.post('/Logout', requiredToken,  Logout);
LoginRouter.get('/Verify' ,  verifyToken);