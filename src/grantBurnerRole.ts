import { starknet } from "hardhat";
import { getAccount } from "./utils/getAccount";

export async function grantBurnerRole() {
  if (
    process.env.STARKNET_PKEY == null ||
    process.env.STARKNET_ADDRESS == null
  ) {
    throw `STARKNET_PKEY and/or STARKNET_ADDRESS are not set`;
  }

  if (process.env.PROJECT_NFT_ADDRESS == null) {
    throw `PROJECT_NFT_ADDRESS not set`;
  }

  if (process.env.NEW_BURNER_ADDRESS == null) {
    throw `NEW_BURNER_ADDRESS not set`;
  }

  const NFTFactory = await starknet.getContractFactory("nft_contract");
  const nftContract = NFTFactory.getContractAt(process.env.PROJECT_NFT_ADDRESS);

  const myAccount = await getAccount();

  // url must be converted to a felt array as that is the functions input type
  const fee = await myAccount.estimateFee(nftContract, "grantRole", {
    role: starknet.shortStringToBigInt("BURNER_ROLE"),
    account: BigInt(process.env.NEW_BURNER_ADDRESS),
  });
  await myAccount.invoke(
    nftContract,
    "grantRole",
    {
      role: starknet.shortStringToBigInt("MINTER_ROLE"),
      account: BigInt(process.env.NEW_BURNER_ADDRESS),
    },
    { maxFee: fee.amount * BigInt(2) }
  );
  console.log(`Burning permissions given to ${process.env.NEW_BURNER_ADDRESS}`);
}
