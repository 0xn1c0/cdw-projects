const { ethers } = require('hardhat');

async function main() {
  // Get the accounts
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  // Deploy the contract
  const Contract = await ethers.getContractFactory('ConfluxDeveloperWorkshopNFT');
  const contract = await Contract.deploy();

  console.log('Contract deployed to address:', contract.address);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
