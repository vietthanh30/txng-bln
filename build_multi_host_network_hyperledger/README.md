# Build Multi-Host Network (BMHN)

## Network Topology
1. A Certificate Authority (CA) — **PC1**
2. An Orderer — **PC1**
3. 1 PEER (peer0) on — **PC1**
4. 1 PEER (peer1) on — **PC2**
5. CLI on — **PC2**

## Prerequisite
* Install all env https://github.com/vietthanh30/txng-bln

## Install docker swarm
* Initialize a swarm: (docker swarm documentation for more information)
```
# docker swarm init
```
* Join the swarm with the other host as a manager (PC1 will create swarm and PC2 will join it)
  * PC1:
  ```
  # docker swarm join-token manager
  ```
  * It will output something like this
  ```
  docker swarm join — token SWMTKN-1–3as8cvf3yxk8e7zj98954jhjza3w75mngmxh543llgpo0c8k7z-61zyibtaqjjimkqj8p6t9lwgu 172.16.0.153:237
  ```
  * We will copy it(the one on your terminal, not the one above) and execute it on PC2 terminal to make it join PC1
* Create a network (“my-net” in my case) — **PC1**
```
$ docker network create --attachable --driver overlay my-net
```

## Setting /etc/hosts
* Edit file **/etc/hosts** PC1
```
# nano /etc/hosts

xxx.xxx.xxx.xxx peer0.org1.example.com
xxx.xxx.xxx.xxx peer1.org1.example.com
xxx.xxx.xxx.xxx orderer.example.com
xxx.xxx.xxx.xxx ca.example.com

# source /etc/hosts
```
* Edit file **/etc/hosts** PC2
```
# nano /etc/hosts

xxx.xxx.xxx.xxx peer0.org1.example.com
xxx.xxx.xxx.xxx peer1.org1.example.com
xxx.xxx.xxx.xxx orderer.example.com
xxx.xxx.xxx.xxx ca.example.com

# source /etc/hosts
```


## Setting with Multi Host
* Download the latest production release
```
# curl -sSL http://bit.ly/2ysbOFE | bash -s 1.4.4
#You can replace 1.4.4 with 2.0.0 if you want to install Fabric 2.0.0
```
* Clone this repo on both the PCs i.e PC1 and PC2
```
# git clone https://github.com/vietthanh30/txng-bln.git
```
* Generate Network Artifacts (Crypto Material) — PC1
```
# cd ROOT/fabric-samples
# cp -a ROOT/txng-bln/build_multi_host_network_hyperledger ROOT/fabric-samples
# cd ROOT/fabric-samples/build_multi_host_network_hyperledger
# ./bmhn.sh
```
* This will generate network artifacts for you in ‘crypto-config’ and ‘channel-artifacts’ folder. You must copy these folders on PC2 so that both the projects will have same crypto material. **It is important that both the PCs must have same crypto material otherwise the network will not communicate.**


## Setting up the Network

### On PC1:

#### 1. CA Server:
* You will execute this command on PC1. before you do so, replace {put the name of secret key} with the name of the secret key. You can find it under **/crypto-config/peerOrganizations/org1.example.com/ca/**
```
# docker run --rm -it --network="my-net" --name ca.example.com -p 7054:7054 -e FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server -e FABRIC_CA_SERVER_CA_NAME=ca.example.com -e FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org1.example.com-cert.pem -e FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/{put the name of secret key} -v $(pwd)/crypto-config/peerOrganizations/org1.example.com/ca/:/etc/hyperledger/fabric-ca-server-config -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=hyp-net hyperledger/fabric-ca sh -c 'fabric-ca-server start -b admin:adminpw -d'
```
* Example
```
# docker run -d --rm -it --network="my-net" --name ca.example.com -p 7054:7054 -e FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server -e FABRIC_CA_SERVER_CA_NAME=ca.example.com -e FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org1.example.com-cert.pem -e FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/a65f7c4c58108df788d67d94af814b8f37f920c0cd8b38ac2e0bc179a57f5f3f_sk -v $(pwd)/crypto-config/peerOrganizations/org1.example.com/ca/:/etc/hyperledger/fabric-ca-server-config -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=hyp-net hyperledger/fabric-ca sh -c 'fabric-ca-server start -b admin:adminpw -d'
```
* Check runing CA
```
# docker ps 
```

#### 2. Orderer
* Execute this command to spawn up the orderer on PC1
```
# docker run --rm -it --network="my-net" --name orderer.example.com -p 7050:7050 -e ORDERER_GENERAL_LOGLEVEL=debug -e ORDERER_GENERAL_LISTENADDRESS=0.0.0.0 -e ORDERER_GENERAL_LISTENPORT=7050 -e ORDERER_GENERAL_GENESISMETHOD=file -e ORDERER_GENERAL_GENESISFILE=/var/hyperledger/orderer/orderer.genesis.block -e ORDERER_GENERAL_LOCALMSPID=OrdererMSP -e ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp -e ORDERER_GENERAL_TLS_ENABLED=false -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net -v $(pwd)/channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block -v $(pwd)/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp:/var/hyperledger/orderer/msp -w /opt/gopath/src/github.com/hyperledger/fabric hyperledger/fabric-orderer orderer
```
* Check runing orderer
```
# docker ps
```

#### 3. CouchDB 0 — for Peer 0
* This command will spawn a couchDB instance that will be used by peer0 for storing peer ledger.
```
# docker run --rm -it --network="my-net" --name couchdb0 -p 5984:5984 -e COUCHDB_USER= -e COUCHDB_PASSWORD= -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net hyperledger/fabric-couchdb
```
* Check runing couchDB 0
```
# docker ps
```

#### 4. Peer 0
* And now we execute this command to spawn peer0
```
# docker run --rm -it --link orderer.example.com:orderer.example.com --network="my-net" --name peer0.org1.example.com -p 7051:7051 -p 8053:7053 -e CORE_LEDGER_STATE_STATEDATABASE=CouchDB -e CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb0:5984 -e CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME= -e CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD= -e CORE_PEER_ADDRESSAUTODETECT=true -e CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock -e CORE_LOGGING_LEVEL=DEBUG -e CORE_PEER_NETWORKID=peer0.org1.example.com -e CORE_NEXT=true -e CORE_PEER_ENDORSER_ENABLED=true -e CORE_PEER_ID=peer0.org1.example.com -e CORE_PEER_PROFILE_ENABLED=true -e CORE_PEER_COMMITTER_LEDGER_ORDERER=orderer.example.com:7050 -e CORE_PEER_GOSSIP_IGNORESECURITY=true -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net -e CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org1.example.com:7051 -e CORE_PEER_TLS_ENABLED=false -e CORE_PEER_GOSSIP_USELEADERELECTION=false -e CORE_PEER_GOSSIP_ORGLEADER=true -e CORE_PEER_LOCALMSPID=Org1MSP -v /var/run/:/host/var/run/ -v $(pwd)/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp:/etc/hyperledger/fabric/msp -w /opt/gopath/src/github.com/hyperledger/fabric/peer hyperledger/fabric-peer peer node start
```
* Check runing peer0
```
# docker ps
```


### On PC2:
* The following below command will be executed on PC2

#### 5. CouchDB 1 — for Peer 1
* This command will spawn a couchDB instance that will be used by peer1 for storing peer ledger. We will execute this in a separate terminal on PC2
```
# docker run --rm -it --network="my-net" --name couchdb1 -p 6984:5984 -e COUCHDB_USER= -e COUCHDB_PASSWORD= -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net hyperledger/fabric-couchdb
```

#### 6. Peer 1
* We will execute this in a separate terminal on PC2 to spawn peer1
```
# docker run --rm -it --network="my-net" --link orderer.example.com:orderer.example.com --link peer0.org1.example.com:peer0.org1.example.com --name peer1.org1.example.com -p 7051:7051 -p 9053:7053 -e CORE_LEDGER_STATE_STATEDATABASE=CouchDB -e CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb1:5984 -e CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME= -e CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD= -e CORE_PEER_ADDRESSAUTODETECT=true -e CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock -e CORE_LOGGING_LEVEL=DEBUG -e CORE_PEER_NETWORKID=peer1.org1.example.com -e CORE_NEXT=true -e CORE_PEER_ENDORSER_ENABLED=true -e CORE_PEER_ID=peer1.org1.example.com -e CORE_PEER_PROFILE_ENABLED=true -e CORE_PEER_COMMITTER_LEDGER_ORDERER=orderer.example.com:7050 -e CORE_PEER_GOSSIP_ORGLEADER=true -e CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer1.org1.example.com:7051 -e CORE_PEER_GOSSIP_IGNORESECURITY=true -e CORE_PEER_LOCALMSPID=Org1MSP -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net -e CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org1.example.com:7051 -e CORE_PEER_GOSSIP_USELEADERELECTION=false -e CORE_PEER_TLS_ENABLED=false -v /var/run/:/host/var/run/ -v $(pwd)/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp:/etc/hyperledger/fabric/msp -w /opt/gopath/src/github.com/hyperledger/fabric/peer hyperledger/fabric-peer peer node start
```

#### 7. CLI
* Execute the below script in a different terminal on PC2 to spawn CLI
```
# docker run --rm -it --network="my-net" --name cli --link orderer.example.com:orderer.example.com --link peer0.org1.example.com:peer0.org1.example.com --link peer1.org1.example.com:peer1.org1.example.com -p 12051:7051 -p 12053:7053 -e GOPATH=/opt/gopath -e CORE_PEER_LOCALMSPID=Org1MSP -e CORE_PEER_TLS_ENABLED=false -e CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock -e CORE_LOGGING_LEVEL=DEBUG -e CORE_PEER_ID=cli -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 -e CORE_PEER_NETWORKID=cli -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net  -v /var/run/:/host/var/run/ -v $(pwd)/chaincode/:/opt/gopath/src/github.com/hyperledger/fabric/examples/chaincode/go -v $(pwd)/crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ -v $(pwd)/scripts:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/ -v $(pwd)/channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts -w /opt/gopath/src/github.com/hyperledger/fabric/peer hyperledger/fabric-tools /bin/bash -c './scripts/script.sh'
```


## Testing the Network

### Step 1. Bin/Bash CLI — PC2
* We will again spawn the cli container on PC2, but this time we will exec into it
```
# docker run --rm -it --network="my-net" --name cli --link orderer.example.com:orderer.example.com --link peer0.org1.example.com:peer0.org1.example.com --link peer1.org1.example.com:peer1.org1.example.com -p 12051:7051 -p 12053:7053 -e GOPATH=/opt/gopath -e CORE_PEER_LOCALMSPID=Org1MSP -e CORE_PEER_TLS_ENABLED=false -e CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock -e CORE_LOGGING_LEVEL=DEBUG -e CORE_PEER_ID=cli -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 -e CORE_PEER_NETWORKID=cli -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net  -v /var/run/:/host/var/run/ -v $(pwd)/chaincode/:/opt/gopath/src/github.com/hyperledger/fabric/examples/chaincode/go -v $(pwd)/crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ -v $(pwd)/scripts:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/ -v $(pwd)/channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts -w /opt/gopath/src/github.com/hyperledger/fabric/peer hyperledger/fabric-tools /bin/bash
```
* You must see this after executing the command
```
# root@a14d67c2dbb5:/opt/gopath/src/github.com/hyperledger/fabric/peer#
```
* Now that you have entered into CLI container, we will execute the commands to instantiate, invoke and query the chaincode in this container

### Step 2. Instantiate Chaincode on Peer0
* To instantiate the chaincode on peer0 we will need to set few environment variables first. Paste the below line in the cli terminal.
```
# Environment variables for PEER0

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_LOCALMSPID="Org1MSP"

CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

CORE_PEER_ADDRESS=peer0.org1.example.com:7051
```
* After that we will initialize chaincode. Execute the below command to instantiate the chaincode that was installed as a part of step 1.
```
# peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n mycc -v 1.0 -c '{"Args":["init","a","100","b","200"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
```
* This will instantiate the chiancode and populate it with a =100 and b = 200.

### Step 3. Query the Chaincode on Peer1
* To query the chaincode on peer1 we will need to set few environment variables first. Paste the below line in the cli terminal on PC2
```
# Environment variables for PEER1
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_LOCALMSPID="Org1MSP"

CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

CORE_PEER_ADDRESS=peer1.org1.example.com:7051
```
* Let’s query for the value of a to make sure the chaincode was properly instantiated and the couch DB was populated. The syntax for query is as follows: (execute in cli terminal) and wait for a while
```
# peer chaincode query -C mychannel -n mycc -c '{"Args":["query","a"]}'
```
* It will bring
```
Query Result: 100
```

### Step 4. Invoke the Chaincode on Peer0
* To invoke the chaincode on peer0 we will need to set a few environment variables first. Paste the below line in the cli terminal on PC2
```
# Environment variables for PEER0
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_LOCALMSPID="Org1MSP"

CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

CORE_PEER_ADDRESS=peer0.org1.example.com:7051
```
* Now let’s move 10 from a to b. This transaction will cut a new block and update the couch DB. The syntax for invoking is as follows: (execute in cli terminal on PC2)
```
# peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"Args":["invoke","a","b","10"]}'
```

### Step 5. Query the Chaincode
* Let’s confirm that our previous invocation executed properly. We initialized the key a with a value of 100 and just removed 10 with our previous invocation. Therefore, a query against a should reveal 90. The syntax for the query is as follows. (we are querying on peer0 so no need to change the environment variables)
```
# be sure to set the -C and -n flags appropriately
# peer chaincode query -C mychannel -n mycc -c '{"Args":["query","a"]}'
```
* We should see the following:
```
Query Result: 90
```

## Install txng_bln chaincode
* SSH to CLI
```
# docker run --rm -it --network="my-net" --name cli --link orderer.example.com:orderer.example.com --link peer0.org1.example.com:peer0.org1.example.com --link peer1.org1.example.com:peer1.org1.example.com -p 12051:7051 -p 12053:7053 -e GOPATH=/opt/gopath -e CORE_PEER_LOCALMSPID=Org1MSP -e CORE_PEER_TLS_ENABLED=false -e CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock -e CORE_LOGGING_LEVEL=DEBUG -e CORE_PEER_ID=cli -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 -e CORE_PEER_NETWORKID=cli -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp -e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=my-net  -v /var/run/:/host/var/run/ -v $(pwd)/chaincode/:/opt/gopath/src/github.com/hyperledger/fabric/examples/chaincode/go -v $(pwd)/crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ -v $(pwd)/scripts:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/ -v $(pwd)/channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts -w /opt/gopath/src/github.com/hyperledger/fabric/peer hyperledger/fabric-tools /bin/bash
```
* Install chaincode
```
# peer chaincode install -n txngbln_chaincode -v 1.0 -l node -p /opt/gopath/src/github.com/hyperledger/fabric/examples/chaincode/txng-bln/source/txng_bln_cc
# peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n txngbln_chaincode -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
```
* Invoke and Query chaincode
```
# peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n txngbln_chaincode -c '{"function":"addBlock","Args":["Alice","68"]}'
# peer chaincode query -C mychannel -n txngbln_chaincode -c '{"function":"queryBlockById","Args":["Alice"]}'
```



# Refs
* https://wahabjawed.medium.com/hyperledger-fabric-on-multiple-hosts-a33b08ef24f
* The directions for using this are documented at my article at Medium.
["Hyperledger Fabric on Multiple Hosts"](https://medium.com/@wahabjawed/hyperledger-fabric-on-multiple-hosts-a33b08ef24f)
