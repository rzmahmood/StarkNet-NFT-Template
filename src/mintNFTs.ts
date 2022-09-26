import mintDetails from "../mintDetails.json";
import { fromUint256WithFelts, toUint256WithFelts } from "./utils";
import { starknet } from "hardhat";
import { getAccount } from "./utils/getAccount";

export async function mintNFTs() {
  if (
    process.env.STARKNET_PKEY == null ||
    process.env.STARKNET_ADDRESS == null
  ) {
    throw `STARKNET_PKEY and/or STARKNET_ADDRESS are not set`;
  }

  if (process.env.PROJECT_NFT_ADDRESS == null) {
    throw `PROJECT_NFT_ADDRESS not set`;
  }

  const NFTFactory = await starknet.getContractFactory("nft_contract");
  const nftContract = NFTFactory.getContractAt(process.env.PROJECT_NFT_ADDRESS);

  const myAccount = await getAccount();

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
