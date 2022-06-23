import { starknet } from "hardhat";
import dotenv from "dotenv";
import {
  Account,
  ArgentAccount,
} from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { AccountImplementationType } from "@shardlabs/starknet-hardhat-plugin/dist/src/types";
dotenv.config();

export async function getAccount(): Promise<Account> {
  if (!process.env.STARKNET_PKEY || !process.env.STARKNET_ADDRESS) {
    throw "STARKNET_PKEY and/or STARKNET_ADDRESS are not set";
  }

  if (!process.env.STARKNET_ACCOUNT_TYPE) {
    throw "STARKNET_ACCOUNT_TYPE not set";
  }

  const myAccount = await starknet.getAccountFromAddress(
    process.env.STARKNET_ADDRESS,
    process.env.STARKNET_PKEY,
    process.env.STARKNET_ACCOUNT_TYPE as AccountImplementationType
  );

  switch (process.env.STARKNET_ACCOUNT_TYPE) {
    case "OpenZeppelin": {
      break;
    }
    case "Argent": {
      throw "ARGENT Wallet currently has issues and is not supported";
    }
    default: {
      throw "STARKNET_ACCOUNT_TYPE not supported";
    }
  }

  return myAccount;
}
