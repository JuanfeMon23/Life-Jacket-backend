/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application exchanges which are: 
 * create, view, annular, search and create reports. Uses Express.js and Sequelize to interact with the database
 */

import {Exchange} from '../models/Exchanges.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import { User } from '../models/Users.model.js';
import {ExchangesDetails} from '../models/ExchangesDetails.model.js';
import { othervehicleinformation } from '../models/Othervehicleinformations.model.js';
import pdf from 'html-pdf';
import { Op } from 'sequelize';
import app from '../app.js';

//Function to get the list of exchanges
export const getExchanges = async (req, res) => {
    try {
        //Query the database to get the list of exchanges
        const exchanges = await Exchange.findAll({
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange' //Includes the vehicles that are part of the exchange detail
                }
            ]
        });
        res.json(exchanges);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

//Function to get the list of exchanges filtered
export const getExchangesFiltered = async (req, res) => {
    try {
        //Query the database to get the list of exchanges
        const exchanges = await Exchange.findAll({
            where: {
                exchangeLimitations: {
                    [Op.ne]: 'abcdefghijklmnopqrstuvwxyz' 
                }
            },
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange' //Includes the vehicles that are part of the exchange detail
                }
            ]
        });
        res.json(exchanges);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

//Function to get a exchange by their ID
export const getExchange = async (req,res) => {
    try {
        const {idExchange} = req.params;

        //Query the database to obtain a exchange by its ID
        const exchange = await Exchange.findAll({
            where: {
                idExchange
            },
            //include exchanges related models
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange' //Includes the vehicles that are part of the exchange detail
                }
            ]
        });

        res.json(exchange);
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

//Function add a default exchange in the database
export const postExchange = async (req, res) => {
     try {
        //Function to create a default exchange 
        const newExchange = await Exchange.create({
            exchangeDate : "01/01/2023",
            exchangeCashPrice : 0,
            exchangeLimitations : "abcdefghijklmnopqrstuvwxyz",
            exchangeDepartment : "",
            exchangeMunicipality : "",
            exchangePecuniaryPenalty : 0,
            idClientExchange : 1
        });

        return res.status(200).json(newExchange);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function update default exchange in the database
export const updateExchange = async (req, res) => {
    const {idExchange} = req.params;
    try {
        const {exchangeDate, exchangeCashPrice, exchangeCashPriceStatus, exchangeLimitations, exchangeDepartment, exchangeMunicipality, exchangePecuniaryPenalty, idClientExchange} = req.body;

        //Query the database to obtain a purchase by its ID
        const exchange = await Exchange.findByPk(idExchange); 

        // Check if there are associated vehicles
        const associatedVehicles = await ExchangesDetails.findAll({
            where: {
                idExchangeVehicle: idExchange,
            },
        });

        if (associatedVehicles.length === 0) {
            return res.status(400).json({ message: 'No puedes crear el intercambio si no tienes vehículos asociados. Inténtalo de nuevo.' });
        }

        exchange.exchangeDate = exchangeDate
        exchange.exchangeCashPrice = exchangeCashPrice
        exchange.exchangeCashPriceStatus = exchangeCashPriceStatus
        exchange.exchangeLimitations = exchangeLimitations
        exchange.exchangeDepartment = exchangeDepartment
        exchange.exchangeMunicipality = exchangeMunicipality
        exchange.exchangePecuniaryPenalty = exchangePecuniaryPenalty
        exchange.idClientExchange = idClientExchange

        await exchange.save()
        return res.status(200).json(exchange);
   } catch (error) {
       return res.status(500).json({message : error.message});
   }
};

//Function add a new exchange detail in the database
export const postExchangeDetail = async (req, res) => {
    const {idExchange} = req.params;
    try {
        const {idVehicleExchange, vehicleStatusExchange} = req.body;

    const exchangeExists = await Exchange.findByPk(idExchange);

    if (!exchangeExists) {
        return res.status(404).json({ message: 'El intercambio no existe.' });
    }
        const vehicle = await Vehicle.findByPk(idVehicleExchange)
        
        const newExchangeDetail = await ExchangesDetails.create({
            idExchangeVehicle: idExchange, 
            idVehicleExchange,
            vehicleStatusExchange
        });

        const vehicleStatusExchangeValue = newExchangeDetail.vehicleStatusExchange

        if(vehicleStatusExchangeValue === "false"){
            await vehicle.update({ vehicleStatus : "false" });
        }else{
            await vehicle.update({ vehicleStatus : "true" })
        }

       return res.status(200).json(newExchangeDetail);

   } catch (error) {
       return res.status(500).json({message : 'Error al crear el detalle de intercambio.', error: error.message});
   }
};


//Function to cancel the default exchange
export const cancelExchange = async (req, res) => {
    const { idExchange } = req.params;
    try {
        //Query the database to obtain a exchange by its ID
        const exchange = await Exchange.findByPk(idExchange);

        const exchangesD = await ExchangesDetails.findAll({
            where: {
              idExchangeVehicle: idExchange
            }
        });

        for (const exchangeDetail of exchangesD) {
            const vehicle = await Vehicle.findByPk(exchangeDetail.idVehicleExchange);
            if(exchangeDetail.vehicleStatusExchange === "false"){
                await vehicle.update({ vehicleStatus : "true" });
            }
            await exchangeDetail.destroy();
        }

        await exchange.destroy();

        return res.status(200).json({ message: 'Intercambio cancelado con éxito!' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to delete a exchange detail
export const deleteExchangeDetail = async (req, res) => {
    const { idExchangeDetail } = req.params;
    try {
        const exchangeD = await ExchangesDetails.findByPk(idExchangeDetail);

        const vehicle = await Vehicle.findByPk(exchangeD.idVehicleExchange);

        if(exchangeD.vehicleStatusExchange === "false"){
            await vehicle.update({ vehicleStatus : "true" });
        }

        await exchangeD.destroy();

        return res.status(200).json({ message: 'Detalle de intercambio eliminado con éxito!' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


//Function to annular a exchange
export const statusExchange = async (req, res) => {
    const { idExchange } = req.params;
    try {
        const exchange = await Exchange.findByPk(idExchange, {
            include : [{
                model : Client
            }]
        });

        // Check if more than 20 days have passed since the exchange date
        const currentDate = new Date();
        const exchangeDate = new Date(exchange.exchangeDate);

        const timeDifference = currentDate - exchangeDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (daysDifference > 20) {
            return res.status(400).json({ message: 'No puedes cambiar el estado del intercambio después de 20 días' });
        }

        const exchangeDetails = await ExchangesDetails.findAll({
            where: {
              idExchangeVehicle: idExchange
            }
          });

        for (const exchangeDetail of exchangeDetails) {
            const vehicle = await Vehicle.findByPk(exchangeDetail.idVehicleExchange);
            if (exchangeDetail.vehicleStatusExchange === "false") {
                await vehicle.update({
                    vehicleStatus: "true"
                });
            }
            await exchangeDetail.update({
                vehicleStatusExchange : "anulado"
            });
        }

        //Update the exchange status
        await exchange.update({
            exchangeStatus : "false"
        });

        return res.status(200).json({ message: 'Intercambio anulado con éxito' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to search for exchanges based on various attributes (date, department, municipality, vehicles and client's information, etc.)
export const searchExchange = async (req, res) => {
    const {search} = req.params;
    try {
        //Perform a search in the database
        const exchange = await Exchange.findAll({
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange'
                }
            ],
            where: {
                [Op.or]: [
                    {exchangeDate: { [Op.like]: `%${search}%` } },
                    {exchangeDepartment: { [Op.like]: `%${search}%` } },
                    {exchangeMunicipality: { [Op.like]: `%${search}%` } },
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


//function to download pdf file with exchanges report
export const reportExchange = async (req, res) => {
    //parameters
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

        //information is displayed in table form
        let exchangesRows = '';
        exchange.forEach(e => {
            exchangesRows += `<tr>
            <td>${e.exchangeDate}</td>
            <td>${e.exchangeCashPrice}</td>
            <td>${e.exchangeDepartment}</td>
            <td>${e.exchangeMunicipality}</td>
            <td>${e.client.clientName}</td>
            <td>${e.client.clientLastName}</td>
            <td>`;
        
        // Add vehicle´s license plate
        e.vehiclesExchange.forEach(vehicle => {
            exchangesRows += `${vehicle.licensePlate}, `;
        });

        exchangesRows += '</td></tr>';
        });
        
        //code html
        const html = `
            <html>
            <head>
            <style>
                body {
                font-family: 'Arial', sans-serif;
                background-color: white;
                color: black;
                margin: 0;
                padding: 0;
                }

                header {
                    text-align: center;
                    margin-top: 20px;
                }
        
                h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #000000;
                }
            
                h2 {
                    margin-top: 10px;
                    font-size: 1.5rem;
                    color: #0D0628;
                    text-align: center;
                }
        
                p {
                color: #808080;
                text-align: center;
                }
        
                table {
                border-collapse: collapse;
                width: 100%;
                margin-top: 20px;
                }
        
                th, td {
                border: 1px solid #27336F;
                padding: 10px;
                text-align: left;
                }
        
                th {
                background-color: #27336F;
                color: white;
                }
        
                tr:nth-child(even) {
                background-color: white;
                }
        
                tr:hover {
                background-color: #f2f2f2;
                }
            </style>
            </head>
            <body>
            <header>
                <h2>LifeJacket</h2>
                <h1>Informe de intercambios</h1>
                <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
            </header>
            <table>
                <tr>
                <th>Fecha</th>
                <th>Efectivo involucrado</th>
                <th>Departamento</th>
                <th>Municipio</th>
                <th>Nombre del cliente</th>
                <th>Apellido del cliente</th>
                <th>Placa</th>
                </tr>
                ${exchangesRows}
            </table>
            </body>
        </html>
      
      
        `;
        
        const options = { format: 'Letter' };
        
        //generates the PDF and saves it to the file
        pdf.create(html, options).toStream(function(err, stream) {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: err.message });
            }
            //send the stream to the client
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporteIntercambio.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
