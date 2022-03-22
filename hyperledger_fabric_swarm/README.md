# Hyperledger Fabric Swarm

## Prerequisites

### git
* Install git
```
$ sudo apt-get install git
```
* Check version
```
$ git --version
```

### curl
* Install curl
```
$ sudo apt-get install curl
```
* Check version curl
```
$ curl --version
```

### docker/docker-compose
* Install docker/docker-compose
```
$ sudo apt-get install docker.io docker-compose
```
* Check version docker/docker-compose
```
$ docker --version
$ docker-compose --version
```

### go
* Install go
```
$ wget https://dl.google.com/go/go1.13.linux-amd64.tar.gz
$ sudo tar -C /usr/local -xzf go1.13.linux-amd64.tar.gz
```
* Set path
```
# nano ~/.profile
```
* Add to file
```
export PATH=$PATH:/usr/local/go/bin
```
* Check version go
```
# source ~/.profile
# go version
```

### nodejs
* Install nodejs
```
# apt install nodejs
```
* Check version nodejs
```
# node --version
```
* Install nvm
```
# curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
# source ~/.profile
```
* Install nodejs version
```
# nvm install 14.*
```

### python
* Install python
```
$ sudo apt-get install python
```
* Check python version
```
$ python --version
```

### fabric samples
* Download the latest production release
```
# curl -sSL http://bit.ly/2ysbOFE | bash -s 1.4.4
#You can replace 1.4.4 with 2.0.0 if you want to install Fabric 2.0.0
```

## Docker swarm
* Prepare your nodes
```
# sudo vim /etc/hosts
```
* Add the following content to the file
```
192.168.1.10	manager
192.168.1.11	worker-01
192.168.1.12	worker-02
```
* Docker daemon should be started. Confirm the status by running the below command:
```
# systemctl status docker
```
* Create docker swarm cluster
```
# HOST_IP=172.105.114.120
# sudo docker swarm init --advertise-addr $HOST_IP
```
* Join worker nodes to the cluster
```
# docker swarm join --token SWMTKN-1-3i30njf0bn1m33w49853d31vdjlp4698jc2rfs7w9uimh03t81-62ykv85s51sxqoo6b9y9fd4u9 172.105.114.120:2377
```
* Show node list
```
# docker node ls
```
* Create overlay network
```
# docker network create --attachable --driver overlay --subnet=10.200.1.0/24 hyperledger-ov
```

## Build Hyperledger Fabric with Docker Swarm
* Intall yarn
```
# npm install --global yarn
```
* Generate the artifacts
```
# go get  gopkg.in/yaml.v2
# cd ROOT/txng-bln/hyperledger_fabric_swarm
# yarn genConfig -domain example.com -Kafka 3 -Orderer 2 -Zookeeper 3 -Orgs 2 -Peer 1 -Tag :latest
# yarn genConfig -domain example.com -Orderer 1 -Orgs 2 -Peer 2 -Tag :latest
# yarn genArtifacts -c mychannel -d example.com -o 2
```
* On Master host
```
# ./run.sh
```
* Deploy hyperledger fabric. Attach to cli container
```
# docker exec -it $(docker ps --format "table {{.ID}}" -f "label=com.docker.stack.namespace=hyperledger-cli" | tail -1) bash
```
* Create a channel
```
# export CHANNEL_NAME=mychannel
# export ORG=example.com
# peer channel create -o orderer0.${ORG}:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/$ORG/orderers/orderer0.${ORG}/msp/tlscacerts/tlsca.${ORG}-cert.pem
```
* Join a channel
```
# peer channel join -b mychannel.block 
# peer channel list
```


## Install Example Chaincode
* Install & Initiate Chaincode
```
# peer chaincode install -n mycc -v 1.0 -p github.com/hyperledger/fabric/examples/chaincode/go/sacc
# peer chaincode instantiate -o orderer0.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer0.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mycc -v 1.0 -c '{"Args":["a", "100"]}'
```
* Query & Invoke Chaincode
```
# peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'
# peer chaincode invoke -o orderer0.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer0.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mycc -c '{"Args":["set","a","10"]}'
# peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'
```



## Install & Initiate Txng-Bln Chaincode
* Copy txng_bln_cc to folder chaincode
```
# cp -a source/txng_bln_cc hyperledger_fabric_swarm/chaincode/
# git clone https://github.com/vietthanh30/txng-bln.git
```
* Attach to cli container
```
# docker exec -it $(docker ps --format "table {{.ID}}" -f "label=com.docker.stack.namespace=hyperledger-cli" | tail -1) bash
```
* Install & Initiate Chaincode
```
# CHANNEL_NAME=mychannel

# peer chaincode install -n mycc1 -v 1.0 -l node -p /opt/gopath/src/github.com/hyperledger/fabric/examples/chaincode/txng-bln/source/txng_bln_cc

# peer chaincode instantiate -o orderer0.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer0.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mycc1 -v 1.0 -c '{"Args":[]}'

# peer chaincode invoke -o orderer0.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer0.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mycc1 -c '{"Args":["addBlock","hainv","68"]}'

# peer chaincode query -C $CHANNEL_NAME -n mycc1 -c '{"Args":["queryBlockById","a"]}'
```


# Refs
* https://github.com/blockchainvn/hyperledger-fabric-swarm
* https://github.com/phuctu1901/create-fabric-on-swarm
* https://computingforgeeks.com/how-to-install-docker-swarm-on-ubuntu/