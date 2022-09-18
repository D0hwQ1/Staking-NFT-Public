// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './NFT.sol';

contract staking is Ownable {
    using SafeMath for uint256;
    using Address for address;

    KIP17Token private _kip17;

    uint256 public totalSupply;

    mapping(uint256 => address) public stakedAssets;
    mapping(address => uint256) public balances;

    constructor (address kip17) {
        _kip17 = KIP17Token(kip17);
    }
    function name() external view returns(string memory) {
        return _kip17.name();
    }

    function getInformation(address user) public view returns(uint256, uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](_kip17.balanceOf(user));

        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenIds[i] = _kip17.tokenOfOwnerByIndex(user, i);
        }

        return (balances[user], tokenIds);
    }

    function stake(uint256 tokenId) external {
        _kip17.transferFrom(msg.sender, address(this), tokenId);
        stakedAssets[tokenId] = msg.sender;

        _stake();
        emit Staked(msg.sender, tokenId);
    }

    function withdraw(uint256 tokenId) public {
        require(stakedAssets[tokenId] == msg.sender, "Staking: Not the staker of the token");

        _kip17.transferFrom(address(this), msg.sender, tokenId);
        stakedAssets[tokenId] = address(0);

        _withdraw();
        emit Withdrawn(msg.sender, tokenId);
    }

    function _stake() internal {
        totalSupply += 1;
        balances[msg.sender] += 1;
    }

    function _withdraw() internal {
        totalSupply -= 1;
        balances[msg.sender] -= 1;
    }

    event Staked(address indexed user, uint256 tokenId);
    event Withdrawn(address indexed user, uint256 tokenId);
}