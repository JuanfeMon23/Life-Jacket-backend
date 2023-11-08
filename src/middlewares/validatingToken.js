import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../app.js';


export const requiredToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(403).json({message : error.message});
    
    jwt.verify(token, JWT_SECRET , (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  } catch (error) {
    return res.status(400).json({message : error.message});
  }

 };

