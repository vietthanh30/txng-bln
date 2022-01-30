# Xây dựng một smart contract với hyperledger

## Prerequisites
* Install by link: https://github.com/vietthanh30/txng-bln

## Install chaincode
* Copy chaincode
```
# git pull origin master
# cp -a example1 /root/blockchain/fabric-samples/chaincode
```
* SSH docker
```
# docker exec -it cli bash
```
* Set ENV
```
# CHANNEL_NAME=mychannel
```
* Install chaincode
```
# peer chaincode install -n mychaincode1 -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/example1/
```
* Instantiate chaincode
```
# peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mychaincode1 -l node -v 1.0 -c '{"Args":["init","Alice", "100"]}' -P "AND ('Org1MSP.peer','Org2MSP.peer')"
```
* Query data
```
# peer chaincode query -C $CHANNEL_NAME -n mychaincode1 -c '{"Args":["query","Alice"]}'
```
* Insert data
```
peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mychaincode1 --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"Args":["invoke","hainv","10"]}'
```


# Refs
* https://medium.com/coinmonks/start-developing-hyperledger-fabric-chaincode-in-node-js-e63b655d98db
* https://github.com/Salmandabbakuti/chaincode-essentials
* https://nabeelvalley.co.za/docs/blockchain/fabric-via-docs-1/#query

