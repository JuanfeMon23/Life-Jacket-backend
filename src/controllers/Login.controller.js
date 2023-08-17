import bcrypt from 'bcryptjs';
import { createAuthToken } from "../libs/jwt.js";
import { User } from "../models/Users.model.js";

export const Login =  async (req,res) => {
    const { userEmail, userPassword } = req.body;
    try {
        const foundUser = await User.findOne({where : {userEmail}});
        if (!foundUser ) return res.status(400).json({ message : 'User not found' });

        const Match = await bcrypt.compare(userPassword,foundUser.userPassword);
        if (!Match) return res.status(400).json({ message : 'Invalid password' });

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
        return res.sendStatus(200)
    } catch (error) {
        return res.status(500)
    }
};