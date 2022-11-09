![Hero](https://miro.medium.com/max/1400/1*2W-L27RMDC-hGqnvdPjvJQ.png)

## Trouble Shooting

For any issues, visit the #starknet channel in the Immutable X Discord, where I'm frequently active. Alternatively, raise a Github Issue.
Also see the FAQ at the bottom

## Setup

This guide is a step-by-step walkthrough of deploying your first NFT project on StarkNet. You'll be able to mint NFTs and view them in your wallet! It assumes no knowledge about StarkNet. By the end, you'll have deployed and minted NFTs which you can view on your browser.
We'll be using Immutable X's NFT contracts as they provide a feature-rich preset. 
Let's start by cloning the template repository and entering it

```sh
git clone https://github.com/rzmahmood/StarkNet-NFT-Template.git
cd StarkNet-NFT-Template
```

We now need to install poetry, which is a dependency management tool, like npm but for python.
Visit the [poetry documentation for installation instructions](https://python-poetry.org/docs/#installation). Make sure to add `poetry` to your PATH which you will be prompted to do as part of the installation.

We'll now install our dependencies and compile our contracts:

```sh
npm run setup
```

Now that we've installed our dependencies and setup our contracts, we can review our configuration in `hardhat.config.js`, where by default we're using the goerli testnet. We can change network to `alpha-mainnet` if we're ready to use mainnet. More information on the configurations can be found [here](https://github.com/Shard-Labs/starknet-hardhat-plugin#configure-the-plugin).

We're using the Immutable X NFT preset for our project. The preset includes the ability to add token metadata, contract metadata, and token royalties. It can also be used for bridging back to L1. You can find more information on it [here](https://immutablex.medium.com/erc721-on-starknet-57832d9d8c30).

We have a few predefined scripts which cover all the common functionality. First you're going to want a StarkNet account which you can use to deploy your NFT contract and mint NFTs.

## 1. Create Account

To create an account, simply run the following. It will deploy an OpenZeppelin account to the network defined in your hardhat.config.js. It will log the address and private key of the account which you can save for later.

```sh
npm run create-account
```

Once you can see the address of the account, visit the [official StarkNet goerli faucet](https://faucet.goerli.starknet.io/) and request some testnet Ether to your address. After that, rename the `.example.env` file to `.env` and replace `STARKNET_PKEY` and `STARKNET_ADDRESS` with your newly created variables.

_NOTE: ArgentX hasn't upgraded the Account Contract in their Browser wallet yet and using an ArgentX wallet is currently not possible. However, you can still mint NFTs to your Argent Browser wallet and interact with them there._

## 2. Deploy NFT Contract

Before we deploy the NFT Contract, we need to decide on a few key variables

- Project Name : The name of the project, e.g. Bored Ape Yacht Club
- Project Symbol: The symbol of the project, e.g. BAYC
- Project Owner Address: The owner of the NFT contract who can mint NFTs
- Project Royalty Receiver: The address which will receive royalties on trading activity
- Project Royalty Fee Basis Points (BP): The Royalty fee amount. Example, 500 BP is equal to a 5% royalty.

These variables can be set in the `.env`. Replace the existing variables with the values you wish to set them to. For most use cases, Royalty Receiver and Owner Address will be the same as your StarkNet Address.
After that, run

```sh
npm run deploy-nft
```

This script will log the NFT Token Address and it will give permission to the Project Owner Address to mint NFTs. Save the logged NFT address in the `.env` file next to `PROJECT_NFT_ADDRESS`

## 3. Set NFT Metadata

We'll be using a baseURI to set the NFT metadata. A baseURI will have the TokenId appended to it to create the full TokenURI for a particular NFT. For example, the Bored Ape Yatch Club Base URI is https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/

Disclaimer: This has no affiliation with Bored Apes.

Once you have your NFT metadata, set `PROJECT_BASE_URI` in the `.env` file as appropriate. Then run the following:

```sh
npm run set-metadata
```

## 4. Mint NFTs

To mint NFTs, we'll be using the mintDetails.json file. It is prefilled with random addresses and TokenIDs. We can add more items to the JSON list and modify as required to decide who will receive NFTs and what their tokenIds will be. Once appropriately set and saved, run the following:

```sh
npm run mint-nfts
```

This will mint the NFTs to the appropriate owners. If you have a browser wallet like ArgentX or Braavos, you can view the NFTs in your wallet in the collectibles section:

![Hero](https://miro.medium.com/max/966/1*N26Gtbx_yDtylKwvGx9IxQ.png)

## Next Steps

Now that you've deployed your NFT, you may want to know more about the contract you've deployed. For that, visit https://immutablex.medium.com/starknet-contracts-v1-0-ded55d4dcb05
You can also explore the deployed addresses using some browser tools like the [Voyager block explorer](https://goerli.voyager.online/). 
You can also learn more about customizing your NFT! Want to add cool GameFi to your NFT?
To customize it, you'll need to learn more about Cairo and StarkNet. For that visit https://starknet.io/building-on-starknet/ which will guide you to various resources. You can also ask for help in the #starknet channel on the [Immutable X Discord](https://discord.com/channels/765480457256042496/978781372535701524)

## Extensions

### Grant Minting Permissions

Add `NEW_MINTER_ADDRESS` to the `.env` file with the Starknet address of the contract which will be allowed to mint NFTs. Then run:

```sh
npm run add-minter
```

### Grant Burning Permissions

Add `NEW_BURNER_ADDRESS` to the `.env` file with the Starknet address of the contract which will be allowed to burn NFTs. Then run:

```sh
npm run add-burner
```

# FAQ / Errors

Issue: `Error: AccessControl: account is missing role`

Solution: You are either trying to mint or burn an NFT using an account that does not had permission. You can grant the account permission by seeing [Grant Minting Permissions](#Grant-Minting-Permissions)

Issue: `The provided private key is not compatible with the public key stored in the contract.`

Solution: Convert the Argent Private Key into Hex format. Do this by pasting your private key here https://www.rapidtables.com/convert/number/decimal-to-hex.html and prepending `0x` to the beginning of the result

Issue: `dyld: Library not loaded error while installing poetry`

Solution: https://github.com/python-poetry/poetry/issues/5109#issuecomment-1166458685 . Copy the contents of the page at https://install.python-poetry.org to a local file called local_poetry_installer. Then replace the line `builder = venv.EnvBuilder(clear=True, with_pip=True, symlinks=False)` with `builder = venv.EnvBuilder(clear=True, with_pip=True, symlinks=True)`. Then run `cat local_poetry_installer | python3 -`

Issue: `Failed to run: StarknetPluginError: Could not perform call on getSigner.
Got BadRequest while trying to access https://alpha4.starknet.io/feeder_gateway/call_contract?blockNumber=pending. Status code: 500; text: {"code": "StarknetErrorCode.ENTRY_POINT_NOT_FOUND_IN_CONTRACT", "message": "Error at pc=0:12:
Got an exception while executing a hint.
Cairo traceback (most recent call last):
Unknown location (pc=0:161)
Unknown location (pc=0:147)

Error in the called contract (0x2dbd0137d0f036e04f1903497cd0e19e36037d826d4ff710e9debc80379369c):
Entry point 0x239e10ae97b247b05959d468aa46c8d2a3ecdc7802dcf7ba10b891b9c08a372 not found in contract with class hash 0x3e327de1c40540b98d05cbcb13552008e36f0ec8d61d46956d2f9752c294328."}`

Solution: This is an issue with new release and various organisations not being synchronised with releases. Your agrent account may be an older version. Run `npm i @shardlabs/starknet-hardhat-plugin@0.6.6 --save-dev` and try again

Issue: `Got BadRequest while trying to access https://alpha4.starknet.io/feeder_gateway/call_contract?blockNumber=pending. Status code: 500; text: {"code": "StarknetErrorCode.ENTRY_POINT_NOT_FOUND_IN_CONTRACT", "message": "Error at pc=0:12:
Got an exception while executing a hint.
Cairo traceback (most recent call last):
Unknown location (pc=0:161)
Unknown location (pc=0:147)

Error in the called contract (0x869c7bdbbe93da5fef32f592596a7c6d841e58fefededb442a9f919c18e73b):
Entry point 0x1a6c6a0bdec86cc645c91997d8eea83e87148659e3e61122f72361fd5e94079 not found in contract with class hash 0x3e327de1c40540b98d05cbcb13552008e36f0ec8d61d46956d2f9752c294328."}`

Solution: Make sure to update your `.env` file to Argent if using an Argent wallet
