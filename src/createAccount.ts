import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { starknet } from "hardhat";

/**
 * This make take up to 10 minutes to run. See https://stats.goerli.net/ for block times
 * @dev This function deploy a StarkNet account and logs the address and private key for later use
 */
export async function createAccount(): Promise<Account> {
  console.log("Deploying OpenZeppelin Account...");
  const starknetAccount: Account = await starknet.deployAccount("OpenZeppelin");
  console.log(`ADDRESS=${starknetAccount.address}`);
  console.log(`PKEY=${starknetAccount.privateKey}`);
  return starknetAccount;
}
