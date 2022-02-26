# txng_bln_cc

## Prerequisite
* Install all env https://github.com/vietthanh30/txng-bln

## Build chaincode txng_bln_cc
* Down all network
```
# cd ROOT/fabric-samples/first-network
# ./byfn.sh down
```
* Init netowrk
```
# cd ROOT/fabric-samples/first-network
# ./byfn.sh generate
# ./byfn.sh up
```
* Install chaincode
```
# cp -a txng_bln_cc /root/blockchain/fabric-samples/chaincode
```
* Install chaincode
```
# docker exec -it cli bash
# CHANNEL_NAME=mychannel
```
* Install chaincode txngbln_chaincode in peer1
```
# peer chaincode install -n txngbln_chaincode -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/txng_bln_cc
# peer chaincode instantiate -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n txngbln_chaincode -l node -v 1.0 -c '{"Args":[]}' -P 'AND ('\''Org1MSP.peer'\'','\''Org2MSP.peer'\'')'
```
* Install chaincode txngbln_chaincode in peer2
```
# CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp 
# CORE_PEER_ADDRESS=peer0.org2.example.com:9051 
# CORE_PEER_LOCALMSPID="Org2MSP" 
# CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 
# peer chaincode install -n txngbln_chaincode -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/txng_bln_cc
```
* Add data to block
```
# peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n txngbln_chaincode --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"addBlock","Args":["Alice","68"]}'
```
* Query data
```
# peer chaincode query -C $CHANNEL_NAME -n txngbln_chaincode -c '{"function":"queryBlockById","Args":["Alice"]}'
```

## Logs of chaincode
* Run command check logs chaincode
```
# docker logs -f <CONTAINER_ID>
```


# Refs
* https://medium.com/coinmonks/start-developing-hyperledger-fabric-chaincode-in-node-js-e63b655d98db
* https://github.com/Salmandabbakuti/chaincode-essentials/blob/master/client/start.sh
* https://github.com/Salmandabbakuti/chaincode-essentials/blob/master/chaincode/newcc/logic.js

