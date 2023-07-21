# This project contains strategies for adapting ERC-721 standards for use with data that is expected to change.


Data that changes over time is generally referred to versioned data, and strategies designed to model it effectively are called data versioning models.


These strategies can be utilized to use the blockchain as the source of truth. 

Some examples of versioned data that could benefit from being stored on the blockchain:
- Team rosters/pictures
- Legal documents: contracts, legislative, regulatory, and court proceedings.
- Documentation
- Lineages detailing family trees or ownership 

## UPMVP contract deployed on Conflux eSpace:

- https://evm.confluxscan.io/address/0x0f14311a92693e0fb1761619cdfa21e36333e6be?tab=contract-viewer

- This contract extends ERC721URIStorage to save the head (or current) JSON metadata file URI in the contract.
- This approach is close to standard ERC-721 NFT implementations in that the metadata is uploaded as a file to the web (IPFS in the example) and a link to the image is contained in that metadata file.
- `external_url` field is utilized to provide a link to an outside asset.



### What is unique about this approach is:
- The metadata json contains a back-reference to the `previousTokenURI` so the sequence of `tokenURI` values (and hence metadata files) can be iteratively found from the head (Like a linked-list)
- The `TokenURIUpdate` event is emitted each time `changeTokenURI()` is called, providing the same ability to identify all instances of the tokenURI by reading the event log on the blockchain, which is usually done from the tail (beginning)
- This implementation is not too far derived from ERC721URIStorage, so it has a minimal affect on gas usage beyond a standard ERC721 NFT.
- It benefits utilizing similar external asset strategy for JSON metadata and images with the blockchain only storing the current (or head) pointer to the data.
- Orchestration: When creating the JSON file, one must know the `previousTokenURI`, as well as updating the contract with the current `tokenURI`

### Example


Github Repo (4 versions)
- Mint tokenId:0 https://evm.confluxscan.io/tx/0xca40f70561de125e3fd4c14b02af03e7e2578cc4107f9bf2db5acbb6b63f75cb
- First changeTokenURI https://evm.confluxscan.io/tx/0x0d5161e60151a8007ee61976c28394b01179e7efedcc0c3a849d56734d3e4ff3?tab=logs
- Second changeTokenURI https://evm.confluxscan.io/tx/0x9908169cbcb4d92968364496bf28386e446965d79b23746d3a147a95f42a1260?tab=logs
- Third changeTokenURI https://evm.confluxscan.io/tx/0x31c0e299043269b66cb079d9fcd6c83edd7f1b02e3cdd5f19b012d14ece58091?tab=logs
- View NFT tokenId:0 https://evm.confluxscan.io/nft/0x0f14311a92693e0fb1761619cdfa21e36333e6be/0


## UPONCHAIN contract deployed on Conflux eSpace:

- https://evm.confluxscan.io/address/0x18dbe65b073b3e7431181ae47c8ad6ce318199c4?tab=contract-viewer


This contract extends ERC721URIStorage but implements the metadata fully on-chain.


### What is unique about this approach is:
- The metadata is stored in arrays that increase size with each `version` that is created through `createNewVersionOf()`
- `function tokenURI(uint _tokenId)` overrides the ERC721 function and will build and return the json representation of the current version of the given _tokenId (the head) 
- `function tokenURI(uint _tokenId, uint _item)` is non-standard and will build and return the json representation of any `version` (_item is equivalent to the index of the arrays storing the versioned values) of the given _tokenId
- This implementation strays farther from standard IPFS file usage and will have a significant affect on gas usage, especially as more versions are created.
- It benefits from having the full lineage of data on-chain and queryable without reliance on outside data sources.
- This on-chain metadata strategy is heavily borrowed from the Nucleon ve-nut goverance NFTs:
https://evm.confluxscan.io/address/0xe1453a7813e1e90ed80ceb2e1896fb92859fd054?tab=contract-viewer

### Example


Github Repo (4 versions)
- Mint tokenId:0 https://evm.confluxscan.io/tx/0x9044949033a876a10f1ccd51bdb269b1f73fd6b95cbdf77d33e6a01fca8de600
- First createNewVersionOf https://evm.confluxscan.io/tx/0x991a55ceceb273861f65f21d6aae9344031459f2b59358b1fdaad5b33da12e8f
- Second createNewVersionOf https://evm.confluxscan.io/tx/0xf124d24862373b89c6e4fbea8436fb3c776860cf8b0a26be9bc9fe6624490d46
- Third createNewVersionOf https://evm.confluxscan.io/tx/0x1eb7a6418c2e6bc70e588cb87f8114684a71cf97fceda9d724e8099a71a16a3e
- View NFT tokenId:0 https://evm.confluxscan.io/nft/0x18dbe65b073b3e7431181ae47c8ad6ce318199c4/0


Conflux Monthly Progress Report (23 versions)
- Mint TokenId:1 https://evm.confluxscan.io/tx/0x9bdf28a452c270c11bb0946ca55d6960a7f6121c87a8345cbca26edf5f598ddc
- First createNewVersionOf https://evm.confluxscan.io/tx/0x72cb0b8185b48e29bfcc7d96d8609ea4057790d1101a22d7a48b115cdfbf799b
- Last createNewVersionOf https://evm.confluxscan.io/tx/0x5e58851240f8f692a4e4b0dac5c5c703441a97b6e9686acbbcc03cfe30a2d243
- View NFT TokenId:1 https://evm.confluxscan.io/nft/0x18dbe65b073b3e7431181ae47c8ad6ce318199c4/1


To view back-versions from https://evm.confluxscan.io/token/0x18dbe65b073b3e7431181ae47c8ad6ce318199c4?tab=contract-viewer
- Select "Read Contract" tab
- Enter tokenId and version number into #14 `tokenURI`
- In the response select the string AFTER "data:application/json;base64,"
- Paste string into input box and click `decode` on https://www.base64decode.org/