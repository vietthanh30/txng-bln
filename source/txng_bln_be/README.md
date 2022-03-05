# txng_bln_be

## API design
* We are going to define four APIs. They are
 * *GET /api/queryallblock* return all cars

 * *GET /api/query/blockId/:id* return the car record of blockId specified
```
API: http://IP:8080/api/query/blockId/1
Method: GET
Response:
{
    "status": 200,
    "data": {
        "key": "1",
        "blockData": "{\"id\":\"1\",\"title\":\"1\",\"date\":\"2022/03/05\",\"description\":\"111111\",\"author\":\"hainv\"}"
    },
    "msg": "successfully"
}
```
 * *POST /api/addblock/* add a new car record with detail specified in body
```
API: http://IP:8080/api/addblock
Method: POST
Request body:
{
	"id":"1",
	"title":"1",
	"date":"2022/03/05",
	"description":"111111",
	"author":"hainv"
}
Response:
 {
    "status": 200,
    "data": {
        "key": "1",
        "blockData": {
            "id": "1",
            "title": "1",
            "date": "2022/03/05",
            "description": "111111",
            "author": "hainv"
        }
    },
    "msg": "successfully"
}
```

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