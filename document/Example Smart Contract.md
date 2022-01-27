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

# Refs
* https://medium.com/coinmonks/start-developing-hyperledger-fabric-chaincode-in-node-js-e63b655d98db
* https://github.com/Salmandabbakuti/chaincode-essentials