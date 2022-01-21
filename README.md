# Hyperledger Fabric

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

## Fabric Samples
* Download the latest production release
```
# curl -sSL http://bit.ly/2ysbOFE | bash -s 1.4.4
#You can replace 1.4.4 with 2.0.0 if you want to install Fabric 2.0.0
```
* Setting first-network
```
# cd ROOT/fabric-samples/first-network
# ./byfn.sh generate
# ./byfn.sh up
```
* You should get something like below at the end of execution if everything went right. If not you may have made a mistake in the installation process
```
========= All GOOD, BYFN execution completed ===========
 _____   _   _   ____    
| ____| | \ | | |  _ \
|  _|   |  \| | | | | |
| |___  | |\  | | |_| |
|_____| |_| \_| |____/
```
* Check if all the docker containers are running
```
# docker ps -a
```
* Clean the Network
```
# ./byfn.sh down
```


# Refs
* https://bibek-poudel.medium.com/install-hyperledger-fabric-in-ubuntu-20-04-lts-665482204b0d
* https://www.youtube.com/watch?v=sOPtGUL3S7M
