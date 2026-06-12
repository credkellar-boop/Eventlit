// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EventlitSocialRegistryV2
 * @dev Upgraded registry with strict Reentrancy Guards and Access Controls.
 */
contract EventlitSocialRegistryV2 is ReentrancyGuard, Ownable {
    
    struct SocialProfile {
        string platform;      
        bytes32 handleHash;   
        bool isVerified;
    }

    mapping(address => mapping(string => SocialProfile)) public identities;
    address public eventlitOracle;

    event SocialLinked(address indexed wallet, string platform, bytes32 handleHash);
    event SocialVerified(address indexed wallet, string platform);
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);

    modifier onlyOracle() {
        require(msg.sender == eventlitOracle, "EventlitAuth: Caller is not the authorized backend oracle");
        _;
    }

    constructor(address _initialOracle) Ownable(msg.sender) {
        require(_initialOracle != address(0), "EventlitAuth: Invalid oracle anchor address");
        eventlitOracle = _initialOracle;
    }

    function updateOracle(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "EventlitAuth: Invalid replacement address target");
        emit OracleUpdated(eventlitOracle, _newOracle);
        eventlitOracle = _newOracle;
    }

    /**
     * @dev Link social profile. Guarded against reentrancy vectors.
     */
    function linkSocial(string memory _platform, bytes32 _handleHash) external nonReentrant {
        require(bytes(_platform).length > 0, "EventlitAuth: Platform descriptor mandatory");
        
        identities[msg.sender][_platform] = SocialProfile({
            platform: _platform,
            handleHash: _handleHash,
            isVerified: false
        });

        emit SocialLinked(msg.sender, _platform, _handleHash);
    }

    /**
     * @dev Verify user social linkage profile by authorized system Oracle nodes.
     */
    function verifySocial(address _wallet, string memory _platform) external onlyOracle nonReentrant {
        require(bytes(identities[_wallet][_platform].platform).length > 0, "EventlitAuth: Targeted trace missing profile states");
        identities[_wallet][_platform].isVerified = true;

        emit SocialVerified(_wallet, _platform);
    }
}
