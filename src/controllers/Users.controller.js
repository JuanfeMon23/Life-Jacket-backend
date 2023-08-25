import { User } from "../models/Users.model.js";
import app from "../app.js";
import bcrypts from 'bcryptjs';
import { Op } from "sequelize";

export const getUsers = async  (req,res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const postUser = async  (req,res) => {
    const {userName, userLastName, userEmail, userPassword, userAddress, userPhoneNumber, userOtherPhoneNumber,idUserRol} = req.body
    
    try {
        const userPasswordHash = await bcrypts.hash(userPassword, 10);
        const newUser = await User.create({
            userName,
            userLastName,
            userEmail,
            userPassword : userPasswordHash,
            userAddress,
            userPhoneNumber,
            userOtherPhoneNumber , 
            idUserRol
        });
        return res.status(200).json(newUser);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : error.message});
    }
};

export const updateUser = async (req,res) => {
    const {idUser} = req.params;
    const {userName, userLastName, userEmail, userPassword, userAddress, userPhoneNumber, userOtherPhoneNumber,idUserRol } = req.body
    try {
        const user = await User.findByPk(idUser)
        user.userName = userName;
        user.userLastName = userLastName;
        user.userEmail = userEmail;
        user.userPassword = userPassword;
        user.userAddress = userAddress;
        user.userPhoneNumber = userPhoneNumber;
        user.userOtherPhoneNumber = userOtherPhoneNumber;
        user.idUserRol = idUserRol;
        await user.save();
        res.json(user);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const deleteUser = async (req,res) => {
    const {idUser} = req.params;
    try {
        await User.destroy({
            where :{idUser}       
        });
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const getUser = async (req,res) => {
    try {
        const {idUser} = req.params;
        const user = await User.findOne({
            where :{idUser}
        });
         res.json(user);
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

export const userSearch = async (req,res) => {
    const search = req.params;
    try {
        const user = await User.findAll({
            where : {
                [Op.Op] : [
                    {idUser : { [Op.like] : `%${search}%`}},
                    {userName : { [Op.like] : `%${search}%`}},
                    {userEmail : { [Op.like] : `%${search}%`}},
                ],
            }
        });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};