import dotenv from "dotenv";
import { Account } from "hardhat/types";
import { createAccount } from "../src/createAccount";
import { deployNFT, NFTDeployment } from "../src/deployNFT";
import { grantBurnerRole } from "../src/grantBurnerRole";
import { grantMinterRole } from "../src/grantMinterRole";
import { mintNFTs } from "../src/mintNFTs";
import { setMetadata } from "../src/setMetadata";

let res = dotenv.config({
  path: ".ci.env",
});
console.log(res);

describe("E2E Test", function () {
  this.timeout(3_600_000); // 1hr
  let nftDeployment: NFTDeployment;
  let testAccount: Account;

  it("Deploy OpenZeppelin Account", async function () {
    testAccount = await createAccount();
  });

  it("Deploy NFT", async function () {
    nftDeployment = await deployNFT();
    process.env.PROJECT_NFT_ADDRESS = nftDeployment.contractAddress;
  });

  it("Grant Minter Role", async function () {
    process.env.NEW_MINTER_ADDRESS = testAccount.address;
    await grantMinterRole();
  });

  it("Grant Burner Role", async function () {
    process.env.NEW_BURNER_ADDRESS = testAccount.address;
    await grantBurnerRole();
  });

  it("Set Metadata", async function () {
    await setMetadata();
  });

  it("Mint NFTs", async function () {
    await mintNFTs();
  });
});
