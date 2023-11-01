/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application sales which are: 
 * create, view, annular, search and create report. Uses Express.js and Sequelize to interact with the database
 */

import {Sale} from '../models/Sales.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import pdf from 'html-pdf';
import { Op } from 'sequelize';
import app from '../app.js';

//Function to get the list of sales
export const getSales = async (req, res) => {
    try {
        //Query the database to get the list of sales
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

//Function to get a sale by their ID
export const getSale = async (req,res) => {
    try {
        const {idSale} = req.params;
        
        //Query the database to obtain a sale by its ID
        const sale = await Sale.findOne({
            where: {
                idSale
            },
            //include sales related models
            include: [
                {
                    model : Client
                },
                {
                    model: Vehicle
                }
            ],
        });
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

//Function add a new sale in the database
export const postSale = async (req, res) => {
    try {
        const {saleDate, saleFinalPrice, saleLimitations, saleDepartment, saleMunicipality, salePecuniaryPenalty, idClientSale, idVehicleSale} = req.body;

        const vehicle = await Vehicle.findByPk(idVehicleSale);
        
        //Function to create a new sale
        const newSale = await Sale.create({
            saleDate,
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

//Function to annular a sale
export const statusSale = async (req, res) => {
    const { idSale } = req.params;
    try {
        const sale = await Sale.findByPk(idSale, {
            include : [{
                model: Vehicle
            }]
        });

        //Update the status of the vehicle associated with the sale
        await sale.vehicle.update({
            vehicleStatus : true
        });

        //Update the sale status
        await sale.update({
            saleStatus : false
        });

        return res.status(200).json({ message: 'Venta anulada con éxito' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


//Function to search for sales based on various attributes (date, department, municipality, vehicles and client's information, etc.)
export const searchSale = async (req, res) => {
    const {search} = req.params;
    try {
        //Perform a search in the database
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
    //parameters
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

        //information is displayed in table form
        let salesRows = '';
        sale.forEach(s => {
          salesRows += `<tr>
            <td>${s.idSale}</td>
            <td>${s.saleDate}</td>
            <td>${s.saleFinalPrice}</td>
            <td>${s.saleDepartment}</td>
            <td>${s.saleMunicipality}</td>
            <td>${s.client.clientName}</td>
            <td>${s.client.clientLastName}</td>
            <td>${s.vehicle.licensePlate}</td>
          </tr>`;
        });
        
        //code html
        const html = `
          <html>
            <head>
              <style>
                /* css */
              </style>
            </head>
            <body>
              <h1>Informe de ventas</h1>
              <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
              <table>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Precio de venta</th>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  <th>Nonbre del cliente</th>
                  <th>Apellido del cliente</th>
                  <th>Placa de vehículo</th>
                </tr>
                ${salesRows}
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
            res.setHeader('Content-Disposition', 'attachment; filename=reporteVenta.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
