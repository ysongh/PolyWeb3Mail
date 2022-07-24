# PolyWeb3Mail
A decentralized email and web3 platform where you can send encrypted email 

- Published on Valist.io => https://app.valist.io/songweb3/polyweb3mail

## Technologies
- React 17
- Material UI
- Hardhat
- Ethers.js
- NFTPort API
- POAP API
- nft.storage
- Lit Protocol
- Tableland
- Unstoppable Domains Login

## Running the dapp on local host
- Clone or download this repository
- Run `npm i` to install the dependencies
- Create a file called '.env' on the root folder and add the following code
```
ALCHEMYAPI_KEY = <KEY>
PRIVATEKEY = <KEY>
```
- Run `npx hardhat run scripts/deploy.js --network mumbai` to deploy contract

- Create a file called 'config.js' on the src folder and add the following code
```
export const NFT_STORAGE_APIKEY = <KEY>;
export const NFTPORT_API= <KEY>;
export const POAP_TOKEN = <KEY>;
export const POAP_APIKEY = <KEY>;
export const UNSTOPPABLEDOMAINS_CLIENTID = <KEY>;
export const UNSTOPPABLEDOMAINS_REDIRECT_URI = <URI>;
export const ALCHEMYAPI_KEY = <KEY>;
```
- Run `npm start` to start the dapp