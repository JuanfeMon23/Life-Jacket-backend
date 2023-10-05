import {Router} from 'express';
import {getSalesData, getPurchasesData} from '../controllers/Dashboard.controller.js';

export const DashboardRoutes = Router();

DashboardRoutes.get('/Dashboard/withMonth', getSalesData, getPurchasesData);
