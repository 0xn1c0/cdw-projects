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
