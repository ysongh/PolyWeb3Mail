# PolyWeb3Mail
A decentralized email and web3 platform where you can send encrypted email

- Live Site - https://polyweb3mail.netlify.app/

## Info

### Project name
PolyWeb3Mail

### Link to working code in a public repo OR PR link to a public repo
https://github.com/ysongh/PolyWeb3Mail/tree/unstoppabledomains

### Recorded video demo of the integration (max. 3 mins)
https://youtu.be/MJqPMTIwhxM

### Person of contact in case there are any questions
You Song#4593

### Discord ID
You Song#4593

### UnstoppableDomain registered account email address
ysongweb3@gmail.com

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
