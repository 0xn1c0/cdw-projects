# Hardhat Project
This project showcases a basic use case of Hardhat, a powerful development environment for Ethereum smart contracts. It includes an ERC721 contract, a test suite for that contract, and a deployment script.


## Test Execution
To run the tests, you can use one of the following commands:

1. Normal test:

```shell
npx hardhat test
```

2. Test with Gas usage report:
```shell
REPORT_GAS=true npx hardhat test
```

3. Coverage test:

```shell
npx hardhat coverage
```
Choose the command that suits your needs and execute it in your terminal. The test suite will be executed, and the results will be displayed.

## Local Node Execution
If you want to run a local Ethereum node for development or testing purposes, you can use the following command:
```shell
npx hardhat node
```
This command starts a local Ethereum node with a pre-funded account. You can use this node to interact with your smart contracts during development.

##  Contract Deployment
To deploy the contract, you have two options:

### Deploying with Thirdweb:

```shell
npx thirdweb deploy
```
This command is specific to the current application code based on the Thirdweb SDK. It also uploads the ABI to the Thirdweb contract dashboard.
Once executed will compile the contract and upload the contract and will open the deploy page on the thirdweb website and don't require to write in the repository the wallet private key.

### Deploying with Hardhat:

To deploy the contract using Hardhat, follow these steps:

Make sure you have a `.env` file in the root directory of the project. If not, you can use the provided `.env.example` file as a template. Add your private key to the `.env` file.

Choose the network you want to deploy to by using the `--network` parameter. The currently configured networks are `hardhat` and `espacetestnet`.

Run the deployment command in your terminal:
```shell
npx hardhat run scripts/deploy.js --network <network>
```

Replace <network> with the desired network name (e.g., hardhat, espacetestnet).

Hardhat will deploy the contract and generate the ABI file. You can find the ABI file in the `/artifacts/contracts/` directory.
Make sure to select the appropriate deployment method based on your requirements and execute the corresponding command in your terminal.

### Contract flattening

To generate a flattened contraact file execute the following command, replacing `<contract_name>` with the name of your contract and `<output_file>` with the desired output file name:

```
npx hardhat flatten contracts/<contract_name>.sol > <output_file>.sol
```
By using this command, you can easily flatten your contract for network verification purposes.


Feel free to explore and modify the project as needed for your own smart contract development needs. Happy coding!