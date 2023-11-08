import bcrypt from 'bcryptjs';
import app from '../app.js';
import { Op , Sequelize  } from 'sequelize';
import { createAuthToken } from "../libs/jwt.js";
import { User } from "../models/Users.model.js";




