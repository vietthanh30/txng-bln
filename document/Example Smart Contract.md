# Xây dựng một smart contract với hyperledger

## Mark Contract
* Tạo một thư mục với tên *markcontract*
* Khởi tạo project nodejs
* File package.json
```
{
    "name": "test-chaincode",
    "version": "1.0.0",
    "description": "My first Exciting Node.js Chaincode on Hyperledger Fabric",
    "main": "index.js",
    "engines": {
        "node": ">=8",
        "npm": ">=5"
    },
    "scripts": {
        "lint": "eslint .",
        "pretest": "npm run lint",
        "test": "nyc mocha --recursive",
        "start": "fabric-chaincode-node start"
    },
    "engineStrict": true,
    "author": "Hyperledger",
    "license": "Apache-2.0",
    "dependencies": {
        "fabric-contract-api": "~1.4.0",
        "fabric-shim": "~1.4.0"
    },
    "devDependencies": {
        "chai": "^4.1.2",
        "eslint": "^4.19.1",
        "mocha": "^5.2.0",
        "nyc": "^12.0.2",
        "sinon": "^6.0.0",
        "sinon-chai": "^3.2.0"
    },
    "nyc": {
        "exclude": [
            "coverage/**",
            "test/**"
        ],
        "reporter": [
            "text-summary",
            "html"
        ],
        "all": true,
        "check-coverage": true,
        "statements": 100,
        "branches": 100,
        "functions": 100,
        "lines": 100
    }
}
```
* Cài đặt thư viện
```
$ npm install fabric-contract-api fabric-shim --save
```
* Deploy một smart contract
```
cp -a markcontract /root/blockchain/fabric-samples/chaincode
```
* Cài đặt chaincode
```
# peer chaincode install -n mymark -v 1.0 -p "/opt/gopath/src/github.com/chaincode/newcc" -l "node"
```

peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mymark -l node -v 1.0 -c '{"Args":[]}' -P "AND ('Org1MSP.peer')"


peer chaincode query -o orderer.example.com:7050 -C mychannel -n mychaincode99 -c '{"function":"queryMarks","Args":["Alice"]}'


export CHANNEL_NAME=mychannel101

+ peer chaincode instantiate -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n mymark -l node -v 1.0 -c '{"Args":[]}' -P "AND ('Org1MSP.peer','Org2MSP.peer')"



mychaincode201


peer chaincode install -n mychaincode201 -v 1.0 -p "/opt/gopath/src/github.com/chaincode/newcc" -l "node"

peer chaincode install -n mycc -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/chaincode_example02/node/






peer chaincode install -n mychaincode201 -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/newcc/


peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mychaincode201 -l node -v 1.0 -c '{"Args":[]}' -P "AND ('Org1MSP.peer','Org2MSP.peer')"


peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mychaincode201 -l node -v 1.0 -c '{"function":"addMarks","Args":["Alice","68","84","89"]}' -P "AND ('Org1MSP.peer','Org2MSP.peer')"



# Refs
* https://medium.com/coinmonks/start-developing-hyperledger-fabric-chaincode-in-node-js-e63b655d98db
* https://github.com/Salmandabbakuti/chaincode-essentials
* https://nabeelvalley.co.za/docs/blockchain/fabric-via-docs-1/#query