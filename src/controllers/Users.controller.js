/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application purchases which are: 
 * create, view, edit, disable, delete and search. Uses Express.js and Sequelize to interact with the database
 */

import { User } from "../models/Users.model.js";
import { Roles } from "../models/Roles.model.js";
import app from "../app.js";
import bcrypts from 'bcryptjs';
import { Op } from "sequelize";
import  jwt  from "jsonwebtoken";
import { createAuthToken } from "../libs/jwt.js";
import { JWT_SECRET } from "../app.js";


//Function to get the list of users
export const getUsers = async  (req,res) => {
    try {
        const users = await User.findAll({ include: Roles });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to get a user by their ID
export const getUser = async (req,res) => {
    try {
        const {idUser} = req.params;

        //Query the database to obtain a client by its ID
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

//Function add a new user in the database
export const postUser = async  (req,res) => {
    const {userTypeDocument, userDocument, userDepartment,  userMunicipality, userName, userLastName, userEmail, userPassword, userAddress, userPhoneNumber, userOtherPhoneNumber,idRolUser} = req.body
    
    try {
        const userPasswordHash = await bcrypts.hash(userPassword, 10);

        const foundDocument = await User.findOne({where : {userDocument}});
        if(foundDocument) return res.status(400).json({message : 'Documento ya registrado.'});

        const foundEmail = await User.findOne({where : {userEmail}});
        if (foundEmail) return res.status(400).json({message : 'Email ya registrado.'});


        //Function to create a new user
        const newUser = await User.create({
            userTypeDocument,   
            userDocument, 
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

//Feature to update an existing user's information
export const updateUser = async (req,res) => {
    const {idUser} = req.params;
    try {
        const {userTypeDocument, userDocument, userDepartment,  userMunicipality,  userName, userLastName, userEmail, userPassword, userAddress, userPhoneNumber, userOtherPhoneNumber, idRolUser } = req.body

        // Search for the user by their ID
        const user = await User.findByPk(idUser)

        if(user.userStatus === false){
            return res.status(400).json({ message : 'No puedes editar un usuario deshabilitado'});
        }

        const foundDocument = await User.findOne({where : {userDocument}});
        if(foundDocument) return res.status(400).json({message : 'Documento ya registrado.'});

        const foundEmail = await User.findOne({where : {userEmail}});
        if (foundEmail) return res.status(400).json({message : 'Email ya registrado.'});

        user.userTypeDocument = userTypeDocument;
        user.userDocument = userDocument;
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

//Function to change the status (enabled/disabled) of a user
export const statusUser = async (req, res) => {
    const { idUser } = req.params;
    try {
        const user = await User.findByPk(idUser)

        //Change of user status and saving in the database
        if(user.userStatus === 'true'){
            user.userStatus = 'false'
        } else if(user.userStatus === 'false'){
            user.userStatus = 'true'
        }

        await user.save();
        res.json(user);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to delete a user
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


//Function to search for clients based on various attributes (name and email)
export const userSearch = async (req,res) => {
    const search = req.params;
    try {
        //Perform a search in the database
        const user = await User.findAll({
            where : {
                [Op.Op] : [
                    {userName : { [Op.like] : `%${search}%`}},
                    {userEmail : { [Op.like] : `%${search}%`}}
                ],
            }
        });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.send(false);
      
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token,JWT_SECRET);
        console.log(token , decoded);
      
        if (!decoded || !decoded.idUser) return res.sendStatus(401);
 
        const userFound = await User.findOne({ where: { idUser: decoded.idUser } });
        if (!userFound) return res.sendStatus(401);
      
        return res.json({
          idUser: userFound.idUser,
          userName: userFound.userName,
          userEmail: userFound.userEmail,
        });
    } catch (error) {
        console.log(error);
    }
 };

  export const Login =  async (req,res) => {
    const { userEmail, userPassword } = req.body;

    try {
        const foundUser = await User.findOne({where : {userEmail}});
        if (!foundUser ) return res.status(400).json({ message : 'Email invalido' });

        const Match = await bcrypts.compare(userPassword,foundUser.userPassword);
        if (!Match) return res.status(400).json({ message : 'Contraseña incorrecta' });

        const token = await createAuthToken({
            idUser : foundUser.idUser,
            userEmail : foundUser.userEmail,
            userName : foundUser.userName
        });

        res.setHeader('Authorization', `key ${token}`);

        res.status(200).json({foundUser});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message})
    }
};

export const Logout = async (req,res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
      });
      return res.sendStatus(200);

};