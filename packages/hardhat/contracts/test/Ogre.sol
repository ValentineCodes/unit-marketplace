// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ogre is ERC721 {
  string public constant TOKEN_URI =
    "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
  uint256 private s_tokenCounter;

  constructor() ERC721("OGRE", "OG") {
    mintNft();
  }

  function mintNft() public returns (uint256) {
    _safeMint(msg.sender, s_tokenCounter);
    s_tokenCounter = s_tokenCounter + 1;
    return s_tokenCounter;
  }

  function tokenURI() public pure returns (string memory) {
    // require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    return TOKEN_URI;
  }

  function getTokenCounter() public view returns (uint256) {
    return s_tokenCounter;
  }
}
