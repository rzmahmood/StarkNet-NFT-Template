import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { starknet } from "hardhat";

/**
 * @dev This function deploy a StarkNet account and logs the address and private key for later use
 * This make take up to 10 minutes to run. See https://stats.goerli.net/ for block times
 */
async function deployLogAccount() {
  console.log("Deploying OpenZeppelin Account...");
  const starknetAccount: Account = await starknet.deployAccount("OpenZeppelin");
  console.log(`ADDRESS=${starknetAccount.address}`);
  console.log(`PKEY=${starknetAccount.privateKey}`);
  return;
}

deployLogAccount()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
