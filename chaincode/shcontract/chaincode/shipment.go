package chaincode

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SHContract struct {
	contractapi.Contract
}

type Perjalanan struct {
	ID               string   `json:"id"`
	IdPerusahaan 	 string   `json:"idPerusahaan"`
	IdSupplyChain    string   `json:"idSupplyChain"`
	IdDivisiPengirim string   `json:"idDivisiPengirim"`
	IdDivisiPenerima string   `json:"idDivisiPenerima"`
	Status           string   `json:"status"`
	WaktuBerangkat   string   `json:"waktuBerangkat"`
	WaktuSampai      string   `json:"waktuSampai"`
	IdTransportasi   string   `json:"idTransportasi"`
	BeratMuatan      int      `json:"beratMuatan"`
	EmisiKarbon      float64  `json:"emisiKarbon"`
	Approver		 string   `json:"approver"`
}

type PerjalananResult struct {
	ID             string   `json:"id"`
	IdSupplyChain  string   `json:"idSupplyChain"`
	DivisiPengirim *Divisi  `json:"divisiPengirim"`
	DivisiPenerima *Divisi  `json:"divisiPenerima"`
	Status         string   `json:"status"`
	WaktuBerangkat string   `json:"waktuBerangkat"`
	WaktuSampai    string   `json:"waktuSampai"`
	Transportasi   *Vehicle `json:"transportasi"`
	BeratMuatan    int      `json:"beratMuatan"`
	EmisiKarbon    float64      `json:"emisiKarbon"`
	Approvers	    string  `json:"approver"`
	TxId	   	   string 	 `json: "TxId"`
}

// var logger = flogging.MustGetLogger("PEContract")

type Divisi struct {
	ID           string `json:"id"`
	Nama		 string `json:"name"`
	IdPerusahaan string `json:"perusahaan"`
	Lokasi       string `json:"lokasi"`
	IdManajer    string `json:"manajer"`
	Lat 		 string `json:"lat"`
	Long		 string `json:"long"`
}

type CarbonEmission struct {
	ID           string   `json:"id"`
	IdPerusahaan string   `json:"perusahaan"`
	IdPerjalanan []string `json:"perjalanan"`
	TotalEmisi   string   `json:"totalEmisi"`
}

type Vehicle struct {
	ID       string `json:"id"`
	IdDivisi *Divisi `json:"divisi"`
	CarModel string `json:"carModel"`
	FuelType string `json:"fuelType"`
	KmUsage  string `json:"kmUsage"`
}

const (
	ER11 string = "ER11-Incorrect number of arguments. Required %d arguments, but you have %d arguments."
	ER12        = "ER12-Shipment with id '%s' already exists."
	ER13        = "ER13-Shipment with id '%s' doesn't exist."
	ER14        = "ER14-Shipment with id '%s' no longer require approval."
	ER15        = "ER15-Shipment with id '%s' already approved by PTK with id '%s'."
	ER16        = "ER16-Shipment with id '%s' cannot be approved by PTK with id '%s' in this step."
	ER31        = "ER31-Failed to change to world state: %v."
	ER32        = "ER32-Failed to read from world state: %v."
	ER33        = "ER33-Failed to get result from iterator: %v."
	ER34        = "ER34-Failed unmarshaling JSON: %v."
	ER35        = "ER35-Failed parsing string to integer: %v."
	ER36        = "ER36-Failed parsing string to float: %v."
	ER37        = "ER37-Failed to query another chaincode (%s): %v."
	ER41        = "ER41-Access is not permitted with MSDPID '%s'."
	ER42        = "ER42-Unknown MSPID: '%s'."
)

// CreateAsset issues a new asset to the world state with given details.
func (s *SHContract) CreateShipment(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 9 {

	}

	id := args[0]
	idPerusahaan := args[1]
	idSupplyChain := args[2]
	divisiPengirim := args[3]
	divisiPenerima := args[4]
	status := "Need Approval"
	waktuBerangkat := args[5]
	transportasi := args[6]
	beratMuatan, _ := strconv.Atoi(args[7])

	perjalanan := Perjalanan{
		ID:               id,
		IdPerusahaan: 	  idPerusahaan,
		IdSupplyChain:    idSupplyChain,
		IdDivisiPengirim: divisiPengirim,
		IdDivisiPenerima: divisiPenerima,
		Status:           status,
		WaktuBerangkat:   waktuBerangkat,
		IdTransportasi:   transportasi,
		BeratMuatan:      beratMuatan,
		Approver: "",
	}

	perjalananJSON, err := json.Marshal(perjalanan)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, perjalananJSON)
	if err != nil {
		fmt.Errorf(err.Error())
	}

	return err
}

func (s *SHContract) Approve(ctx contractapi.TransactionContextInterface, shipmentId string) error {
	perjalanan, err := getShipmentStateById(ctx, shipmentId)
	if err != nil {
		return err
	}

	perjalanan.Status = "Approved"

	perjalananJSON, err := json.Marshal(perjalanan)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(shipmentId, perjalananJSON)
	if err != nil {
	}

	return err
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *SHContract) UpdateStatusShipment(ctx contractapi.TransactionContextInterface) error {
	// logger.Infof("Run UpdateKls function with args: %+q.", args)
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 2 {

	}

	shipmentId := args[0]
	newStatus := args[1]

	perjalanan, err := getShipmentStateById(ctx, shipmentId)
	if err != nil {
		return err
	}

	perjalanan.Status = newStatus

	perjalananJSON, err := json.Marshal(perjalanan)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(shipmentId, perjalananJSON)
	if err != nil {
	}

	return err
}

func (s *SHContract) CompleteShipment(ctx contractapi.TransactionContextInterface) error {
	// logger.Infof("Run UpdateKls function with args: %+q.", args)
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 3 {

	}

	shipmentId := args[0]
	emisiKarbon, _ := strconv.ParseFloat(args[1], 64)
	approver := args[2]

	perjalanan, err := getShipmentStateById(ctx, shipmentId)
	if err != nil {
		return err
	}

	perjalanan.Status = "Completed"
	perjalanan.WaktuSampai = time.Now().Format(time.RFC3339)
	perjalanan.EmisiKarbon = emisiKarbon
	perjalanan.Approver = approver

	perjalananJSON, err := json.Marshal(perjalanan)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(shipmentId, perjalananJSON)
	if err != nil {
	}

	return err
}

func isShipmentExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	perjalananJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return perjalananJSON != nil, nil
}
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Perjalanan, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var perjalananList []*Perjalanan

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
		}

		var perjalanan Perjalanan
		err = json.Unmarshal(queryResult.Value, &perjalanan)
		if err != nil {
		}
		perjalananList = append(perjalananList, &perjalanan)
	}

	return perjalananList, nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *SHContract) ReadAllShipment(ctx contractapi.TransactionContextInterface) ([]*Perjalanan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 0 {

	}

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf(err.Error())
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

func (s *SHContract) GetShipmentsByPerusahaan(ctx contractapi.TransactionContextInterface, idPerusahaan string) ([]*Perjalanan, error) {
    queryString := fmt.Sprintf(`{"selector":{"idPerusahaan":"%s"}}`, idPerusahaan)

    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return nil, fmt.Errorf("failed to execute query: %v", err)
    }
    defer resultsIterator.Close()

    return constructQueryResponseFromIterator(resultsIterator)
}

func (s *SHContract) GetShipmentsNeedApprovalByDivisiPenerima(ctx contractapi.TransactionContextInterface, idDivisiPenerima string) ([]*Perjalanan, error) {
    queryString := fmt.Sprintf(`{"selector":{"idDivisiPenerima":"%s", "status":"Need Approval"}}`, idDivisiPenerima)

    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return nil, fmt.Errorf("failed to execute query: %v", err)
    }
    defer resultsIterator.Close()

    return constructQueryResponseFromIterator(resultsIterator)
}

func (s *SHContract) GetAllSHByDivisiPengirim(ctx contractapi.TransactionContextInterface) ([]*Perjalanan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]
	queryString := fmt.Sprintf(`{"selector":{"idDivisiPengirim":"%s"}}`, args[0])
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}
	var scList []*Perjalanan


	for _, sc := range queryResult {
		scList = append(scList, sc)
	}
	return scList, nil
}

func (s *SHContract) GetAllSHByDivisiPenerima(ctx contractapi.TransactionContextInterface) ([]*Perjalanan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]
	queryString := fmt.Sprintf(`{"selector":{"idDivisiPenerima":"%s"}}`, args[0])
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}
	var scList []*Perjalanan


	for _, sc := range queryResult {
		scList = append(scList, sc)
	}
	return scList, nil
}

func (s *SHContract) GetAllSHByVehicle(ctx contractapi.TransactionContextInterface) ([]*Perjalanan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]
	queryString := fmt.Sprintf(`{"selector":{"idTransportasi":"%s"}}`, args[0])
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}
	var scList []*Perjalanan


	for _, sc := range queryResult {
		scList = append(scList, sc)
	}
	return scList, nil
}

func (s *SHContract) GetAllSHByCompany(ctx contractapi.TransactionContextInterface) ([]*Perjalanan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]
	queryString := fmt.Sprintf(`{"selector":{"idPerusahaan":"%s"}}`, args[0])
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}
	var scList []*Perjalanan


	for _, sc := range queryResult {
		scList = append(scList, sc)
	}
	return scList, nil
}

func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*Perjalanan, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("ER32", err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

func (s *SHContract) GetShipmentById(ctx contractapi.TransactionContextInterface) (*PerjalananResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	perjalanan, err := getShipmentStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	PerjalananResult, err := getCompleteDataShipment(ctx, perjalanan)
	if err != nil {
		return nil, err
	}

	return PerjalananResult, nil
}

func (s *SHContract) GetShipmentByIdNotFull(ctx contractapi.TransactionContextInterface) (*Perjalanan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	perjalanan, err := getShipmentStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	

	return perjalanan, nil
}

func getCompleteDataShipment(ctx contractapi.TransactionContextInterface, perjalanan *Perjalanan) (*PerjalananResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var PerjalananResult PerjalananResult

	PerjalananResult.ID = perjalanan.ID
	PerjalananResult.IdSupplyChain = perjalanan.IdSupplyChain
	PerjalananResult.Status = perjalanan.Status
	PerjalananResult.WaktuBerangkat = perjalanan.WaktuBerangkat
	PerjalananResult.WaktuSampai = perjalanan.WaktuSampai
	PerjalananResult.BeratMuatan = perjalanan.BeratMuatan
	PerjalananResult.EmisiKarbon = perjalanan.EmisiKarbon
	divPenerima, err := getDivById(ctx, perjalanan.IdDivisiPenerima)
	if err!=nil {
		return nil, err
	}
	PerjalananResult.DivisiPenerima = divPenerima

	divPengirim, err := getDivById(ctx, perjalanan.IdDivisiPengirim)
	if err!=nil {
		return nil, err
	}
	PerjalananResult.DivisiPengirim = divPengirim

	vehicle, err := getVeById(ctx, perjalanan.IdTransportasi)
	if err!=nil {
		return nil, err
	}
	PerjalananResult.Transportasi = vehicle
	PerjalananResult.Approvers = perjalanan.Approver
	HistoryTxIds, err := getPELastTxIdById(ctx, perjalanan.ID)
	if err != nil {
		return nil, err
	}
	PerjalananResult.TxId = HistoryTxIds 

	return &PerjalananResult, nil
}

func getPELastTxIdById(ctx contractapi.TransactionContextInterface, id string) (string, error) {
	// logger.Infof("Run getIjzAddApprovalTxIdById function with id: %s.", id)

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return "", fmt.Errorf(err.Error())
	}
	defer resultsIterator.Close()

	response, err := resultsIterator.Next()
	
	if err != nil {
		return "", fmt.Errorf(err.Error())
	}
	var sh Perjalanan
	err = json.Unmarshal([]byte(response.Value), &sh)
	if err != nil {
		return  "", fmt.Errorf(ER34, err)
	}
	if (sh.Approver == "") {
		return "", nil
	}

	return response.TxId, nil
}

func getVeById(ctx contractapi.TransactionContextInterface, idVehicle string) (*Vehicle, error) {
	// logger.Infof("Run getSpById function with idSp: '%s'.", idSp)

	params := []string{"GetVehicleById", idVehicle}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode("vecontract", queryArgs, "carbonchannel")
	if response.Status != shim.OK {
		return nil, fmt.Errorf(ER37, "vecontract", response.Message)
	}

	var ve Vehicle
	err := json.Unmarshal([]byte(response.Payload), &ve)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &ve, nil
}

func getDivById(ctx contractapi.TransactionContextInterface, idDivisi string) (*Divisi, error) {
	// logger.Infof("Run getSpById function with idSp: '%s'.", idSp)

	params := []string{"GetDivisiById", idDivisi}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode("divcontract", queryArgs, "carbonchannel")
	if response.Status != shim.OK {
		return nil, fmt.Errorf(ER37, "divcontract", response.Message)
	}

	var div Divisi
	err := json.Unmarshal([]byte(response.Payload), &div)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &div, nil
}
func getShipmentStateById(ctx contractapi.TransactionContextInterface, id string) (*Perjalanan, error) {

	perjalananJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	}
	if perjalananJSON == nil {
	}

	var perjalanan Perjalanan
	err = json.Unmarshal(perjalananJSON, &perjalanan)
	if err != nil {
	}

	return &perjalanan, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *SHContract) UpdateShipment(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 11 {
	}

	id := args[0]
	idSupplyChain := args[1]
	divisiPengirim := args[2]
	divisiPenerima := args[3]
	status := args[4]
	waktuBerangkat := args[5]
	waktuSampai := args[6]
	transportasi := args[7]
	beratMuatanstr := args[8]
	emisiKarbonstr := args[9]

	perjalanan, err := getShipmentStateById(ctx, id)
	if err != nil {
		return err
	}

	emisiKarbon, err := strconv.ParseFloat(emisiKarbonstr, 64)
	if err != nil {
	}

	beratMuatan, err := strconv.Atoi(beratMuatanstr)
	if err != nil {
	}

	perjalanan.IdSupplyChain = idSupplyChain
	perjalanan.IdDivisiPenerima = divisiPengirim
	perjalanan.IdDivisiPenerima = divisiPenerima
	perjalanan.Status = status
	perjalanan.WaktuBerangkat = waktuBerangkat
	perjalanan.WaktuSampai = waktuSampai
	perjalanan.IdTransportasi = transportasi
	perjalanan.BeratMuatan = beratMuatan
	perjalanan.EmisiKarbon = emisiKarbon

	perjalananJSON, err := json.Marshal(perjalanan)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, perjalananJSON)
	if err != nil {
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
func (s *SHContract) DeleteShipment(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}

	id := args[0]

	exists, err := isShipmentExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
	}

	err = ctx.GetStub().DelState(id)
	if err != nil {
	}

	return err
}

func (s *SHContract) DeleteAllShipment(ctx contractapi.TransactionContextInterface) error {
	
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return err
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		key, _ := resultsIterator.Next()
		err := ctx.GetStub().DelState(key.Key)
		if err != nil {
			return err
		}
	}
	return nil
}

