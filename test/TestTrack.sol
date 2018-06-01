pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Track.sol";

contract TestTrack {
    Tracking tracking = Tracking(DeployedAddresses.Tracking());

    // Testing the adopt() function
    function testUserCanTrackSeed() public {
        uint returnedId = tracking.track(8);
        uint expected = 8;
        Assert.equal(returnedId, expected, "Tracking of seed ID 8 should be recorded.");
    }

    // Testing retrieval of a single pet's owner
    function testGetSeedSourceById() public {
        // Expected owner is this contract
        address expected = this;
        address seedSrc = tracking.seeds(8);
        Assert.equal(seedSrc, expected, "Owner of pet ID 8 should be recorded.");
    }

    /// test for git integration - 2
    // Testing retrieval of all pet owners
    function testGetSourceAddressBySeedIdInArray() public {
        // Expected owner is this contract
        address expected = this;
        // Store adopters in memory rather than contract's storage
        address[16] memory seedSources = tracking.getTrackingInfo();
        Assert.equal(seedSources[8], expected, "Owner of pet ID 8 should be recorded.");
    }
}