const companyRouter = require('express').Router()
const vehicleController = require('../controllers/company/vehicle.js')
const companyController = require('../controllers/company/company.js')
const divisionController = require('../controllers/company/division.js')
const shipmentController = require('../controllers/company/shipment.js')
const carbonEmissionController = require('../controllers/company/carbonEmission.js')
const supplyChainController = require('../controllers/company/supplyChain.js')
const auth = require('../middleware/auth.js')

// VEHICLE
companyRouter.get(
  '/vehicle/:divisionId',
  auth.verifyToken,
  vehicleController.getList
)
companyRouter.get(
  '/vehicle/detail/:vehicleId',
  auth.verifyToken,
  vehicleController.getById
)
companyRouter.post(
  '/vehicle',
  auth.onlyManagerPerusahaan,
  vehicleController.create
)
companyRouter.put(
  '/vehicle/:vehicleId',
  auth.verifyToken,
  vehicleController.update
)
companyRouter.delete(
  '/vehicle/:vehicleId',
  auth.verifyToken,
  vehicleController.remove
)

// DIVISION
companyRouter.get(
  '/division/:companyId',
  auth.verifyToken,
  divisionController.getList
)

companyRouter.get(
  '/division/supplychain/:idSupplyChain',
  auth.verifyToken,
  divisionController.getListBySupplyChain
)

companyRouter.get(
  '/division/detail/:divisionId',
  auth.verifyToken,
  divisionController.getById
)

companyRouter.post(
  '/division',
  auth.onlyAdminPerusahaan,
  divisionController.create
)

companyRouter.put(
  '/division/:divisionId',
  auth.onlyPerusahaan,
  divisionController.update
)

companyRouter.delete(
  '/division/:divisionId',
  auth.verifyToken,
  divisionController.remove
)

// SHIPMENT
companyRouter.get(
  '/shipment/:companyId',
  auth.verifyToken,
  shipmentController.getList
)

companyRouter.get(
  '/shipment/detail/:shipmentId',
  auth.verifyToken,
  shipmentController.getById
)

companyRouter.get(
  '/shipment/vehicle/:idVehicle',
  auth.verifyToken,
  shipmentController.getAllSHByVehicle
)

companyRouter.get(
  '/shipment/company/:idPerusahaan',
  auth.verifyToken,
  shipmentController.getAllSHByCompany
)

companyRouter.get(
  '/shipment/divisi_pengirim/:idDivisi',
  auth.verifyToken,
  shipmentController.getAllSHByDivisiPengirim
)

companyRouter.get(
  '/shipment/divisi_penerima/:idDivisi',
  auth.verifyToken,
  shipmentController.getAllSHByDivisiPenerima
)

companyRouter.post('/shipment', auth.verifyToken, shipmentController.create)

companyRouter.put(
  '/shipment',
  auth.onlyManagerPerusahaan,
  shipmentController.updateStatus
)
companyRouter.post(
  '/shipment/verify',
  auth.verifyToken,
  shipmentController.verify
)

companyRouter.post(
  '/shipment/identifier/:idShipment',
  auth.verifyToken,
  shipmentController.generateIdentifier
)

companyRouter.post(
  '/shipment/complete',
  auth.onlyManagerPerusahaan,
  shipmentController.complete
)

// CARBON EMISSION
companyRouter.get(
  '/carbon_emission/perusahaan/:companyId',
  auth.verifyToken,
  carbonEmissionController.GetCEByCompany
)

companyRouter.get(
  '/carbon_emission/detail/:carbonEmissionId',
  auth.verifyToken,
  carbonEmissionController.getById
)

companyRouter.post(
  '/carbon_emission',
  auth.verifyToken,
  carbonEmissionController.create
)

companyRouter.put(
  '/carbon_emission/:carbonEmissionId',
  auth.verifyToken,
  carbonEmissionController.update
)

companyRouter.delete(
  '/carbon_emission/:carbonEmissionId',
  auth.verifyToken,
  carbonEmissionController.remove
)

// SUPPLY CHAIN
companyRouter.get(
  '/supply_chain/',
  auth.verifyToken,
  supplyChainController.getList
)

companyRouter.get(
  '/supply_chain/:supplyId',
  auth.verifyToken,
  supplyChainController.getById
)

companyRouter.post(
  '/supply_chain',
  auth.verifyToken,
  supplyChainController.create
)

companyRouter.post(
  '/supply_chain/approve_kementerian/:supplyId',
  auth.onlyKementerian,
  supplyChainController.ApproveKementerian
)

companyRouter.post(
  '/supply_chain/approve_perusahaan/:supplyId',
  auth.onlyAdminPerusahaan,
  supplyChainController.ApprovePerusahaan
)

companyRouter.put(
  '/supply_chain/:supplyId',
  auth.verifyToken,
  supplyChainController.update
)

companyRouter.delete(
  '/supply_chain/:supplyId',
  auth.verifyToken,
  supplyChainController.remove
)

// COMPANY
companyRouter.get('/', auth.verifyToken, companyController.getList)
companyRouter.get('/:companyId', auth.verifyToken, companyController.getById)
companyRouter.post('/', companyController.create)

companyRouter.put(
  '/approve/:companyId',
  auth.onlyKementerian,
  companyController.approve
)

companyRouter.put(
  '/reject/:companyId',
  auth.onlyKementerian,
  companyController.reject
)

module.exports = companyRouter
