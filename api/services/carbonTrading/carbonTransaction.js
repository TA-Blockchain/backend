'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const { BlockDecoder } = require('fabric-common')
const { bufferToJson } = require('../../utils/converter.js')
const getList = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const result = await network.contract.evaluateTransaction('ReadAllCT')
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all carbon transaction',
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const generateIdentifier = async (user, idTransaction) => {
  try {
    var network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const carbonTransaction = JSON.parse(
      await network.contract.evaluateTransaction('GetCTById', idTransaction)
    )

    network.gateway.disconnect()
    if (carbonTransaction.status === 'approve') {
      const identifier = {}
      network = await fabric.connectToNetwork('Kementrian', 'qscc', 'admin')

      const blockCarbonTransaction = await network.contract.evaluateTransaction(
        'GetBlockByTxID',
        'carbonchannel',
        carbonTransaction.HistoryTxId[carbonTransaction.HistoryTxId.length - 1]
      )

      identifier.carbonTransaction = fabric.calculateBlockHash(
        BlockDecoder.decode(blockCarbonTransaction).header
      )
      network.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        'Successfully get all carbon transaction',
        identifier
      )
    } else {
      throw 'Carbon Transaction Belum di Approve'
    }
  } catch (error) {
    return iResp.buildErrorResponse(500, 'something wrong', error.message)
  }
}

const verify = async (user, identifier) => {
  try {
    // find block that block hash == identifier
    const network = await fabric.connectToNetwork('Kementrian', 'qscc', 'admin')
    const blockCarbonTransaction = await network.contract.evaluateTransaction(
      'GetBlockByHash',
      'carbonchannel',
      Buffer.from(identifier.carbonTransaction, 'hex')
    )

    // Get data from block
    const argsCt = BlockDecoder.decode(blockCarbonTransaction).data.data[0]
      .payload.data.actions[0].payload.chaincode_proposal_payload.input
      .chaincode_spec.input.args
    const idCt = Buffer.from(argsCt[1]).toString()

    //query data ijazah, transkrip, nilai
    network.gateway.disconnect()

    const ctNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const ct = await ctNetwork.contract.evaluateTransaction('GetCTById', idCt)
    ctNetwork.gateway.disconnect()
    const parseData = JSON.parse(ct)

    parseData.signatures = await fabric.getAllSignature(parseData.HistoryTxId)
    console.log(parseData)
    const data = {
      carbonTransaction: parseData,
    }

    const result = {
      success: true,
      message: 'Carbon Transaction asli',
      data: data,
    }
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all carbon transaction',
      result
    )
  } catch (error) {
    console.log('ERROR', error)
    const result = {
      success: true,
      message: 'Carbon Transaction palsu',
    }
    return iResp.buildErrorResponse(500, 'Something wrong', result)
  }
}

const getById = async (user, id) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const result = JSON.parse(
      await network.contract.evaluateTransaction('GetCTById', id)
    )

    console.log(result)

    const allSignatures = await fabric.getAllSignature(result.HistoryTxId)

    const resultWithTxIds = {
      ...result,
      signatures: allSignatures,
    }
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon transaction ${id}`,
      resultWithTxIds
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getCarbonTransactionByIdPerusahaan = async (user, idPerusahaan) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const result = await network.contract.evaluateTransaction(
      'GetCTbyIdPerusahaan',
      idPerusahaan
    )

    network.gateway.disconnect()

    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon transaction By Perusahaan ID: ${idPerusahaan}`,
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getCarbonTransactionByIdProposal = async (user, data) => {
  try {
    const idProposal = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )

    const result = await network.contract.evaluateTransaction(
      'GetCTbyIdProposal',
      idProposal
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon transaction ${idProposal}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getCarbonTransactionByIdPenjual = async (user, data) => {
  try {
    const result = await getCarbonTransactionByIdPenjualService(user, data)
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon transaction by penjual id: ${data}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getCarbonTransactionByIdPenjualService = async (user, data) => {
  try {
    const idPerusahaan = data
    const cspNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'cspcontract',
      user.username
    )
    const carbonSalesProposal = bufferToJson(
      await cspNetwork.contract.evaluateTransaction(
        'GetAllCSPByIdPerusahaan',
        idPerusahaan
      )
    )

    cspNetwork.gateway.disconnect()

    const ctNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )

    const carbonTransaction = []
    const promise = carbonSalesProposal.map(async (item) => {
      const result = bufferToJson(
        await ctNetwork.contract.evaluateTransaction(
          'GetCTbyIdProposal',
          item.id
        )
      )
      result.forEach((ct) => {
        carbonTransaction.push(ct)
      })
    })
    await Promise.all(promise)
    ctNetwork.gateway.disconnect()
    return carbonTransaction
  } catch (error) {
    console.log(error)
  }
}

const getCarbonTransactionByStatusService = async (user, data) => {
  try {
    const status = data

    const ctNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )

    const result = await ctNetwork.contract.evaluateTransaction(
      'GetAllCTByStatus',
      status
    )

    ctNetwork.gateway.disconnect()
    return result
  } catch (error) {
    console.log(error)
  }
}

const verifikasiTransferKarbonKementrian = async (user, data) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )

    const carbonTransaction = JSON.parse(
      await network.contract.submitTransaction('GetCTById', data.id)
    )

    if (data.status === 'reject') {
      carbonTransaction.status = 'reject'
      const result = await network.contract.submitTransaction(
        'UpdateCT',
        JSON.stringify(carbonTransaction)
      )

      network.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${carbonTransaction.id}`
      )
    } else if (data.status === 'approve') {
      carbonTransaction.status = 'approve'
      carbonTransaction.approvers.push(data.idApproval)
      await network.contract.submitTransaction(
        'UpdateCT',
        JSON.stringify(carbonTransaction)
      )
      network.gateway.disconnect()

      const network3 = await fabric.connectToNetwork(
        user.organizationName,
        'cspcontract',
        user.username
      )

      const carbonSalesProposal = JSON.parse(
        await network3.contract.submitTransaction(
          'GetCSPById',
          carbonTransaction.proposalPenjual.id
        )
      )
      network3.gateway.disconnect()

      const network2 = await fabric.connectToNetwork(
        user.organizationName,
        'pecontract',
        user.username
      )

      carbonSalesProposal.kuotaYangDijual =
        carbonSalesProposal.kuotaYangDijual - carbonTransaction.kuota

      const perusahaanPembeli = bufferToJson(
        await network2.contract.submitTransaction(
          'GetPerusahaanById',
          carbonTransaction.perusahaanPembeli.id
        )
      )
      const perusahaanPenjual = bufferToJson(
        await network2.contract.submitTransaction(
          'GetPerusahaanById',
          carbonSalesProposal.idPerusahaan
        )
      )

      let updateArgsPembeli = {
        perusahaan: perusahaanPembeli.id,
        kuota: (perusahaanPembeli.sisaKuota += carbonTransaction.kuota),
      }

      let updateArgsPenjual = {
        perusahaan: perusahaanPenjual.id,
        kuota: (perusahaanPenjual.sisaKuota -= carbonTransaction.kuota),
      }
      console.log(updateArgsPembeli)
      console.log(updateArgsPenjual)
      await network2.contract.submitTransaction(
        'UpdateSisaKuota',
        JSON.stringify(updateArgsPembeli)
      )
      await network2.contract.submitTransaction(
        'UpdateSisaKuota',
        JSON.stringify(updateArgsPenjual)
      )

      network2.gateway.disconnect()
      if (carbonSalesProposal.kuotaYangDijual <= 0) {
        carbonSalesProposal.status = 'Sudah Habis'
      }
      const network4 = await fabric.connectToNetwork(
        user.organizationName,
        'cspcontract',
        user.username
      )
      await network4.contract.submitTransaction(
        'UpdateCSP',
        JSON.stringify(carbonSalesProposal)
      )
      console.log('UpdateCSP')
      network4.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${carbonTransaction.id}`
      )
    }
  } catch (error) {
    console.log(error)
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
//
const verifikasiTransferKarbon = async (user, data) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const carbonTransaction = JSON.parse(
      await network.contract.submitTransaction('GetCTById', data.id)
    )
    if (data.status === 'reject') {
      carbonTransaction.status = 'reject'
      const result = await network.contract.submitTransaction(
        'UpdateCT',
        JSON.stringify(carbonTransaction)
      )

      network.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${carbonTransaction.id}`
      )
    } else if (data.status === 'approve') {
      carbonTransaction.status = 'approve penjual'
      carbonTransaction.approvers.push(data.idApproval)
      await network.contract.submitTransaction(
        'UpdateCT',
        JSON.stringify(carbonTransaction)
      )
      network.gateway.disconnect()

      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${carbonTransaction.id}`
      )
    }
  } catch (error) {
    console.log(error)
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const create = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    await network.contract.submitTransaction('CreateCT', JSON.stringify(args))
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully registered a new carbon transaction'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    await network.contract.submitTransaction('UpdateCT', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a carbon transaction'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const remove = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    await network.contract.submitTransaction('DeleteCT', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully delete a carbon transaction'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = {
  getList,
  getById,
  create,
  update,
  remove,
  getCarbonTransactionByIdPerusahaan,
  getCarbonTransactionByIdProposal,
  verifikasiTransferKarbonKementrian,
  getCarbonTransactionByIdPenjual,
  getCarbonTransactionByIdPenjualService,
  getCarbonTransactionByStatusService,
  verifikasiTransferKarbon,
  generateIdentifier,
  verify,
}
