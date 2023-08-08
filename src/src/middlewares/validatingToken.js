import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config.js";

export const requiredToken = (req, res, next) => {

    const {token} = req.cookies
    if (!token) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error)  return res.status(401).json({message: 'invalid token'})  
        req.user = user
    
        next();
    })
    
};