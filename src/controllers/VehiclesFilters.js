import { Brands } from '../models/Brands.js';
import { Op } from 'sequelize';
import  { sequelize } from "../database/database.js";

export async function getVehicleTypes(req, res) {
  try {
    const distinctVehicleTypes = await Brands.findAll({
        attributes: [
            [sequelize.fn('DISTINCT',  sequelize.col('VehicleType')), 'VehicleType']
        ],
      });

    res.json(distinctVehicleTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los tipos de vehículos.' });
  }
}


export async function getVehicleBrand(req, res) {
  const vehicleType = req.query.vehicleType;
  try {
    const distinctBrandNames = await Brands.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('NameBrand')), 'NameBrand']],
      where: {
        VehicleType: {
          [Op.like]: vehicleType,
        },
      },
    });

    res.json(distinctBrandNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los nombres de marcas para el tipo de vehículo dado.' });
  }
}


export async function getVehicleLines(req, res) {
  const vehicleType = req.query.vehicleType;
  const brandName = req.query.brandName;

  try {
    const distinctBrandLines = await Brands.findAll({
      attributes: [[sequelize.literal('DISTINCT "BrandLine"'), 'BrandLine']],
      where: {
        VehicleType: {
          [Op.like]: vehicleType,
        },
        NameBrand: {
          [Op.like]: brandName,
        },
      },
    });

    res.json(distinctBrandLines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las líneas de marca para el tipo de vehículo y marca dados.' });
  }
}

