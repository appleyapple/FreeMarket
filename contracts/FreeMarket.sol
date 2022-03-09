pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2; // For passing structs into function parameters

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


/// @title FreeMarket
/// @author Henry Yip 
/// @notice Contract should allow users to transact Ether and list merchandise for sale 
contract FreeMarket {

    using SafeMath for uint;
    using Counters for Counters.Counter;

    Counters.Counter private merchandiseIds; // Simple unique merchandise identifier
    Counters.Counter private merchandiseExpired; // Tracks number of sold out or removed merchandise for array size declarations

    /// @notice FreeMarket contract owner
    address payable owner;

    /// @notice Merchandise catalogue 
    /// @dev Maps merchandiseId -> Merchandise
    mapping(uint256 => Merchandise) private idToMerchandise;

    /// @notice Merchandise item & metadata to store on blockchain
    /// @dev Can scale to other types of merchandise i.e. NFTs
    struct Merchandise {
        address seller;
        uint16 supply;
        uint256 price;
        uint256 merchandiseId;
    }

    event MerchandiseAdded (
        address _seller,
        uint16 _supply,
        uint256 _price,
        uint256 _merchandiseId
    );

    event Transaction(
        address _seller, 
        address _buyer, 
        uint16 _quantity,
        uint256 _merchandiseId
    );

    constructor() {
        owner = payable(msg.sender);
    }

    /// @notice For sellers to manage their own items
    modifier onlySeller(Merchandise memory _merchandise) {
        require(msg.sender == _merchandise.seller);
        _;
    }

    /// @notice Transfers Ether from buyer to seller based on price and quantity of the merchandise purchased
    /// @dev TODO Issue receipts for both buyer and seller 
    function transactMerchandise(uint256 _merchandiseId, uint16 _quantity) external payable {
        require(idToMerchandise[_merchandiseId].supply >= _quantity, 'Insufficient supply');
        require(msg.value == idToMerchandise[_merchandiseId].price * _quantity, 'Invalid payment value');
        
        // Transfer Ether
        (bool success, ) = payable(idToMerchandise[_merchandiseId].seller).call{value: msg.value}("");
        require(success, 'Payment error');

        // Reflect transaction in FreeMarket
        idToMerchandise[_merchandiseId].supply = uint16(SafeMath.sub(idToMerchandise[_merchandiseId].supply, _quantity));
        merchandiseExpired.increment();
        emit Transaction(idToMerchandise[_merchandiseId].seller, msg.sender, _quantity, _merchandiseId);
    }

    /// @notice List merchandise for sale
    /// @dev Additional merchandise metadata (description, images, etc.) are not stored on chain
    function addMerchandise(uint16 _supply, uint256 _price) external {
        
        // Assign unique ID to merchandise
        merchandiseIds.increment();
        uint256 merchandiseId = merchandiseIds.current();

        // Add merchandise to FreeMarket
        idToMerchandise[merchandiseId] = Merchandise(
            msg.sender,
            _supply,
            _price,
            merchandiseId
        );
        emit MerchandiseAdded(msg.sender, _supply, _price, merchandiseId);
    }

    /// @notice For sellers to remove item from FreeMarket
    function removeMerchandise(uint256 _merchandiseId) external onlySeller(idToMerchandise[_merchandiseId]) {
        delete(idToMerchandise[_merchandiseId]);
        merchandiseExpired.increment();
    }

    /// @notice Gets all available merchandise and returns it in an array
    /// @dev Will have to scale to allow for filtered searches or find another solution when too many merchandise
    function fetchMerchandiseAll() public view returns (Merchandise[] memory) {
        
        // For array & loop tracking
        uint merchandiseIdCount = merchandiseIds.current();
        uint merchandiseCount = SafeMath.sub(merchandiseIds.current(), merchandiseExpired.current());
        uint currentIndex = 0;

        // Loop through merchandise in FreeMarket to save in-stock merchandise into an array
        Merchandise[] memory merchandise = new Merchandise[](merchandiseCount);
        for(uint i=0; i<merchandiseIdCount; i++) {
            if(idToMerchandise[i+1].supply > 0) {
                uint currentId = idToMerchandise[i+1].merchandiseId;
                Merchandise storage currentMerchandise = idToMerchandise[currentId];
                merchandise[currentIndex] = currentMerchandise;
                currentIndex = SafeMath.add(currentIndex, 1);
            }
        }

        return merchandise;
    }

    /// @notice Gets merchandise from a specified seller
    function fetchMerchandiseFrom(address _seller) public view returns (Merchandise[] memory) {
        
        // For array & loop tracking
        uint merchandiseIdCount = merchandiseIds.current();
        uint merchandiseCount = 0;
        uint currentIndex = 0;

        // Determine return array size
        for(uint i=0; i<merchandiseIdCount; i++) {
            if(idToMerchandise[i+1].seller == _seller) {
                merchandiseCount = SafeMath.add(merchandiseCount, 1);
            }
        }

        // Loop through FreeMarket to save merchandise from specified seller into array
        Merchandise[] memory merchandise = new Merchandise[](merchandiseCount);
        for(uint i=0; i<merchandiseIdCount; i++) {
            if(idToMerchandise[i+1].seller == _seller) {
                uint currentId = idToMerchandise[i+1].merchandiseId;
                Merchandise storage currentMerchandise = idToMerchandise[currentId];
                merchandise[currentIndex] = currentMerchandise;
                currentIndex = SafeMath.add(currentIndex, 1);
            }
        }

        return merchandise;
    }

}