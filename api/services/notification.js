const iResp = require('../utils/response.interface.js')
const fabric = require('../utils/fabric.js')
const { bufferToJson } = require('../utils/converter.js')

const getNotification = async (user) => {
  try {
    if (
      user.userType === 'admin-kementerian' ||
      user.userType === 'staf-kementerian'
    ) {
      // Status Pending =>  SupplyChain
      const supplyChain = await fabric.connectToNetwork(
        user.organizationName,
        'sccontract',
        user.username
      )
      const supplyChainList = await supplyChain.contract.submitTransaction(
        'GetAllSCByStatus',
        'pending'
      )
      supplyChain.gateway.disconnect()

      // Status Pending => CSP
      const CarbonSalesProposal = await fabric.connectToNetwork(
        user.organizationName,
        'cspcontract',
        user.username
      )
      const cspList = await CarbonSalesProposal.contract.submitTransaction(
        'GetAllCSPByStatus',
        '0'
      )
      supplyChain.gateway.disconnect()

      // Company ApprovalStatus => 0
      const Company = await fabric.connectToNetwork(
        user.organizationName,
        'pecontract',
        user.username
      )

      const companyList = await Company.contract.submitTransaction(
        'ReadAllPendingPerusahaan'
      )

      Company.gateway.disconnect()

      const result = {
        supplyChain: bufferToJson(supplyChainList),
        carbonSalesProposal: bufferToJson(cspList),
        company: bufferToJson(companyList),
      }

      return iResp.buildSuccessResponse(
        200,
        'Successfully get all Notification',
        result
      )
    } else if (user.userType === 'admin-perusahaan') {
      // Status Pending => Carbon Transaction
      const carbonTransactionNet = await fabric.connectToNetwork(
        user.organizationName,
        'ctcontract',
        user.username
      )
      const carbonTransactionPerusahaan =
        await carbonTransactionNet.contract.submitTransaction(
          'GetCTbyIdPerusahaan',
          user.idPerusahaan
        )
      carbonTransactionNet.gateway.disconnect()

      const carbonTransactionQuery = carbonTransactionPerusahaan.filter(
        function (item) {
          return item.status == 'pending'
        }
      )

      // Status Menunggu Persetujuan Perusahaan => supply Chain
      const companyNet = await fabric.connectToNetwork(
        user.organizationName,
        'pecontract',
        user.username
      )
      const companyNetResponse = await companyNet.contract.submitTransaction(
        'GetPerusahaanById',
        user.idPerusahaan
      )
      companyNet.gateway.disconnect()

      const company = bufferToJson(companyNetResponse)
      const listSupplyChain = company.supplyChain

      const supplyChainNet = await fabric.connectToNetwork(
        user.organizationName,
        'sccontract',
        user.username
      )

      const transactionResults = await Promise.all(
        listSupplyChain.map(async (idSupplyChain) => {
          const result = await supplyChainNet.contract.submitTransaction(
            'GetSCById',
            idSupplyChain
          )
          return JSON.parse(result)
        })
      )

      const result = {
        carbonTransaction: bufferToJson(carbonTransactionQuery),
        supplyChainPending: transactionResults.filter(function (item) {
          return item.status == 'Menunggu Persetujuan Perusahaan'
        }),
      }

      return iResp.buildSuccessResponse(
        200,
        'Successfully get all Notification',
        result
      )
    } else {
      const network = await fabric.connectToNetwork(
        user.organizationName,
        'shcontract',
        user.username
      )
      const shipment = await network.contract.submitTransaction(
        'GetShipmentsNeedApprovalByDivisiPenerima',
        user.idDivisi
      )
      network.gateway.disconnect()
      const result = {
        shipment: bufferToJson(shipment),
      }
      return iResp.buildSuccessResponse(
        200,
        'Successfully get all Notification',
        result
      )
    }
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = { getNotification }
