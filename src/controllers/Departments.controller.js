import { Departments } from '../models/Departments.js';
import { Op } from 'sequelize';
import app from '../app.js';
import fs from 'fs/promises'; 
import { sequelize } from '../database/database.js';

 export const getDepartments =  async (req, res) => {
    try {
        const departmentList = await Departments.findAll();
        res.json(departmentList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
 }


 export const postDepartments = async (req, res) => {
    try {
      const data = await fs.readFile('departments.json', 'utf8');
      const jsonData = JSON.parse(data);
  
      const createDepartments = [];
  
      for (const location of jsonData) {
        const { departamento } = location;
  
        for (const cityName of location.ciudades) {
          await Departments.findOrCreate({
            where: {
              Department: departamento,
              Municipe: cityName,
            },
          });
        }
      }
  
      res.status(201).json({ message: 'Información ingresada exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
  };


  export const getOnlyDepartments = async (req, res) => {
    try {
        const distincDepartments = await Departments.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('Department')), 'Department']
            ]
        });

        res.json(distincDepartments)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener los departamentos' });
    }
  };

  export const getOnlyMunicipes = async (req, res) => {
    const department = req.query.department;
    try {
        const distincMunicipes = await Departments.findAll({
            attributes : ['Municipe'] ,
            where : {
                Department : {
                    [Op.like] : department
                }
            }
        })

        res.json(distincMunicipes)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los municipios para el departamento' });
    }
  };