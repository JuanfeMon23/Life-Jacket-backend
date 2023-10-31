import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config.js";

export const requiredToken = (req, res, next) => {
    try {
        const {token} = req.cookies
        if (!token) {
            return res.status(401).json({message: 'Autorizacion denegada.'})
        }
    
        jwt.verify(token, JWT_SECRET, (error, user) => {
            if (error)  return res.status(401).json({message: 'Token invalido'})  
            req.user = user;
            next();
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
  
};