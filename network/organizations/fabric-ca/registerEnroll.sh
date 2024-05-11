#!/bin/bash

function createKementrian() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/kementrian.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/kementrian.example.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@10.184.0.5:7054 --caname ca-kementrian --tls.certfiles "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/10-184-0-5-7054-ca-kementrian.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/10-184-0-5-7054-ca-kementrian.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/10-184-0-5-7054-ca-kementrian.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/10-184-0-5-7054-ca-kementrian.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/kementrian.example.com/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy kementrian's CA cert to kementrian's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/peerOrganizations/kementrian.example.com/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem" "${PWD}/organizations/peerOrganizations/kementrian.example.com/msp/tlscacerts/ca.crt"

  # Copy kementrian's CA cert to kementrian's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/kementrian.example.com/tlsca"
  cp "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem" "${PWD}/organizations/peerOrganizations/kementrian.example.com/tlsca/tlsca.kementrian.example.com-cert.pem"

  # Copy kementrian's CA cert to kementrian's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/kementrian.example.com/ca"
  cp "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem" "${PWD}/organizations/peerOrganizations/kementrian.example.com/ca/ca.kementrian.example.com-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-kementrian --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-kementrian --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-kementrian --id.name kementrianadmin --id.secret kementrianadminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@10.184.0.5:7054 --caname ca-kementrian -M "${PWD}/organizations/peerOrganizations/kementrian.example.com/peers/peer0.kementrian.example.com/msp" --csr.hosts peer0.kementrian.example.com  --tls.certfiles "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/kementrian.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/kementrian.example.com/peers/peer0.kementrian.example.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates, use --csr.hosts to specify Subject Alternative Names"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@10.184.0.5:7054 --caname ca-kementrian -M "${PWD}/organizations/peerOrganizations/kementrian.example.com/peers/peer0.kementrian.example.com/tls" --enrollment.profile tls --csr.hosts peer0.kementrian.example.com --csr.hosts 10.184.0.5 --tls.certfiles "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/kementrian.example.com/peers/peer0.kementrian.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/kementrian.example.com/peers/peer0.kementrian.example.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/kementrian.example.com/peers/peer0.kementrian.example.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/kementrian.example.com/peers/peer0.kementrian.example.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/kementrian.example.com/peers/peer0.kementrian.example.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/kementrian.example.com/peers/peer0.kementrian.example.com/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@10.184.0.5:7054 --caname ca-kementrian -M "${PWD}/organizations/peerOrganizations/kementrian.example.com/users/User1@kementrian.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/kementrian.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/kementrian.example.com/users/User1@kementrian.example.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://kementrianadmin:kementrianadminpw@10.184.0.5:7054 --caname ca-kementrian -M "${PWD}/organizations/peerOrganizations/kementrian.example.com/users/Admin@kementrian.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/kementrian/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/kementrian.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/kementrian.example.com/users/Admin@kementrian.example.com/msp/config.yaml"
}

function createSupplyChain() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/supplychain.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/supplychain.example.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@10.184.0.6:8054 --caname ca-supplychain --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/10.184.0.6-8054-ca-supplychain.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/10.184.0.6-8054-ca-supplychain.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/10.184.0.6-8054-ca-supplychain.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/10.184.0.6-8054-ca-supplychain.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy supplychain's CA cert to supplychain's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem" "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/tlscacerts/ca.crt"

  # Copy supplychain's CA cert to supplychain's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/supplychain.example.com/tlsca"
  cp "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem" "${PWD}/organizations/peerOrganizations/supplychain.example.com/tlsca/tlsca.supplychain.example.com-cert.pem"

  # Copy supplychain's CA cert to supplychain's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/supplychain.example.com/ca"
  cp "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem" "${PWD}/organizations/peerOrganizations/supplychain.example.com/ca/ca.supplychain.example.com-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-supplychain --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering peer1"
  set -x
  fabric-ca-client register --caname ca-supplychain --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null


  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-supplychain --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-supplychain --id.name supplychainadmin --id.secret supplychainadminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/msp" --csr.hosts peer0.supplychain.example.com  --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates, use --csr.hosts to specify Subject Alternative Names"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/tls" --enrollment.profile tls --csr.hosts peer0.supplychain.example.com --csr.hosts 10.184.0.6 --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer1 msp"
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/msp" --csr.hosts peer1.supplychain.example.com  --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/msp/config.yaml"

  infoln "Generating the peer1-tls certificates, use --csr.hosts to specify Subject Alternative Names"
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls" --enrollment.profile tls --csr.hosts peer1.supplychain.example.com --csr.hosts 10.184.0.7 --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/tls/server.key"

  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/users/User1@supplychain.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/supplychain.example.com/users/User1@supplychain.example.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://supplychainadmin:supplychainadminpw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/users/Admin@supplychain.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/supplychain.example.com/users/Admin@supplychain.example.com/msp/config.yaml"
}

function createSupplyChainPeer1() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/supplychain.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/supplychain.example.com/

  


  # Copy supplychain's CA cert to supplychain's /msp/tlscacerts directory (for use in the channel MSP definition)
  # mkdir -p "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/tlscacerts"
  # cp "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem" "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/tlscacerts/ca.crt"

  # # Copy supplychain's CA cert to supplychain's /tlsca directory (for use by clients)
  # mkdir -p "${PWD}/organizations/peerOrganizations/supplychain.example.com/tlsca"
  # cp "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem" "${PWD}/organizations/peerOrganizations/supplychain.example.com/tlsca/tlsca.supplychain.example.com-cert.pem"

  # # Copy supplychain's CA cert to supplychain's /ca directory (for use by clients)
  # mkdir -p "${PWD}/organizations/peerOrganizations/supplychain.example.com/ca"
  # cp "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem" "${PWD}/organizations/peerOrganizations/supplychain.example.com/ca/ca.supplychain.example.com-cert.pem"



  infoln "Registering peer1"
  set -x
  fabric-ca-client register --caname ca-supplychain --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null




  # cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer0.supplychain.example.com/msp/config.yaml"


  infoln "Generating the peer1 msp"
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/msp" --csr.hosts peer1.supplychain.example.com  --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/msp/config.yaml"

  infoln "Generating the peer1-tls certificates, use --csr.hosts to specify Subject Alternative Names"
  set -x
  fabric-ca-client enroll -u https://peer1:peer1pw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls" --enrollment.profile tls --csr.hosts peer1.supplychain.example.com --csr.hosts 10.184.0.7 --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  { set +x; } 2>/dev/null



  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/supplychain.example.com/peers/peer1.supplychain.example.com/tls/server.key"

  # infoln "Generating the user msp"
  # set -x
  # fabric-ca-client enroll -u https://user1:user1pw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/users/User1@supplychain.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  # { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/supplychain.example.com/users/User1@supplychain.example.com/msp/config.yaml"

  # infoln "Generating the org admin msp"
  # set -x
  # fabric-ca-client enroll -u https://supplychainadmin:supplychainadminpw@10.184.0.6:8054 --caname ca-supplychain -M "${PWD}/organizations/peerOrganizations/supplychain.example.com/users/Admin@supplychain.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/supplychain/ca-cert.pem"
  # { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/supplychain.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/supplychain.example.com/users/Admin@supplychain.example.com/msp/config.yaml"
}

function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/example.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/example.com

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@10.184.0.5:9054 --caname ca-orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/10.184.0.5-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/10.184.0.5-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/10.184.0.5-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/10.184.0.5-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy orderer org's CA cert to orderer org's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem" "${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts/tlsca.orderer.example.com-cert.pem"

  # Copy orderer org's CA cert to orderer org's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/ordererOrganizations/example.com/tlsca"
  cp "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem" "${PWD}/organizations/ordererOrganizations/example.com/tlsca/tlsca.orderer.example.com-cert.pem"

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@10.184.0.5:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp" --csr.hosts orderer.example.com  --csr.hosts 10.184.0.5 --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/config.yaml"

  infoln "Generating the orderer-tls certificates, use --csr.hosts to specify Subject Alternative Names"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@10.184.0.5:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls" --enrollment.profile tls --csr.hosts orderer.example.com --csr.hosts 10.184.0.5 --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the orderer's tls directory that are referenced by orderer startup config
  cp "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key"

  # Copy orderer org's CA cert to orderer's /msp/tlscacerts directory (for use in the orderer MSP definition)
  mkdir -p "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.orderer.example.com-cert.pem"

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@10.184.0.5:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp/config.yaml"
}
