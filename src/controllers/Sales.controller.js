import {Sale} from '../models/Sales.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import { Op } from 'sequelize';
import app from '../app.js';

export const getSales = async (req, res) => {
    try {
        const sales = await Sale.findAll({
            include: [
                {
                    model : Client
                },
                {
                    model: Vehicle
                },
                
            ],
        });
        res.json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({message : error.message});
    }
};

export const getSale = async (req,res) => {
    try {
        const {idSale} = req.params;
        
        const sale = await Sale.findOne({
            where: {
                idSale
            },
            include: [
                {
                    model : Client
                },
                {
                    model: Vehicle
                },
            ],
        });
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

export const postSale = async (req, res) => {
    try {
        const {saleDate, saleFinalPrice, saleLimitations, saleDepartment, saleMunicipality, salePecuniaryPenalty, idClientSale, idVehicleSale} = req.body;

        const vehicle = await Vehicle.findByPk(idVehicleSale);
        
        const newSale = await Sale.create({
            saleDate,
            // saleIncrementPrice,
            saleFinalPrice,
            saleLimitations,
            saleDepartment, 
            saleMunicipality,
            salePecuniaryPenalty,
            idClientSale,
            idVehicleSale
        });


        await vehicle.update({ vehicleStatus : false });

    return res.status(200).json(newSale);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


export const statusSale = async (req, res) => {
    const { idSale } = req.params;
    try {
        const sale = await Sale.findByPk(idSale)
        sale.saleStatus = !sale.saleStatus;

        await sale.save();
        res.json(sale);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


export const searchSale = async (req, res) => {
    const {search} = req.params;
    try {
        const sale = await Sale.findAll({
            include: [
                {
                    model: Client, 
                },
                {
                    model: Vehicle
                }
            ],
            where: {
                [Op.or]: [
                    { saleDate: { [Op.like]: `%${search}%` } },
                    { saleFinalPrice: { [Op.like]: `%${search}%` } },
                    { saleDepartment: { [Op.like]: `%${search}%` } },
                    { saleMunicipality: { [Op.like]: `%${search}%` } },
                    {'$Client.clientDocument$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientName$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientLastName$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.licensePlate$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.vehicleType$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.brand$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.model$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.type$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.line$': { [Op.like]: `%${search}%` } }
                ],
            },
        });
        res.json(sale);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


export const reportSale = async (req, res) => {
    const startDateSale = new Date(req.params.startDateSale);
    const finalDateSale = new Date(req.params.finalDateSale);
    try {
        const sale = await Sale.findAll({
            where: {
                saleDate: {
                    [Op.between]: [startDateSale, finalDateSale]
                }
            },
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle
                }
            ],
        });
        res.json(sale);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error.message});
    }
};