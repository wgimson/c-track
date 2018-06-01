pragma solidity ^0.4.17;

contract Tracking {
    address[16] public seeds;

    // Adopting a pet
    function track(uint seedId) public returns (uint) {
        require(seedId >= 0 && seedId <= 15);
        seeds[seedId] = msg.sender;
        return seedId;
    }

    // Retrieving the adopters
    function getTrackingInfo() public view returns (address[16]) {
        return seeds;
    }
}