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
import app, { EMAIL, EMAIL_PORT, PASSWORD } from "../app.js";
import bcrypts from 'bcryptjs';
import { Op } from "sequelize";
import  jwt  from "jsonwebtoken";
import { createAccesToken } from "../libs/jwt.js";
import { JWT_SECRET } from "../app.js";
import { License } from "../models/Licenses.model.js";
import nodemailer from 'nodemailer';
import { PORT } from "../index.js";


//Function to get the list of users
export const getUsers = async  (req,res) => {
    try {
        const users = await User.findAll(
            {
                include : [
                    { model : Roles , include: [
                        { model : License}
                    ]} 
                ]
            }
        );
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
        if(foundDocument) return res.status(400).json({message : 'Documento ya registrado'});

        const foundEmail = await User.findOne({where : {userEmail}});
        if (foundEmail) return res.status(400).json({message : 'Correo electrónico ya registrado'});


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
        const { userName, userLastName, userEmail, userAddress, userPhoneNumber, userOtherPhoneNumber} = req.body

        // Search for the user by their ID
        const user = await User.findByPk(idUser)

        if(user.userStatus === "false"){
            return res.status(400).json({ message : 'No puedes editar un usuario deshabilitado'});
        }

        user.userName = userName;
        user.userLastName = userLastName;
        user.userEmail = userEmail;
        user.userAddress = userAddress;
        user.userPhoneNumber = userPhoneNumber;
        user.userOtherPhoneNumber = userOtherPhoneNumber;

        await user.save();
        res.json(user);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const statusUser = async (req, res) => {
    const { idUser } = req.params;
    try {
        const user = await User.findByPk(idUser, {
            include: {
                model: Roles
            }
        });

        const adminUsers = await User.count({
            where: {
                '$Role.rolName$': 'Administrador',
                userStatus: 'true'
            },
            include: [{
                model: Roles
            }]
        });
        
        const userRequest = req.User.userEmail 
        if(user.userEmail === userRequest) return res.status(400).json({message : 'No puedes cambiar tu propio estado'});

        if (user.Role.rolName === "Administrador" && user.userStatus === "true" && adminUsers <= 1) {
            return res.status(400).json({ message: "No se puede deshabilitar el único administrador activo" });
        }

        user.userStatus = user.userStatus === 'true' ? 'false' : 'true';





        await user.save();
        
        
        return res.sendStatus(204);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { idUser } = req.params;
    try {
        const user = await User.findByPk(idUser);

        await user.destroy();

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

export const Login =  async (req,res) => {
    const { userEmail, userPassword } = req.body;

    try {
        const foundUser = await User.findOne({where : {userEmail}});
        if (!foundUser ) return res.status(400).json({ message : 'Correo inválido' });

        const Match = await bcrypts.compare(userPassword,foundUser.userPassword);
        if (!Match) return res.status(400).json({ message : 'Contraseña incorrecta' });

        if(foundUser.userStatus === "false") return res.status(400).json({message : 'Acceso denegado'})

        const role = await Roles.findByPk(foundUser.idRolUser, {
            include: License
          });

        const token = await createAccesToken({
            idUser : foundUser.idUser,
            userEmail : foundUser.userEmail,
            userName : foundUser.userName,
            Role : role,
            Licenses: role.Licenses.map(license => license.licenseName)
        });

        res.cookie("token", token, {
            sameSite: 'none',
            secure : true,
            httpOnly : false
        });

        const decoded = jwt.decode(token);

        res.json(decoded);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message})
    }
};

export const verifyToken = async (req, res) => {
    const {token} = req.cookies;
    if(!token) return res.status(401).json({message : 'Unautorized'});

    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if(err) return res.status(401).json({message : 'Unautorized'});

        const userFound = await User.findByPk(user.idUser);
        if(!userFound) return res.status(401).json({message : 'Unautorized'});

        const decoded = jwt.decode(token);

        return res.json(
            decoded
        );
    });
};



export const Logout = async (req,res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
      });
      return res.sendStatus(200);

};


export const PasswordRecovery = async (req, res) => {
    const { userEmail } = req.body;

    try {
        const foundUser = await User.findOne({where : {userEmail}});
        if (!foundUser ) return res.status(400).json({ message : 'Correo inválido' });

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user: EMAIL,
                pass: PASSWORD
            }
        });

        const port = EMAIL_PORT;

        const mailOptions = {
            from : EMAIL,
            to : `${foundUser.userEmail}`,
            subject : 'Enlace para la recuperación de la contraseña en el aplicativo lifejacket',
            text : `${port}/${foundUser.idUser}`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if(err){
                return res.status(400).json({message : err.message})
            } else {
                return res.status(299).json({message : 'Recuperación enviada con éxito!'})
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({message : error.message})
    }
};


export const resetPassword = async (req, res) => {
    const { idUser } = req.params;
    const { newUserPassword } = req.body;

    try {

        const user = await User.findByPk(idUser);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const foundPassword = await bcrypts.hash(newUserPassword, 10);
        user.userPassword = foundPassword;


        await user.save();

        res.status(201).json({ message: 'Contraseña actualizada con éxito!' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

