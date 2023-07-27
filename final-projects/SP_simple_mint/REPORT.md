## Introduction:

For this project, that showcases a simple NFT minting page, I utilized various technologies including the Thirdweb SDK for React, OpenZeppelin contracts, and Hardhat.

## Development Process:

To streamline the development process and ensure adherence to standards, I made use of available libraries. The Thirdweb SDK was an excellent choice due to its extensive documentation, SDK, and templates. Its dashboard provided a user-friendly interface for deploying and interacting with contracts.

For the smart contract, I opted to use OpenZeppelin contracts to ensure standardization and avoid potential security issues associated with custom code. I created the contract based on the ERC721 standard using the OpenZeppelin wizard. In addition, I added extra flags for minting, enumerability, and auto-increment functionality.

To facilitate local development and testing of the contract, I selected Hardhat. Its lightweight nature and easy management made it an ideal choice. Hardhat also provided a testing suite based on Mocha, allowing me to thoroughly test the smart contract. The test results included coverage and gas reports, ensuring the contract's functionality.

## Challenges Faced and Lessons Learned:

Throughout the project, I encountered challenges related to the Thirdweb SDK. It underwent two significant changes: one involving a breaking change in library syntax and another due to the decommissioning of Wallet Connect V1. These changes required me to update packages and review the codebase, resulting in a discrepancy between the available documentation and the actual code structure and syntax. While the Thirdweb SDK proved to be a powerful tool, it still lacks stability in terms of its codebase. Additionally, I discovered a lack of testing resources for the React/Next application side of the Thirdweb SDK. Setting up Jest for testing posed difficulties, and although I managed to set up a basic configuration, writing meaningful tests became challenging due to the complexities of mocking and interacting with the Thirdweb SDK. Furthermore, the introduction of Jest caused deployment issues on 4everland, leading to the omission of frontend testing in the final version.

In terms of solidity and contract development, my main challenge revolved around optimizing gas usage. Although I initially implemented the OpenZeppelin ERC721Storage contract, which seemed straightforward from a code perspective, the cost of storage operations quickly exceeded the gas limit and increased contract interaction costs. As a solution, I adopted an alternative approach in the final version. Instead of storing the NFT, I generated it dynamically, which significantly reduced the gas consumption. However, this approach required slightly more complex code.

## Conclusion:

The CDW NFT Minting Page project effectively demonstrates the process of minting NFTs within the Conflux ecosystem. By leveraging technologies such as the Thirdweb SDK, OpenZeppelin contracts, and Hardhat, I successfully developed a functional and informative example. The challenges I faced throughout the project provided valuable lessons for future improvements. These include addressing the limitations of the Thirdweb SDK, enhancing testing frameworks, and optimizing gas usage for efficient contract deployment.