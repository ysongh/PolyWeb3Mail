// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const PolyWeb3Mail = await hre.ethers.getContractFactory("PolyWeb3Mail");
  const polyWeb3Mail = await PolyWeb3Mail.deploy();

  await polyWeb3Mail.deployed();

  console.log("PolyWeb3Mail contract deployed to:", polyWeb3Mail.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
