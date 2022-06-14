const starknet = require("hardhat").starknet;

/**
 * @dev This function deploy a StarkNet account and logs the address and private key for later use
 * This make take up to 10 minutes to run. See https://stats.goerli.net/ for block times
 */
async function deployLogAccount() {
  const starknetAccount = await starknet.deployAccount("OpenZeppelin");
  console.log(`ADDRESS=${starknetAccount.address}`);
  console.log(`PKEY=${starknetAccount.privateKey}`);
  return;
}

deployLogAccount()
  .then(() => process.exit(0))
  .catch((err) => console.log(err));
