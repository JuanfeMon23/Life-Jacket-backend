import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import app from '../app.js';
import { Op , Sequelize  } from 'sequelize';
import { createAuthToken } from "../libs/jwt.js";
import { User } from "../models/Users.model.js";
import { JWT_SECRET } from '../config.js';

export const Login =  async (req,res) => {
    const { userEmail, userPassword } = req.body;

    try {
        const foundUser = await User.findOne({where : {userEmail}});
        if (!foundUser ) return res.status(400).json({ message : 'Email invalido' });

        const Match = await bcrypt.compare(userPassword,foundUser.userPassword);
        if (!Match) return res.status(400).json({ message : 'Contraseña incorrecta' });

        const token = await createAuthToken({id : foundUser.idUser});
        res.cookie('token', token);
        res.status(200).json({foundUser});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message})
    }
};

export const Logout = async (req,res) => {
    try {
        res.cookie('token', '', {
            expires : new Date(0)
        })
        return res.status(200)
    } catch (error) {
        return res.status(500)
    }
};

export const verifyToken = async (req, res) => {
    const {token} = req.cookies;
    const {idUser} = req.cookies;
    if (!token) return res.status(401).json({message : "No autorizado"});

    try {
        jwt.verify(token, JWT_SECRET, async (error, user) => {
            if(error) throw error;
      
            const userFound = await User.findByPk(user.idUser);
            if(!userFound) return res.status(401).json({message : "No autorizado!!!"});
      
            return res.json({
                idUser: userFound.idUser,
                userName : userFound. userName,
                email : userFound.userEmail
            })
        })
      } catch (error) {
        return res.status(401).json({message : "No autorizado__"});
      }
};