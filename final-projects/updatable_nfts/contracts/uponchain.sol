// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}

contract UPONCHAIN is ERC721, ERC721URIStorage, Ownable {
    constructor() ERC721("On-Chain Updatable NFT", "UPON") {}

    /// @dev Mapping from NFT ID to the address that owns it.
    mapping(uint => address) internal idToOwner;
    /// @dev Mapping from NFT ID to approved address.
    mapping(uint => address) internal idToApprovals;
    /// @dev Mapping from owner address to mapping of operator addresses.
    mapping(address => mapping(address => bool)) internal ownerToOperators;


    mapping(uint => string) public name_s;
    mapping(uint => string[]) public external_url_s;
    mapping(uint => string[]) public status_s; //TODO: enum?
    mapping(uint => uint256[]) public effective_time_s;

    /// @dev Returns current token URI metadata
    /// @param _tokenId Token ID to fetch URI for.
    function tokenURI(uint _tokenId) public override(ERC721, ERC721URIStorage) view returns (string memory) {
        require(idToOwner[_tokenId] != address(0), "Query for nonexistent token");
        string memory _name = name_s[_tokenId];

        uint _item = status_s[_tokenId].length -1;
        string memory _external_url = external_url_s[_tokenId][_item];
        string memory _status = status_s[_tokenId][_item];
        uint256 _effective_time = effective_time_s[_tokenId][_item];
        
        return
        _tokenURI(
            _tokenId,
            _item,
            _name,
            _status,
            _effective_time,
            _external_url
        );
    }

    
    /// @dev Returns current token URI metadata
    /// @param _tokenId Token ID to fetch URI for.
    function tokenURI(uint _tokenId, uint _item) public view returns (string memory) {
        require(idToOwner[_tokenId] != address(0), "Query for nonexistent token");
        require(_item < status_s[_tokenId].length, "Query for nonexistent token version");
        string memory _name = name_s[_tokenId];
        string memory _external_url = external_url_s[_tokenId][_item];
        string memory _status = status_s[_tokenId][_item];
        uint256 _effective_time = effective_time_s[_tokenId][_item];

        return
        _tokenURI(
            _tokenId,
            _item,
            _name,
            _status,
            _effective_time,
            _external_url
        );
    }
    
    function _tokenURI(uint256 _tokenId, uint _item, string memory _name, string memory _status, uint256 _effective_time, string memory _external_url) internal pure returns (string memory output) {
        output = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';
        output = string(abi.encodePacked(output, "tokenId: ", toString(_tokenId), '</text><text x="10" y="40" class="base">'));
        output = string(abi.encodePacked(output, "name: ", _name, '</text><text x="10" y="60" class="base">'));
        output = string(abi.encodePacked(output, "version: ", toString(_item), '</text><text x="10" y="80" class="base">'));
        output = string(abi.encodePacked(output, "status: ", _status, '</text><text x="10" y="100" class="base">'));
        output = string(abi.encodePacked(output, "effective_time: ", toString(_effective_time), '</text><text x="10" y="120" class="base">'));
        output = string(abi.encodePacked(output, "external_url: ", _external_url, '</text></svg>'));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": ',
                        '"', _name, '",',
                        ' "version": ',
                        toString(_item), ',',
                        ' "status": ',
                        '"', _status, '",', 
                        ' "effective_time": ',
                        toString(_effective_time), ',',
                        ' "external_url": ',
                        '"', _external_url, '",', 
                        ' "description": "On-Chain Updatable NFT", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'
                        )
                    )
                )
            );
        output = string(abi.encodePacked('data:application/json;base64,', json));
    }

    function toString(uint value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint temp = value;
        uint digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function createNewVersionOf(
        uint256 tokenId, 
        string calldata status, 
        uint256 effective_time,
        string calldata external_url
        )
            public
        {
            require(_isApprovedOrOwner(msg.sender, tokenId));
            status_s[tokenId].push(status);
            effective_time_s[tokenId].push(effective_time);
            external_url_s[tokenId].push(external_url);
            emit MetadataUpdate(tokenId);
        }

    function isApprovedOrOwner(address _spender, uint _tokenId) external view returns (bool) {
        return _isApprovedOrOwner(_spender, _tokenId);
    }


    function safeMint(
        address to, 
        uint256 tokenId, 
        string calldata name,
        string calldata status,
        uint256 effective_time,
        string calldata external_url
    )
        public
        onlyOwner
    {
        _safeMint(to, tokenId);
        idToOwner[tokenId] = to;
        name_s[tokenId] = name;
        createNewVersionOf(tokenId, status, effective_time, external_url);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


}