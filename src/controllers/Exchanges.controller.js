import {Exchange} from '../models/Exchanges.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import {Improvements} from '../models/Improvements.model.js';
import {ExchangesDetails} from '../models/ExchangesDetails.model.js';
import pdf from 'html-pdf';
import { Op } from 'sequelize';
import app from '../app.js';

export const getExchanges = async (req, res) => {
    try {
        const exchanges = await Exchange.findAll({
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange'
                }
            ]
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

        const exchange = await Exchange.findAll({
            where: {
                idExchange
              },
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange'
                }
            ]
        });

        res.json(exchange);
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

export const postExchange = async (req, res) => {
     try {
        const newExchange = await Exchange.create({
            exchangeDate : "01/01/2023",
            exchangeCashPrice : 0,
            exchangeLimitations : "Ninguna",
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

export const updateExchange = async (req, res) => {
    const {idExchange} = req.params;
    try {
        const {exchangeDate, exchangeCashPrice, exchangeLimitations, exchangeDepartment, exchangeMunicipality, exchangePecuniaryPenalty, idClientExchange} = req.body;

        const exchange = await Exchange.findByPk(idExchange); 

        exchange.exchangeDate = exchangeDate
        exchange.exchangeCashPrice = exchangeCashPrice
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


export const postExchangeDetail = async (req, res) => {
    const {idExchange} = req.params;
    try {
        const {idVehicleExchange, exchangeFinalPrice, vehicleStatusExchange} = req.body;

        const vehicle = await Vehicle.findByPk(idVehicleExchange);

        // Find the sum of the improvements associated with the vehicle
        const improvementsSum = await Improvements.sum('improvementPrice', {
            where: { idVehicleImprovement: idVehicleExchange }
        });

        // Add the purchase price and the sum of the improvements to get the vehicleSubtotal
        const vehicleSubtotalPrice = vehicle.vehiclePrice + improvementsSum; 
        
        const newExchangeDetail = await ExchangesDetails.create({
            idExchangeVehicle: idExchange, 
            idVehicleExchange, 
            vehicleSubtotal : vehicleSubtotalPrice, 
            exchangeFinalPrice, 
            vehicleStatusExchange
        });

       return res.status(200).json(newExchangeDetail);

   } catch (error) {
       return res.status(500).json({message : error.message});
   }
};

export const statusVehicleExchange = async (req, res) => {
    const { idExchangeDetail } = req.params;
    try {
        const exchangeDetail = await ExchangesDetails.findByPk(idExchangeDetail)

        const vehicleChangeStatus = await Vehicle.findByPk(exchangeDetail.idVehicleExchange);
        
        exchangeDetail.vehicleStatusExchange = !exchangeDetail.vehicleStatusExchange;

        //true es para los vehiculos ENTRANTES y false para los vehiculos SALIENTES
        if(exchangeDetail.vehicleStatusExchange === false){
            await vehicleChangeStatus.update({ vehicleStatus : false })
        }else{
            await vehicleChangeStatus.update({ vehicleStatus : true })
        }

        await exchangeDetail.save();
        res.json(exchangeDetail);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const statusExchange = async (req, res) => {
    const { idExchange } = req.params;
    try {

        const exchange = await Exchange.findByPk(idExchange, {
            include : [{
                model : Client
            }]
        });

        const exchangeDetails = await ExchangesDetails.findAll({
            where: {
              idExchangeVehicle: idExchange
            },
            include: [{
              model: Vehicle
            }]
          });

        await exchange.setClient(1);

        for (const exchangeDetail of exchangeDetails) {
            if (exchangeDetail.vehicleStatusExchange === false) {
                await exchangeDetail.Vehicle.update({
                    vehicleStatus: true
                });
            }
    
            await exchangeDetail.update({
                idVehicleExchange: 1
            });
        }

        await exchange.update({
            exchangeStatus : false
        });

        return res.status(200).json({ message: 'Intercambio anulado con éxito' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const deleteExchange = async (req, res) => {
    const { idExchange } = req.params;
    try {
        const exchange = await Exchange.findByPk(idExchange);

        const exchangeDetails = await ExchangesDetails.findAll({
            where: {
              idExchangeVehicle: idExchange
            }
        });

        if(exchange.exchangeStatus === false){
            await exchange.destroy();
            for (const exchangeDetail of exchangeDetails) {
                await exchangeDetail.destroy();
            }
        }else {
            return res.status(500).json({ message: 'El intercambio no se puede eliminar' });
        };

        return res.status(200).json({ message: 'Intercambio eliminado con éxito' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const cancelExchange = async (req, res) => {
    const { idExchange } = req.params;
    try {
        const exchange = await Exchange.findByPk(idExchange);

        await exchange.destroy();

        return res.status(200).json({ message: 'Intercambio eliminado con éxito' });

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

export const reportExchange = async (req, res) => {
    //los parametros que se necesitan pa que se ejecute
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

        /* const exchangeD = await ExchangesDetails.findAll({
            include: [
                {
                    model: Exchange,
                    where: {
                        exchangeDate: {
                            [Op.between]: [startDateExchange, finalDateExchange]
                        }
                    },
                    include: [
                        {
                            model: Vehicle,
                            as: 'vehiclesExchange'
                        }
                    ]
                }
            ]
        }); */

        //para mostrarlo en forme de tabla
        let exchangesRows = '';
        exchange.forEach(e => {
            exchangesRows += `<tr>
            <td>${e.idExchange}</td>
            <td>${e.exchangeDate}</td>
            <td>${e.exchangeCashPrice}</td>
            <td>${e.exchangeDepartment}</td>
            <td>${e.exchangeMunicipality}</td>
            <td>${e.client.clientName}</td>
            <td>${e.client.clientLastName}</td>
            <td>`;
        
        // Agregar placas de vehículos
        e.vehiclesExchange.forEach(vehicle => {
            exchangesRows += `${vehicle.licensePlate}, `;
        });

        exchangesRows += '</td></tr>';
        });

        /* let exchangesDRows = '';
        exchangeD.forEach(e => {
          exchangesDRows += `<tr>
            <td>${e.exchange.vehicle.licensePlate}</td>
          </tr>`;
        }); */
        
        //codigo html
        const html = `
          <html>
            <head>
              <style>
                /* css */
              </style>
            </head>
            <body>
              <h1>Informe de intercambios</h1>
              <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
              <table>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Efectivo involucrado</th>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  <th>Nonbre del cliente</th>
                  <th>Apellido del cliente</th>
                  <th>Placa</th>
                </tr>
                ${exchangesRows}
              </table>
            </body>
          </html>
        `;
        
        const options = { format: 'Letter' };
        
        //genera el pdf y lo guarda en el archivo
        pdf.create(html, options).toStream(function(err, stream) {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: err.message });
            }
            // envia el stream al cliente
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporteIntercambio.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};



