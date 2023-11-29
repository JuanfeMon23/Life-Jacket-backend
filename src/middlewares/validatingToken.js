import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../app.js';


export const requiredToken = (req, res, next) => {
  const {token} = req.cookies;

  if(!token) return res.status(401).json({message: 'Autorizacion denegada'});

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if(err) return res.status(403).json({message: 'token invalido.'});

      req.User = user

      next()
  })
 };

