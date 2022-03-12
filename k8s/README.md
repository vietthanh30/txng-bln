# Hyperledger Fabric K8S

## Minikube
* Update
```
# sudo apt update -y
# sudo apt upgrade -y
```
* Install Minikube dependencies
```
# sudo apt install -y curl wget apt-transport-https
```
* Download Minikube Binary
```
# wget https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
# sudo cp minikube-linux-amd64 /usr/local/bin/minikube
# sudo chmod +x /usr/local/bin/minikube
```
* Verify the minikube version
```
# minikube version
```
* Install Kubectl utility
```
# curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
# chmod +x kubectl
# sudo mv kubectl /usr/local/bin/
```
* Now verify the kubectl version
```
# kubectl version -o yaml
```
* Start the minikube
```
$ minikube start --driver=docker
```
* Run below minikube command to check status
```
# minikube status
```
* Refs:
  * https://www.linuxtechi.com/how-to-install-minikube-on-ubuntu/



## Hyperledger fabric k8s
* Setting up shared storage
```
# kubectl apply -f kubernetes/fabric-pv.yaml
# kubectl apply -f kubernetes/fabric-pvc.yaml
# kubectl apply -f kubernetes/backup-org1peer0-pv.yaml
# kubectl apply -f kubernetes/backup-org1peer0-pvc.yaml
# kubectl apply -f kubernetes/backup-org1peer1-pv.yaml
# kubectl apply -f kubernetes/backup-org1peer1-pvc.yaml
# kubectl apply -f kubernetes/backup-org2peer0-pv.yaml
# kubectl apply -f kubernetes/backup-org2peer0-pvc.yaml
# kubectl apply -f kubernetes/backup-org2peer1-pv.yaml
# kubectl apply -f kubernetes/backup-org2peer1-pvc.yaml
# kubectl apply -f kubernetes/fabric-tools.yaml
```
* Setting shared filesystem
```
# kubectl exec -it fabric-tools -- bin/bash
# root@fabric-tools: mkdir /fabric/config 
# root@fabric-tools: exit
```
* Copy files config to container
```
# kubectl cp config/configtx.yaml fabric-tools:/fabric/config/
# kubectl cp config/crypto-config.yaml fabric-tools:/fabric/config/
# kubectl cp config/chaincode/ fabric-tools:/fabric/config/
```
* Creating the necessary artifacts
```
# kubectl exec -it fabric-tools -- /bin/bash
root@fabric-tools:/# cryptogen generate --config /fabric/config/crypto-config.yaml
root@fabric-tools:/# cp -r crypto-config /fabric/
root@fabric-tools:/# exit
```
* Configtxgen
```
# kubectl exec -it fabric-tools -- /bin/bash
root@fabric-tools:/# cp /fabric/config/configtx.yaml /fabric/
root@fabric-tools:/# cd /fabric
root@fabric-tools:/# configtxgen -profile TwoOrgsOrdererGenesis -channelID $SYS_CHANNEL -outputBlock genesis.block
root@fabric-tools:/# configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
root@fabric-tools:/# configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
root@fabric-tools:/# configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
root@fabric-tools:/# exit
```
* Apply fabric CA
```
# kubectl exec -it fabric-tools -- bin/bash
root@fabric-tools:/# ls fabric/crypto-config/peerOrganizations/org1.example.com/ca/
root@fabric-tools:/# ls fabric/crypto-config/peerOrganizations/org2.example.com/ca/
```
* Change `kubernetes/org1-ca_deploy.yaml` và `kubernetes/org2-ca_deploy.yaml` đã có sãn trong repos. Thay đổi giá trị các env `FABRIC_CA_SERVER_CA_KEYFILE` và `FABRIC_CA_SERVER_TLS_KEYFILE`
* Run command apply fabric CA
```
# kubectl apply -f kubernetes/org1-ca_deploy.yaml
# kubectl apply -f kubernetes/org1-ca_svc.yaml
# kubectl apply -f kubernetes/org2-ca_deploy.yaml
# kubectl apply -f kubernetes/org2-ca_svc.yaml
```





# Refs
* https://www.linuxtechi.com/how-to-install-minikube-on-ubuntu/
* https://github.com/sibu-github/hyperledger-multi-machine-setup
* https://viblo.asia/p/bai-7-trien-khai-hyperledger-fabric-len-kubernetes-gGJ599xx5X2#_26-tao-cac-cau-hinh-can-thiet-7
* https://github.com/tantv-918/hyperledger-fabric-k8s

