/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application purchases which are: 
 * create, view, annular, search and create reports. Uses Express.js and Sequelize to interact with the database
 */

import {Purchase} from '../models/Purchases.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import pdf from 'html-pdf';
import { Op } from 'sequelize';
import app from '../app.js';

//Function to get the list of purchases
export const getPurchases = async (req, res) => {
    try {
        //Query the database to get the list of purchases
        const purchases = await Purchase.findAll({
            include: [
                {
                    model : Client
                },
                {
                    model: Vehicle
                },
                
            ],
        });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

//Function to get a purchase by their ID
export const getPurchase = async (req, res) => {
    try {
        const {idPurchase} = req.params;

        //Query the database to obtain a purchase by its ID
        const purchase = await Purchase.findOne({
            where: {
                idPurchase
            },
            //include purchases related models
            include : [
                {
                    model : Client
                },
                {
                    model : Vehicle
                }
            ]
        });
        return res.status(200).json(purchase);  
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function add a new purchase in the database
export const postPurchase = async (req, res) => {
    try {
        const {purchaseDate, purchaseFinalPrice, purchaseLimitations, purchaseDepartment, purchaseMunicipality, purchasePecuniaryPenalty, idClientPurchase, idVehiclePurchase} = req.body;

        //Function to create a new purchase
        const newPurchase = await Purchase.create({
            purchaseDate,
            purchaseFinalPrice,
            purchaseLimitations,
            purchaseDepartment,
            purchaseMunicipality,
            purchasePecuniaryPenalty,
            idClientPurchase,
            idVehiclePurchase
        });

        return res.status(200).json(newPurchase);   
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to annular a purchase
export const statusPurchase = async (req, res) => {
    const { idPurchase } = req.params;

    try {
        const purchase = await Purchase.findByPk(idPurchase, {
            include: [{
                model: Vehicle
            }]
        });

        // Check if more than 20 days have passed since the purchase date
        const currentDate = new Date();
        const purchaseDate = new Date(purchase.purchaseDate);

        const timeDifference = currentDate - purchaseDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (daysDifference > 20) {
            return res.status(400).json({ message: 'No puedes cambiar el estado de la compra después de 20 días' });
        }

        // Update status purchase
        await purchase.update({
            purchaseStatus: "false"
        });

        return res.status(200).json({ message: 'Compra anulada con éxito' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//Function to search for purchases based on various attributes (date, department, municipality, vehicles and client's information, etc.)
export const searchPurchase = async (req, res) => {
    const {search} = req.params;
    try {
        //Perform a search in the database
        const Purchase = await Purchase.findAll({
            include: [
                {
                    model: Client 
                },
                {
                    model: Vehicle
                }
            ],
            where: {
                [Op.or]: [
                    { purchaseDate: { [Op.like]: `%${search}%` } },
                    { purchaseFinalPrice: { [Op.like]: `%${search}%` } },
                    { purchaseDepartment: { [Op.like]: `%${search}%` } },
                    { purchaseMunicipality: { [Op.like]: `%${search}%` } },
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





export const reportPurchase = async (req, res) => {
    //parameters
    const startDatePurchase = new Date(req.params.startDatePurchase);
    const finalDatePurchase = new Date(req.params.finalDatePurchase);
    

    try {
        const purchase = await Purchase.findAll({
            where: {
                purchaseDate: {
                    [Op.between]: [startDatePurchase, finalDatePurchase]
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
        let purchasesRows = '';
        purchase.forEach(p => {
          purchasesRows += `<tr>
            <td>${p.purchaseDate}</td>
            <td>${p.purchaseFinalPrice}</td>
            <td>${p.purchaseDepartment}</td>
            <td>${p.purchaseMunicipality}</td>
            <td>${p.client.clientName}</td>
            <td>${p.client.clientLastName}</td>
            <td>${p.vehicle.licensePlate}</td>
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
                <h1>Informe de compras</h1>
                <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
              </header>
              <table>
                <tr>
                  <th>Fecha</th>
                  <th>Precio de compra</th>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  <th>Nombre del cliente</th>
                  <th>Apellido del cliente</th>
                  <th>Placa de vehículo</th>
                </tr>
                ${purchasesRows}
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
            res.setHeader('Content-Disposition', 'attachment; filename=reporteCompra.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
