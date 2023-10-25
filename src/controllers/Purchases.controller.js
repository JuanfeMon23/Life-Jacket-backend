/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application purchases which are: 
 * create, view, annular, delete, search and create reports. Uses Express.js and Sequelize to interact with the database
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
        console.error(error);
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
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function add a new purchase in the database
export const postPurchase = async (req, res) => {
    try {
        const {purchaseDate, purchaseFinalPrice, purchaseLimitations, purchaseDepartment, purchaseMunicipality, purchasePecuniaryPenalty, idClientPurchase, idVehiclePurchase} = req.body;

        const vehicle = await Vehicle.findByPk(idVehiclePurchase);

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

        await vehicle.update({ vehiclePrice : purchaseFinalPrice });

        return res.status(200).json(newPurchase);   
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to annular a purchase
export const statusPurchase = async (req, res) => {
    const {idPurchase} = req.params;
    try {
        const purchase = await Purchase.findByPk(idPurchase);

        //Update the relationship between the purchase and the vehicle
        await purchase.setVehicle(1);

        //Updates the relationship between the purchase and the client
        await purchase.setClient(1);

        //Update the purchase status
        await purchase.update({
            purchaseStatus : false
        });

        return res.status(200).json({message : 'Compra anulada con éxito'});

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to delete a purchase if they have disabled
export const deletePurchase = async (req, res) => {
    const {idPurchase} = req.params;
    try {
        const purchase = await Purchase.findByPk(idPurchase);

        //Check if the purchase has disabled
        if(purchase.purchaseStatus === false){
            await purchase.destroy();
        }else {
            return res.status(500).json({ message: 'La compra no se puede eliminar' });
        };

        return res.status(200).json({message : 'Compra eliminada con éxito'});

    } catch (error) {
        
    }
}

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
            <td>${p.idPurchase}</td>
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
                /* css */
              </style>
            </head>
            <body>
              <h1>Informe de compras</h1>
              <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
              <table>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Precio de compra</th>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  <th>Nonbre del cliente</th>
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
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};















/* export const reportPurchase = async (req, res) => {
    const startDatePurchase = new Date(req.params.startDatePurchase);
    const finalDatePurchase = new Date(req.params.finalDatePurchase);
    try {
        const purchase = await Purchase.findAll({
            where: {
                saleDate: {
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

        const formattedPurchases = purchase.map((purchase) => ({
            idPurchase: purchase.idPurchase,
            purchaseDate: purchase.purchaseDate,
            purchaseFinalPrice: purchase.purchaseFinalPrice,
            purchaseDepartment: purchase.purchaseDepartment,
            purchaseMunicipality: purchase.purchaseMunicipality,
            clientDocument: purchase.client.clientDocument,
            clientName: purchase.client.clientName,
            clientLastName: purchase.client.clientLastName,
            licensePlate: purchase.vehicle.licensePlate,
            vehicleType: purchase.vehicle.vehicleType,
            brand: purchase.vehicle.brand,
            model: purchase.vehicle.model
        }));

        res.json(formattedPurchases);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error.message});
    }
};  */