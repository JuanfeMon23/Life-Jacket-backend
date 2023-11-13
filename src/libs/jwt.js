import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../app.js';


export function createAccesToken(payload){
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            JWT_SECRET ,
        {
            expiresIn : 3600,
        }, (err, token)  => {
            if (err) reject(err);
            resolve(token);
        })
    })
};