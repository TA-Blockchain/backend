'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const { BlockDecoder } = require('fabric-common')
const { v4: uuidv4 } = require('uuid')
const { bufferToJson } = require('../../utils/converter.js')

const getList = async (user, idPerusahaan) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.evaluateTransaction(
      'GetShipmentsByPerusahaan',
      idPerusahaan
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all shipment',
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getById = async (user, shipmentId) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = JSON.parse(
      await network.contract.evaluateTransaction('GetShipmentById', shipmentId)
    )

    const isApproved = result.status === 'Completed'
    const signature = isApproved ? await fabric.getSignature(result.TxId) : null

    const resultWithSignature = {
      ...result,
      signature,
    }

    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${shipmentId}`,
      resultWithSignature
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getAllSHByDivisiPengirim = async (user, data) => {
  try {
    const idDivisi = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.evaluateTransaction(
      'GetAllSHByDivisiPengirim',
      idDivisi
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${idDivisi}`,
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getAllSHByDivisiPenerima = async (user, data) => {
  try {
    const idDivisi = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.evaluateTransaction(
      'GetAllSHByDivisiPenerima',
      idDivisi
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${idDivisi}`,
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const DeleteAllShipment = async (user) => {
  try {
    
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.evaluateTransaction(
      'DeleteAllShipment')
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully Delete All shipment`,
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getAllSHByVehicle = async (user, data) => {
  try {
    const idVehicle = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.evaluateTransaction(
      'GetAllSHByVehicle',
      idVehicle
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${idVehicle}`,
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const GetAllSHByCompany = async (user, data) => {
  try {
    const idPerusahaan = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.evaluateTransaction(
      'GetAllSHByCompany',
      idPerusahaan
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${idPerusahaan}`,
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const create = async (user, data) => {
  try {
    const args = [
      uuidv4(),
      user.idPerusahaan,
      data.idSupplyChain,
      user.idDivisi,
      data.idDivisiPenerima,
      data.waktuBerangkat,
      data.idTransportasi,
      data.beratMuatan,
    ]
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    await network.contract.submitTransaction('CreateShipment', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully registered a new shipment'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const updateStatus = async (user, data) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const args = [data.id, data.status]
    await network.contract.submitTransaction('UpdateStatusShipment', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a shipment'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const complete = async (user, data) => {
  try {
    // Get the Car
    const veNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'vecontract',
      user.username
    )
    const vehicle = JSON.parse(await veNetwork.contract.evaluateTransaction(
      'GetVehicleById',
      data.idVehicle
    ))

    veNetwork.gateway.disconnect()

    // Calculate the carbon emission
    const distance = data.distance // km
    const fuelType = vehicle.fuelType // petrol | diesel
    const carModel = vehicle.carModel

 

    // let fuelEfficiency = 0 // liter / km
    // https://www.bing.com/ck/a?!&&p=2d2c54df952e41b7JmltdHM9MTcxNjA3NjgwMCZpZ3VpZD0yZTRjZTY5OS01NzE0LTZkMzQtMjUyMy1mMjE4NTY0MjZjNTgmaW5zaWQ9NTE5Mg&ptn=3&ver=2&hsh=3&fclid=2e4ce699-5714-6d34-2523-f21856426c58&psq=bp+Target+Neutral+Global+online+travel+calculator&u=a1aHR0cHM6Ly93d3cuYnAuY29tL2JwdGFyZ2V0bmV1dHJhbG5hdmFwcC9jb25zdW1lci9icFROX09ubGluZSUyMFRyYXZlbCUyMEdIRyUyMEVtaXNzaW9ucyUyMENhbGN1bGF0b3JfVXBkYXRlZCUyME1ldGhvZG9sb2d5JTIwU3RhdGVtZW50XzAxSnVseTIwMjEuOTYxYWNkNzEucGRm&ntb=1
    let emissionFactor = 0 // Distance Based Emission Factor kgCO2e/km
    if (carModel == 'Mobil Biasa') {
      if (fuelType == 'petrol') {
        emissionFactor = 0.14158
      } else {
        emissionFactor = 0.13856
      }
    }
    if (carModel == 'Truk Ringan') {
      if (fuelType == 'petrol') {
        emissionFactor = 0.14238
      } else {
        emissionFactor = 0.13782
      }
    }

    const carbon = distance * emissionFactor

    // Complete the shipment
    const shNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const shArgs = [data.id, carbon, data.idApprover]
    await shNetwork.contract.submitTransaction('CompleteShipment', ...shArgs)
    shNetwork.gateway.disconnect()

    // Create the carbon emission object
    const ceNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'cecontract',
      user.username
    )

    const ceArgs = [uuidv4(), vehicle.divisi.perusahaan, carbon, data.id]

    await ceNetwork.contract.submitTransaction('CreateCE', ...ceArgs)

    const peNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'pecontract',
      user.username
    )
    const perusahaan = JSON.parse(
      await peNetwork.contract.submitTransaction(
        'GetPerusahaanById',
        vehicle.divisi.perusahaan
      )
    )

    const kuota = perusahaan.sisaKuota - carbon
    let args = {
      perusahaan: perusahaan.id,
      kuota: kuota,
    }
    await peNetwork.contract.submitTransaction(
      'UpdateSisaKuota',
      JSON.stringify(args)
    )
    peNetwork.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully complete a shipment'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const generateIdentifier = async (user, idShipment) => {
  try {
    var network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const shipment = JSON.parse(
      await network.contract.evaluateTransaction('GetShipmentById', idShipment)
    )

    network.gateway.disconnect()
    if (shipment.status === 'Completed') {
      const identifier = {}
      network = await fabric.connectToNetwork('Kementrian', 'qscc', 'admin')

      const blockShipment = await network.contract.evaluateTransaction(
        'GetBlockByTxID',
        'carbonchannel',
        shipment.TxId
      )

      identifier.shipment = fabric.calculateBlockHash(
        BlockDecoder.decode(blockShipment).header
      )
      network.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        'Successfully get Shipment',
        identifier
      )
    } else {
      throw 'Shipment Not Completed'
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
      Buffer.from(identifier.shipment, 'hex')
    )

    // Get data from block
    const argsSh = BlockDecoder.decode(blockCarbonTransaction).data.data[0]
      .payload.data.actions[0].payload.chaincode_proposal_payload.input
      .chaincode_spec.input.args
    const idSh = Buffer.from(argsSh[1]).toString()

    //query data ijazah, transkrip, nilai
    network.gateway.disconnect()

    const shNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const sh = await shNetwork.contract.evaluateTransaction(
      'GetShipmentById',
      idSh
    )
    shNetwork.gateway.disconnect()
    const parseData = JSON.parse(sh)

    parseData.signature = await fabric.getSignature(parseData.TxId)
    const data = {
      shipment: parseData,
    }

    const result = {
      success: true,
      message: 'Shipment Trusted',
      data: data,
    }
    return iResp.buildSuccessResponse(200, 'Successfully get Shipment', result)
  } catch (error) {
    const result = {
      success: true,
      message: 'Invoice perjalanan tidak valid.',
    }
    return iResp.buildErrorResponse(500, 'Something wrong', result)
  }
}

module.exports = {
  getList,
  getById,
  create,
  updateStatus,
  complete,
  getAllSHByDivisiPengirim,
  getAllSHByDivisiPenerima,
  getAllSHByVehicle,
  GetAllSHByCompany,
  generateIdentifier,
  verify,
  DeleteAllShipment
}
