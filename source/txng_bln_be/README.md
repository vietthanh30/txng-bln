# txng_bln_be

## API design
* We are going to define four APIs. They are
 * *GET /api/queryallblock* return all cars
 * *GET /api/query/blockId* return the car record of blockId specified
* *POST /api/addblock/* add a new car record with detail specified in body

## Enroll admin
* Run command
```
# cd ROOT/txng-bln/source/txng_bln_be/src
# node enrollAdmin.js
```

# Refs
* https://kctheservant.medium.com/an-implementation-of-api-server-for-hyperledger-fabric-network-8764c79f1a87
* https://www.skcript.com/svr/setting-up-restful-api-server-for-hyperledger-fabric-with-nodejs-sdk/
* https://medium.com/@yvarunteja/custom-fabric-block-explorer-using-react-js-and-node-js-280210ec69cc
* https://medium.datadriveninvestor.com/walkthrough-of-hyperledger-fabric-client-application-aae5222bdfd3