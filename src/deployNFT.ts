import { starknet } from "hardhat";
import { getAccount } from "./utils/getAccount";

export type NFTDeployment = {
  contractAddress: string;
  projectName: string;
  projectSymbol: string;
  royaltyReceiver: string;
  royaltyFeeBP: string;
  minterAddress: string;
};

export async function deployNFT(): Promise<NFTDeployment> {
  const myAccount = await getAccount();
  if (process.env.PROJECT_NAME == null) {
    throw "PROJECT_NAME is not set";
  }

  if (process.env.PROJECT_SYMBOL == null) {
    throw "PROJECT_SYMBOL is not set";
  }

  if (process.env.PROJECT_ROYALTY_RECEIVER == null) {
    throw "PROJECT_ROYALTY_RECEIVER is not set";
  }

  if (process.env.PROJECT_ROYALTY_FEE_BP == null) {
    throw "PROJECT_ROYALTY_FEE_BP is not set";
  }

  // The constructor for ERC721_Full takes a name, symbol, owner,
  // default_royalty_receiver and default_royalty_fee_basis points.
  // In this example, we set royalties to 5%.
  const name = starknet.shortStringToBigInt(process.env.PROJECT_NAME);
  const symbol = starknet.shortStringToBigInt(process.env.PROJECT_SYMBOL);
  const owner = myAccount.address;
  const default_royalty_receiver = BigInt(process.env.PROJECT_ROYALTY_RECEIVER);
  const default_royalty_fee_basis_points = BigInt(
    process.env.PROJECT_ROYALTY_FEE_BP
  );

  // The contract factory is the name of the cairo file your NFT without the .cairo
  const nftFactory = await starknet.getContractFactory("nft_contract");
  console.log("Deploying NFT...");
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

  let ret: NFTDeployment = {
    contractAddress: nftContract.address,
    projectName: process.env.PROJECT_NAME,
    projectSymbol: process.env.PROJECT_SYMBOL,
    royaltyReceiver: process.env.PROJECT_ROYALTY_RECEIVER,
    royaltyFeeBP: process.env.PROJECT_ROYALTY_FEE_BP,
    minterAddress: myAccount.starknetContract.address,
  };

  return ret;

  // See IMX Test cases for more examples
  // https://github.com/immutable/imx-starknet/blob/92141bdfb3e2631db945011495664fc4e35596da/tests/functional/starknet/erc721/ERC721.test.ts
}
