const mintDetails = require("../mintDetails.json");
const starknet = require("hardhat").starknet;
const fromUint256WithFelts = require("./utils").fromUint256WithFelts;
const toUint256WithFelts = require("./utils").toUint256WithFelts;
require("dotenv").config();

async function main() {
  if (
    process.env.STARKNET_PKEY == null ||
    process.env.STARKNET_ADDRESS == null
  ) {
    console.log(`STARKNET_PKEY and/or STARKNET_ADDRESS are not set`);
    process.exit(1);
  }

  if (process.env.PROJECT_NFT_ADDRESS == null) {
    console.log(`PROJECT_NFT_ADDRESS not set`);
    process.exit(1);
  }

  const NFTFactory = await starknet.getContractFactory("nft_contract");
  const nftContract = NFTFactory.getContractAt(process.env.PROJECT_NFT_ADDRESS);

  const myAccount = await starknet.getAccountFromAddress(
    process.env.STARKNET_ADDRESS,
    process.env.STARKNET_PKEY,
    "OpenZeppelin"
  );

  let interactionArray = [];
  for (const acc of mintDetails.mintList) {
    const mintTo = acc.address;
    const mintTokenIds = acc.tokenIds;
    for (const tokenId of mintTokenIds) {
      let interaction = {
        toContract: nftContract,
        functionName: "permissionedMint",
        calldata: {
          account: mintTo,
          tokenId: toUint256WithFelts(tokenId.toString()),
        },
      };
      interactionArray.push(interaction);
    }
  }
  const fee = await myAccount.multiEstimateFee(interactionArray);
  console.log(`Mint fee is ${fee.amount} ${fee.unit}`);
  const txHash = await myAccount.multiInvoke(interactionArray, {
    maxFee: fee.amount * BigInt(2),
  });
  console.log(`Minted NFTs successfully with TxHash ${txHash}`);
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((x) => {
    console.log(`Failed to run: ${x.toString()}`);
    process.exit(1);
  });
