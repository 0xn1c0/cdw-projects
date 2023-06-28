// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/// @custom:security-contact grassroots@dmail.ai
contract ConfluxDevelopersWorkshopNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Conflux Developers Workshop NFT", "CDWNFT") {}

    uint256 private constant MAX_SUPPLY = 100;
    uint256 private mintedCount;

    string[] private colors = [
        "#FF0000",
        "#FFA500",
        "#FFFF00",
        "#00FF00",
        "#00FFFF",
        "#0000FF",
        "#8A2BE2",
        "#FF00FF",
        "#FFC0CB",
        "#FF1493",
        "#800000",
        "#FF4500",
        "#FFFF99",
        "#ADFF2F",
        "#32CD32",
        "#00CED1",
        "#000080",
        "#9932CC",
        "#FF69B4",
        "#A0522D"
    ];

    string[] private ascii = [
        "*_*",
        "'_'",
        "._.",
        "$_$",
        "#_#",
        "^_^",
        "-_-",
        "@_@",
        "o_o",
        "0_0",
        "o_0",
        "0_o"
    ];

    function safeMint(address to) public onlyOwner {
        require(mintedCount < MAX_SUPPLY, "Maximum supply reached");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        mintedCount++;
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(_exists(tokenId), "ERC721URI: URI query for nonexistent token");

        string memory color1 = pluck(tokenId, "Colors", colors);
        string memory color2 = pluck(tokenId + 42, "Colors", colors);
        string memory face = pluck(tokenId, "Ascii", ascii);
        string memory output = string.concat(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-100 -100 200 200">',
                '<defs><linearGradient id="circleGradient" gradientTransform="rotate(90)"><stop offset="0%" stop-color="',
                color1,
                '"/><stop offset="100%" stop-color="',
                color2,
                '"/></linearGradient></defs>',
                '<style>@keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(360deg)}}text{text-anchor:middle;font-family: monospace;}#circle{fill:url(#circleGradient);stroke:#000}.animated-text{animation:spin 5s linear infinite}.year,text{fill:#000}.year{font-size:30px;font-family: monospace;}</style>',
                '<path id="circle" d="M80 0A80 80 0 1 0-80 0 80 80 0 1 0 80 0"/>',
                '<text class="animated-text" font-size="20"><textPath xlink:href="#circle" startOffset="50%"><tspan x="0" dy="-.5em">Conflux - Developers - Workshop - 2023</tspan></textPath></text>',
                '<text class="year">',
                face,
                '</text></svg>');

        output = string.concat("data:image/svg+xml;base64,", Base64.encode(bytes(output)));

        string memory json = Base64.encode(
            bytes(
                string.concat(
                        '{"name": "CDW Onchain NFT", "description": "Final project for Conflux Developers Workshop", "image": "',
                        output,
                        '","attributes": [{"trait_type": "color1","value": "',
                        color1,
                        '"},{"trait_type": "color2","value": "',
                        color2,
                        '"},{"trait_type": "face","value": "',
                        face,
                        '"}]}'
                    )
                )
        );
        output = string.concat('data:application/json;base64,', json);

        return output;
    }

    function pluck(uint256 tokenId, string memory keyPrefix, string[] memory sourceArray)
        internal
        pure
        returns (string memory)
    {
        uint256 rand = uint256(keccak256(abi.encodePacked(keyPrefix, tokenId)));
        string memory output = sourceArray[rand % sourceArray.length];
        return output;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
