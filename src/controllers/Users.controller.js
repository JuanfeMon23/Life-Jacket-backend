import { User } from "../models/Users.model.js";
import { Roles } from "../models/Roles.model.js";
import app from "../app.js";
import bcrypts from 'bcryptjs';
import { Op } from "sequelize";


export const getUsers = async  (req,res) => {
    try {
        const users = await User.findAll({ include: Roles });
        return res.status(200).json(users);
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

        const roles = await Roles.findOne({
            where : {idRol : user.idRolUser}
        });

        const object = {user,
            Roles : roles.rolName
        }

         res.json(object);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const postUser = async  (req,res) => {
    const {userDocumentType, userDocumentNumber, userDepartment,  userMunicipality, userName, userLastName, userEmail, userPassword, userAddress, userPhoneNumber, userOtherPhoneNumber,idRolUser} = req.body
    
    try {
        const userPasswordHash = await bcrypts.hash(userPassword, 10);
        const newUser = await User.create({
            userDocumentType,   
            userDocumentNumber, 
            userDepartment,
            userMunicipality,
            userName,
            userLastName,
            userEmail,
            userPassword : userPasswordHash,
            userAddress,
            userPhoneNumber,
            userOtherPhoneNumber, 
            idRolUser
        });
        return res.status(200).json(newUser);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : error.message});
    }
};

export const updateUser = async (req,res) => {
    const {idUser} = req.params;
    try {
        const {userDocumentType, userDocumentNumber, userDepartment,  userMunicipality,  userName, userLastName, userEmail, userPassword, userAddress, userPhoneNumber, userOtherPhoneNumber, idRolUser } = req.body

        const user = await User.findByPk(idUser)

        if(user.userStatus === false){
            return res.status(400).json({ message : 'No puedes editar un usuario deshabilitado'});
        }

        user.userDocumentType = userDocumentType;
        user.userDocumentNumber = userDocumentNumber;
        user.userDepartment = userDepartment;
        user.userMunicipality = userMunicipality;
        user.userName = userName;
        user.userLastName = userLastName;
        user.userEmail = userEmail;
        user.userPassword = userPassword;
        user.userAddress = userAddress;
        user.userPhoneNumber = userPhoneNumber;
        user.userOtherPhoneNumber = userOtherPhoneNumber;
        user.idRolUser = idRolUser;

        await user.save();
        res.json(user);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const statusUser = async (req, res) => {
    const { idUser } = req.params;
    try {
        const user = await User.findByPk(idUser)

        user.userStatus = !user.userStatus;

        await user.save();
        res.json(user);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const deleteUser = async (req,res) => {
    const {idUser} = req.params;
    try {
        const user = await User.findByPk(idUser)

        await user.destroy();

        return res.sendStatus(204);
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
