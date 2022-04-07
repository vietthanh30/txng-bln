/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const FabricCAServices = require("fabric-ca-client");
const { FileSystemWallet, X509WalletMixin } = require("fabric-network");
const fs = require("fs");
const path = require("path");

const Constant = require("./confs/constant");

// const ccpPath = path.resolve(
//   __dirname,
//   "..",
//   "..",
//   "first-network",
//   "connection-org1.json"
// );
// const ccpJSON = fs.readFileSync(ccpPath, "utf8");
// const ccp = JSON.parse(ccpJSON);

const ccpPath = Constant.CONNECTION_ORG1_PATH;
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

console.log("=== ccp ===");
console.log(ccp);
console.log("=== ccp end ===");
console.log("=== wallet ===");
console.log(process.cwd());
console.log("=== wallet end ===");

async function main() {
  try {
    // Create a new CA client for interacting with the CA.
    const ca = new FabricCAServices(
      "http://192.53.118.223:7054",
      {
        trustedRoots:
          "/root/blockchain/fabric-samples/Build-Multi-Host-Network-Hyperledger/crypto-config/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem",
        verify: false,
      },
      "ca.example.com"
    );

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists("admin");
    if (adminExists) {
      console.log(
        'An identity for the admin user "admin" already exists in the wallet'
      );
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
    });
    const identity = X509WalletMixin.createIdentity(
      "Org1MSP",
      enrollment.certificate,
      enrollment.key.toBytes()
    );
    await wallet.import("admin", identity);
    console.log(
      'Successfully enrolled admin user "admin" and imported it into the wallet'
    );
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
    process.exit(1);
  }
}

main();
