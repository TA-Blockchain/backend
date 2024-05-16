const salesProposalRouter = require('express').Router()
const salesProposalController = require('../../controllers/carbonTrading/carbonSalesProposal.js')
const auth = require('../../middleware/auth.js')

salesProposalRouter.get('/', auth.verifyToken, salesProposalController.getList)

salesProposalRouter.get(
  '/perusahaan/:idPerusahaan',
  auth.onlyAdminPerusahaan,
  salesProposalController.getAllCspPerusahaan
)

salesProposalRouter.get(
  '/status/:status',
  auth.onlyKementerian,
  salesProposalController.getAllCspByStatus
)
salesProposalRouter.get(
  '/:salesProposalId',
  auth.verifyToken,
  salesProposalController.getById
)
salesProposalRouter.post(
  '/',
  auth.onlyAdminPerusahaan,
  salesProposalController.create
)

salesProposalRouter.put(
  '/:salesProposalId',
  auth.onlyKementerian,
  salesProposalController.update
)
salesProposalRouter.delete(
  '/:salesProposalId',
  auth.verifyToken,
  salesProposalController.remove
)

module.exports = salesProposalRouter
