pragma solidity ~0.5;

import "./ERC721Full.sol";

contract YT is ERC721Full {
  string[] public videos;
  mapping(string => bool) _videoExists;

  constructor() ERC721Full("YouTube", "YT") public {
  }

  // E.G. video = "http://www.youtube.com/abcdefghi/"
  function mint(string memory _video) public {
    require(!_videoExists[_video], "Video already Minted");
    uint _id = videos.push(_video);
    _mint(msg.sender, _id);
    _videoExists[_video] = true;
  }

}
