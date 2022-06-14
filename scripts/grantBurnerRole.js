const starknet = require("hardhat").starknet;
const strToFeltArr = require("./utils").strToFeltArr;
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

  if (process.env.NEW_BURNER_ADDRESS == null) {
    console.log(`NEW_BURNER_ADDRESS not set`);
    process.exit(1);
  }

  const NFTFactory = await starknet.getContractFactory("nft_contract");
  const nftContract = NFTFactory.getContractAt(process.env.PROJECT_NFT_ADDRESS);

  const myAccount = await starknet.getAccountFromAddress(
    process.env.STARKNET_ADDRESS,
    process.env.STARKNET_PKEY,
    "OpenZeppelin"
  );

  // url must be converted to a felt array as that is the functions input type
  const baseTokenURI = strToFeltArr(process.env.PROJECT_BASE_URI);
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

main()
  .then(() => {
    console.log("finished successfully");
    process.exit(0);
  })
  .catch((x) => {
    console.log(`Failed to run: ${x.toString()}`);
    process.exit(1);
  });
