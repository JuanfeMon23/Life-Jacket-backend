import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../app.js';


export async function createAuthToken(payload){
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET,  { expiresIn: '1d' , algorithm : "HS256"}, (error, token) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolve(token);
            }
        });
    });
};