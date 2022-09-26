import { starknet } from "hardhat";
import { getAccount } from "./utils/getAccount";
import { strToFeltArr } from "./utils";

export async function setMetadata() {
  if (
    process.env.STARKNET_PKEY == null ||
    process.env.STARKNET_ADDRESS == null
  ) {
    throw `STARKNET_PKEY and/or STARKNET_ADDRESS are not set`;
  }

  if (process.env.PROJECT_NFT_ADDRESS == null) {
    throw `PROJECT_NFT_ADDRESS not set`;
  }

  if (process.env.PROJECT_BASE_URI == null) {
    throw `PROJECT_BASE_URI not set`;
  }

  const NFTFactory = await starknet.getContractFactory("nft_contract");
  const nftContract = NFTFactory.getContractAt(process.env.PROJECT_NFT_ADDRESS);

  const myAccount = await getAccount();

  // url must be converted to a felt array as that is the functions input type
  const baseTokenURI = strToFeltArr(process.env.PROJECT_BASE_URI);
  const fee = await myAccount.estimateFee(nftContract, "setBaseURI", {
    base_token_uri: baseTokenURI,
  });
  await myAccount.invoke(
    nftContract,
    "setBaseURI",
    {
      base_token_uri: baseTokenURI,
    },
    { maxFee: fee.amount * BigInt(2) }
  );
  console.log(`baseURI set to ${process.env.PROJECT_BASE_URI}`);
}
