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
import { othervehicleinformation } from '../models/Othervehicleinformations.model.js';
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
        res.json(sale);
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

        await vehicle.update({ vehicleStatus : "false" });

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
            include: [{
                model: Vehicle
            }]
        });

        // Check if more than 20 days have passed since the sale date
        const currentDate = new Date();
        const saleDate = new Date(sale.saleDate);

        const timeDifference = currentDate - saleDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (daysDifference > 20) {
            return res.status(400).json({ message: 'No puedes cambiar el estado de la venta después de 20 días' });
        }

        //Update the status of the vehicle associated with the sale
        await sale.vehicle.update({
            vehicleStatus : "true"
        });

        // Update status sale
        await sale.update({
            saleStatus: "false"
        });

        return res.status(200).json({ message: 'Venta anulada con éxito' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
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


//function to download pdf file with sales report
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
            <h1>Informe de ventas</h1>
            <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
          </header>
          <table>
            <tr>
              <th>Fecha</th>
              <th>Precio de venta</th>
              <th>Departamento</th>
              <th>Municipio</th>
              <th>Nombre del cliente</th>
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
              return res.status(500).json({ message: err.message });
            }
            //send the stream to the client
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporteVenta.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//function to download pdf file with sale contract
export const contractSale = async (req, res) => {
    const { idSale } = req.params;

    try {
        const sale = await Sale.findByPk(idSale, {
            include: [
                {
                    model: Client,
                },
                {
                    model: Vehicle,
                    include: [
                        {
                            model: othervehicleinformation,

                        }
                    ]
                },
            ],
        });

        //Create html with the sale information
        const html = `
        <html>
        <body>

            ${sale.saleDate}
            ${sale.saleFinalPrice}
            ${sale.saleDepartment}
            ${sale.saleMunicipality}
            ${sale.saleLimitations}
            ${sale.salePecuniaryPenalty}

            
            ${sale.client.clientTypeDocument}
            ${sale.client.clientDocument}
            ${sale.client.clientName}
            ${sale.client.clientLastName}
            ${sale.client.clientDepartment}
            ${sale.client.clientMunicipality}
            ${sale.client.clientAddress}
            ${sale.client.clientPhoneNumber}
            ${sale.client.clientOtherContact}
            ${sale.client.clientOtherPhoneNumber}

            ${sale.vehicle.licensePlate}
            ${sale.vehicle.vehicleType}
            ${sale.vehicle.brand}
            ${sale.vehicle.model}
            ${sale.vehicle.type}
            ${sale.vehicle.line}
            ${sale.vehicle.color}
            ${sale.vehicle.othervehicleinformation.business}
            ${sale.vehicle.othervehicleinformation.series}
            ${sale.vehicle.othervehicleinformation.motor}
            ${sale.vehicle.othervehicleinformation.register}
            ${sale.vehicle.othervehicleinformation.chassis}
            ${sale.vehicle.othervehicleinformation.capacity}
            ${sale.vehicle.othervehicleinformation.service}
            ${sale.vehicle.othervehicleinformation.identificationCard}
            
        </body>
        </html> 
        `;

        const options = { format: 'Letter' };
        
        //generates the PDF and saves it to the file
        pdf.create(html, options).toStream(function(err, stream) {
            if (err) {
              return res.status(500).json({ message: err.message });
            }
            //send the stream to the client
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=contratoVenta.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
