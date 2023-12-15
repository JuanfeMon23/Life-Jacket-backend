import { Brands } from '../models/Brands.js';
import { Op } from 'sequelize';
import app from '../app.js';
import fs from 'fs/promises'; // Importar el módulo fs para manejar archivos

export const getBrands = async (req, res) => {
    try {
        const brandList = await Brands.findAll();
        res.json(brandList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
export const postBrands = async (req, res) => {
    try {
        const data = await fs.readFile('vehicles.json', 'utf-8');
        const jsonData = JSON.parse(data);

        const brandDataList = jsonData.vehicleType;
        const createdBrands = [];

        for (const brandData of brandDataList) {
            const { type, brand } = brandData;

            for (const brandInfo of brand) {
                const { name, line } = brandInfo;

                for (const lineName of line) {
                    const [newBrand, created] = await Brands.findOrCreate({
                        where: {
                            VehicleType: type,
                            NameBrand: name,
                            BrandLine: lineName
                        }
                    });

                    if (created) {
                        createdBrands.push(newBrand);
                    }
                }
            }
        }

        return res.status(200).json(createdBrands);
    } catch (error) {
        console.error("Error al crear registros:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const createLines = async (req,res) => {
    const {VehicleType, NameBrand, BrandLine } = req.body;
    try {

        const existingBrand = await Brands.findOne({
            where:{
                VehicleType: VehicleType,
                NameBrand: NameBrand,
                BrandLine: BrandLine
            }
        });

        if (existingBrand) {
            return res.status(400).json({ message: "La línea asociada a esa marca ya existe." });
        }

        const newLine = await Brands.create({
            VehicleType, NameBrand, BrandLine
        })

        return res.status(200).json(newLine);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const createBrands = async (req, res) => {
    const { VehicleType, NameBrand } = req.body;

    try {
        const existingBrand = await Brands.findOne({
            where:{
                VehicleType: VehicleType,
                NameBrand: NameBrand
            }
        });

        if (existingBrand) {
            return res.status(400).json({ message: "La marca ya existe." });
        }

        const newBrand = await Brands.create({
            VehicleType,
            NameBrand,
        });

        return res.status(200).json(newBrand);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteBrands = async (req,res) => {
    const {idBrand} = req.params;
    try {
        const brand = await Brands.findByPk(idBrand);

        await brand.destroy();
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
