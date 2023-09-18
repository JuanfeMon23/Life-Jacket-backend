import {Exchange} from '../models/Exchanges.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import { Op } from 'sequelize';
import app from '../app.js';

export const getExchanges = async (req, res) => {
    try {
        const exchanges = await Exchange.findAll({
            include: [
                {
                    model : Client
                },
                {
                    model: Vehicle, 
                    as: 'vehiclesExchange' // nombre de la asosiacion con Exchange
                },
                
            ],
        });
        res.json(exchanges);
    } catch (error) {
        console.error(error);
        res.status(500).json({message : error.message});
    }
};

export const getExchange = async (req,res) => {
    try {
        const {idExchange} = req.params;
        
        const exchange = await Exchange.findOne({
            where: {
                idExchange
            },
            include: [
                {
                    model : Client
                },
                {
                    model: Vehicle, 
                    as: 'vehiclesExchange'
                },
            ],
        });

        if (exchange) {
            const vehiclesAss = exchange.ExchangeDetails;
            res.json({ exchange, vehiclesAss });
        } else {
            return res.status(404).json({ message: 'Intercambio no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

export const postExchange = async (req, res) => {
/*     try {
        const {exchangeDate, exchangeIncrementPrice, exchangeFinalPrice, exchangePaymentMethod, exchangeLimitations, exchangeDepartment, exchangeMunicipality, exchangePecuniaryPenalty, idClientExchange, idVehicleDetail} = req.body;

        const newExchange = await Exchange.create({
            exchangeDate,
            exchangeIncrementPrice,
            exchangeFinalPrice,
            exchangePaymentMethod,
            exchangeLimitations,
            exchangeDepartment,
            exchangeMunicipality,
            exchangePecuniaryPenalty,
            idClientExchange,
            vehicle : [idVehicleDetail]
        });

    try {
    const vehicle = await Vehicle.findByPk(idVehicleDetail);
    if (vehicle) {
        await newExchange.setVehicles([vehicle]);
    } else {
        console.error('No se pudo encontrar el vehículo.');
    }
    } catch (error) {
    console.error('Error al buscar el vehículo:', error);
    }

    return res.status(200).json(newExchange);
    } catch (error) {
        return res.status(500).json({message : error.message});
    } */
};


export const statusExchange = async (req, res) => {
    const { idExchange } = req.params;
    try {
        const exchange = await Exchange.findByPk(idExchange)
        exchange.exchangeStatus = !exchange.exchangeStatus;

        await exchange.save();
        res.json(exchange);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


export const searchExchange = async (req, res) => {
    const {search} = req.params;
    try {
        const exchange = await Exchange.findAll({
            include: [
                {
                    model: Client, 
                },
                {
                    model: Vehicle, 
                    as: 'vehiclesExchange',
                }
            ],
            where: {
                [Op.or]: [
                    { exchangeDate: { [Op.like]: `%${search}%` } },
                    { exchangeFinalPrice: { [Op.like]: `%${search}%` } },
                    { exchangePaymentMethod: { [Op.like]: `%${search}%` } },
                    { exchangeDepartment: { [Op.like]: `%${search}%` } },
                    { exchangeMunicipality: { [Op.like]: `%${search}%` } },
                    {'$Client.clientDocument$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientName$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientLastName$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.licensePlate$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.vehicleType$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.brand$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.model$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.type$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.line$': { [Op.like]: `%${search}%` } }
                ],
            },
        });
        res.json(exchange);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


export const reportExchange = async (req, res) => {
    const startDateExchange = new Date(req.params.startDateExchange);
    const finalDateExchange = new Date(req.params.finalDateExchange);
    try {
        const exchange = await Exchange.findAll({
            where: {
                exchangeDate: {
                    [Op.between]: [startDateExchange, finalDateExchange]
                }
            },
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle, 
                    as: 'vehiclesExchange' 
                }
            ],
        });
        res.json(exchange);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error.message});
    }
}; 