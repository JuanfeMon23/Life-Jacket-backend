import {Exchange} from '../models/Exchanges.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import {postVehicles} from '../controllers/Vehicles.controller.js';
import {ExchangesDetails} from '../models/ExchangesDetails.model.js';
import pdf from 'html-pdf';
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
                    model: Vehicle
                },
                {
                    model : ExchangesDetails
                }
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
                    model: Vehicle
                },
                {
                    model : ExchangesDetails
                }
            ],
        });

        res.json(exchange);
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

export const postExchange = async (req, res) => {
    const {exchangeDate, exchangeCashPrice, exchangeLimitations, exchangeDepartment, exchangeMunicipality, exchangePecuniaryPenalty, idClientExchange} = req.body;
     try {

        const newExchange = await Exchange.create({
            exchangeDate,
            exchangeCashPrice,
            exchangeLimitations,
            exchangeDepartment,
            exchangeMunicipality,
            exchangePecuniaryPenalty,
            idClientExchange
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

   } catch (error) {
       return res.status(500).json({message : error.message});
   }
};


export const postExchangeDetail = async (req, res) => {
    try {
       const {idExchangeVehicle, idVehicleExchange, vehicleSubtotal, exchangeFinalPrice, vehicleStatusExchange} = req.body;

       let vehicle = await Vehicle.findByPk(idVehicleExchange);

       if (vehicle === null) {
           const {licensePlate, vehicleType, brand, model, type, line, mileage, cylinderCapacity, fuel, traction, soat, technomechanics, timingBelt} = req.body;
           vehicle = await postVehicles(req, res);
       }

       const newExchangeDetail = await ExchangesDetails.create({
           idExchangeVehicle, 
           idVehicleExchange, 
           vehicleSubtotal, 
           exchangeFinalPrice, 
           vehicleStatusExchange
       });

       if(vehicleStatusExchange === "Saliente"){
           await vehicle.update({ vehicleStatus : false });
       };


       return res.status(200).json(newExchangeDetail);

   } catch (error) {
       return res.status(500).json({message : error.message});
   }
};



export const statusExchange = async (req, res) => {
    const { idExchange } = req.params;
    try {
        const exchange = await Exchange.findByPk(idExchange, {
            include : [{
                model : Vehicle
            }]
        });

        

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
                },
                {
                    model : ExchangesDetails
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
                    model: Vehicle
                },
                {
                    model : ExchangesDetails
                }
            ],
        });

        //para mostrarlo en forme de tabla
        let exchangesRows = '';
        sale.forEach(e => {
          exchangesRows += `<tr>
            <td>${e.idExchange}</td>
            <td>${e.exchangeDate}</td>
            <td>${e.exchangeCashPrice}</td>
            <td>${e.exchangeDepartment}</td>
            <td>${e.exchangeMunicipality}</td>
            <td>${e.client.clientName}</td>
            <td>${e.client.clientLastName}</td>
            <td>${e.vehicle.licensePlate}</td>
            <td>${e.exchangesdetails.exchangeFinalPrice}</td>
          </tr>`;
        });
        
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
                  <th>Placa de vehículo</th>
                  <th>Precio intercambio</th>
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


/* export const reportExchange = async (req, res) => {
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
                },
                {
                    model : ExchangesDetails
                }
            ],
        });
        res.json(exchange);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error.message});
    }
};  */



/* export const postExchange = async (req, res) => {
    try {
       const {exchangeDate, exchangeCashPrice, exchangeLimitations, exchangeDepartment, exchangeMunicipality, exchangePecuniaryPenalty, idClientExchange, idVehicleDetail} = req.body;

       const newExchange = await Exchange.create({
           exchangeDate,
           exchangeCashPrice,
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
   }
}; */