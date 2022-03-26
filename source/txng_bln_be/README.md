# txng_bln_be

## API design
* We are going to define four APIs. They are
 * *GET /api/query/allblock/startKey/endKey* return all cars
```
API: http://IP:8080/api/query/allblock/a/z
Method: GET
Response:
{
    "status": 200,
    "data": {
        "startKey": "a",
        "endKey": "z",
        "blockData": "[{\"Key\":\"a1\",\"Record\":{\"id\":\"a1\",\"title\":\"2\",\"date\":\"2022/03/05\",\"description\":\"2222\",\"author\":\"hainv\"}},{\"Key\":\"a2\",\"Record\":{\"id\":\"a2\",\"title\":\"2\",\"date\":\"2022/03/05\",\"description\":\"2222\",\"author\":\"hainv\"}},{\"Key\":\"a3\",\"Record\":{\"id\":\"a3\",\"title\":\"2\",\"date\":\"2022/03/05\",\"description\":\"2222\",\"author\":\"hainv\"}}]"
    },
    "msg": "successfully"
}
```

 * *GET /api/query/blockId/:id* return the car record of blockId specified
```
API: http://IP:8080/api/query/blockId/1
Method: GET
Response:
{
    "status": 200,
    "data": {
        "key": "a1",
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
	"id":"a1",
	"title":"1",
	"date":"2022/03/05",
	"description":"111111",
	"author":"hainv"
}
Response:
 {
    "status": 200,
    "data": {
        "key": "a1",
        "blockData": {
            "id": "a1",
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

## Run server with PM2
* Install pm2
```
# npm install pm2 -g
```
* Run server
```
# pm2 start npm --name "txng_bln_be" -- start
```

# Refs
* https://kctheservant.medium.com/an-implementation-of-api-server-for-hyperledger-fabric-network-8764c79f1a87
* https://www.skcript.com/svr/setting-up-restful-api-server-for-hyperledger-fabric-with-nodejs-sdk/
* https://medium.com/@yvarunteja/custom-fabric-block-explorer-using-react-js-and-node-js-280210ec69cc
* https://medium.datadriveninvestor.com/walkthrough-of-hyperledger-fabric-client-application-aae5222bdfd3