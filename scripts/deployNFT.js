const starknet = require("hardhat").starknet;
require("dotenv").config();

async function main() {
  if (
    process.env.STARKNET_PKEY == null ||
    process.env.STARKNET_ADDRESS == null
  ) {
    console.log(`STARKNET_PKEY and/or STARKNET_ADDRESS are not set`);
    process.exit(1);
  }
  if (process.env.PROJECT_NAME == null) {
    console.log("PROJECT_NAME is not set");
    process.exit(1);
  }

  if (process.env.PROJECT_SYMBOL == null) {
    console.log("PROJECT_SYMBOL is not set");
    process.exit(1);
  }

  if (process.env.PROJECT_OWNER_ADDRESS == null) {
    console.log("PROJECT_OWNER_ADDRESS is not set");
    process.exit(1);
  }

  if (process.env.PROJECT_ROYALTY_RECEIVER == null) {
    console.log("PROJECT_ROYALTY_RECEIVER is not set");
    process.exit(1);
  }

  if (process.env.PROJECT_ROYALTY_FEE_BP == null) {
    console.log("PROJECT_ROYALTY_FEE_BP is not set");
    process.exit(1);
  }

  const myAccount = await starknet.getAccountFromAddress(
    process.env.STARKNET_ADDRESS,
    process.env.STARKNET_PKEY,
    "OpenZeppelin"
  );

  // The constructor for ERC721_Full takes a name, symbol, owner,
  // default_royalty_receiver and default_royalty_fee_basis points.
  // In this example, we set royalties to 5%.
  const name = starknet.shortStringToBigInt(process.env.PROJECT_NAME);
  const symbol = starknet.shortStringToBigInt(process.env.PROJECT_SYMBOL);
  const owner = BigInt(process.env.PROJECT_OWNER_ADDRESS);
  const default_royalty_receiver = BigInt(process.env.PROJECT_ROYALTY_RECEIVER);
  const default_royalty_fee_basis_points = BigInt(
    process.env.PROJECT_ROYALTY_FEE_BP
  );

  // The contract factory is the name of the cairo file your NFT without the .cairo
  const nftFactory = await starknet.getContractFactory("nft_contract");
  const nftContract = await nftFactory.deploy({
    name,
    symbol,
    owner,
    default_royalty_receiver,
    default_royalty_fee_basis_points,
  });
  console.log(`Deployed NFT Contract to address ${nftContract.address}`);
  console.log(`Granting minting permissions to ${myAccount.address}...`);
  // Now that we have successfully deployed, let's give ourselves the minter role,
  // so that we can begin minting NFTs
  let fee = await myAccount.estimateFee(nftContract, "grantRole", {
    role: starknet.shortStringToBigInt("MINTER_ROLE"),
    account: BigInt(myAccount.starknetContract.address),
  });

  await myAccount.invoke(
    nftContract,
    "grantRole",
    {
      role: starknet.shortStringToBigInt("MINTER_ROLE"),
      account: BigInt(myAccount.starknetContract.address),
    },
    { maxFee: fee.amount * BigInt(2) }
  );

  console.log("Minter role granted");

  // See IMX Test cases for more examples
  // https://github.com/immutable/imx-starknet/blob/92141bdfb3e2631db945011495664fc4e35596da/tests/functional/starknet/erc721/ERC721.test.ts
  process.exit(0);
}

main()
  .then(() => console.log("finished successfully"))
  .catch((x) => {
    console.log(`Failed to run: ${x.toString()}`);
    process.exit(1);
  });
