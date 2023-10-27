/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 *  Description: This script contains routes of Dashboard and its different functions
 */

import {Router} from 'express';
import {getSalesDataByAmount, getPurchasesDataByAmount, getImprovementsDataByAmount, getTotalVehicles} from '../controllers/Dashboard.controller.js';

export const DashboardRoutes = Router();

DashboardRoutes.get('/Dashboard/Sales/withMonth', getSalesDataByAmount);

DashboardRoutes.get('/Dashboard/Purchases/withMonth', getPurchasesDataByAmount);

DashboardRoutes.get('/Dashboard/Improvements/withMonth', getImprovementsDataByAmount);

DashboardRoutes.get('/Dashboard/Vehicles/totalVehicles', getTotalVehicles);
