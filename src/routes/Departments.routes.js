import {Router} from 'express';

import { getDepartments, postDepartments, getOnlyDepartments, getOnlyMunicipes } from '../controllers/Departments.controller.js';

export const DepartmentsRoutes = Router();

DepartmentsRoutes.get('/Departments', getDepartments);

DepartmentsRoutes.post('/Departments', postDepartments);

DepartmentsRoutes.get('/Departments-departments', getOnlyDepartments);

DepartmentsRoutes.get('/Departments-municipes', getOnlyMunicipes);