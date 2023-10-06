import {Router} from 'express';
import {getSalesData, getPurchasesData, getTotalVehicles, getTotalClients} from '../controllers/Dashboard.controller.js';

export const DashboardRoutes = Router();

DashboardRoutes.get('/Dashboard/Sales/withMonth', getSalesData);

DashboardRoutes.get('/Dashboard/Purchases/withMonth', getPurchasesData);

DashboardRoutes.get('/Dashboard/Vehicles/totalVehicles', getTotalVehicles);

DashboardRoutes.get('/Dashboard/Clients/totalClients', getTotalClients);