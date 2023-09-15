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
        const {saleDate, salePrice, salePaymentMethod, saleLimitations, saleCity, salePecuniaryPenalty, saleStatus, idClientSale, idVehicleSale} = req.body;

        const newSale = await Sale.create({
            saleDate,
            salePrice,
            salePaymentMethod,
            saleLimitations,
            saleCity,
            salePecuniaryPenalty,
            saleStatus,
            idClientSale,
            idVehicleSale
        });

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
                    { salePrice: { [Op.like]: `%${search}%` } },
                    { salePaymentMethod: { [Op.like]: `%${search}%` } },
                    { saleCity: { [Op.like]: `%${search}%` } },
                    {'$Client.clientDocument$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientName$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientLastName$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesAs.licensePlate$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesAs.vehicleType$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesAs.brand$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesAs.model$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesAs.type$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesAs.line$': { [Op.like]: `%${search}%` } }
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