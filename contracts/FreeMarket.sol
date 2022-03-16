pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2; // For passing structs into function parameters

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


/// @title FreeMarket
/// @author Henry Yip 
/// @notice Contract should allow users to list merchandise for sale and transact Ether in exchange for merchandise 
contract FreeMarket is ERC1155, ERC1155Receiver, Ownable {

    using SafeMath for uint;
    using Counters for Counters.Counter;

    Counters.Counter private merchandiseIds; // Simple unique merchandise identifier
    Counters.Counter private merchandiseExpired; // Tracks number of removed merchandise for array size declarations

    /// @notice Merchandise catalogue 
    /// @dev Maps merchandiseId -> Merchandise token
    mapping(uint256 => Merchandise) private idToMerchandise;

    /// @notice Merchandise token to store on blockchain
    /// @dev Represented by ERC1155 token
    struct Merchandise {
        address seller;
        uint16 supply;
        uint256 price;
        uint256 merchandiseId;
        string uri; // images, seller name, seller address, merchandise name & description, etc
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

    constructor() ERC1155('') {
    }

    /// @notice For sellers to manage their own items
    modifier onlySeller(Merchandise memory _merchandise) {
        require(msg.sender == _merchandise.seller, 'Only the owner of the merchandise can perform this action');
        _;
    }

    /// @notice List merchandise for sale in WEI
    /// @dev Mints merchandise token to contract which is sent to buyer during a transaction
    /// @param _merchandiseUri: Additional merchandise metadata (description, images, etc.) is stored on IPFS, retrievable with URI
    function addMerchandise(string memory _merchandiseUri, uint16 _supply, uint256 _price) external returns (uint) {
        require(_supply >= 0, 'Cannot list negative supply');
        require(_price >= 0, 'Cannot list negative price');
        
        // Assign unique ID to merchandise
        merchandiseIds.increment();
        uint256 merchandiseId = merchandiseIds.current();

        // Mint token associated with merchandise
        _mint(address(this), merchandiseId, _supply, '');
        setMerchandiseUri(merchandiseId, _merchandiseUri);

        // Add merchandise to FreeMarket
        idToMerchandise[merchandiseId] = Merchandise(
            msg.sender,
            _supply,
            _price,
            merchandiseId,
            _merchandiseUri
        );

        emit MerchandiseAdded(msg.sender, _supply, _price, merchandiseId);
        return merchandiseId;
    }

    /// @notice For sellers to remove item from FreeMarket
    /// @dev TODO Burn tokens 
    function removeMerchandise(uint256 _merchandiseId) external onlySeller(idToMerchandise[_merchandiseId]) {
        delete(idToMerchandise[_merchandiseId]);
        merchandiseExpired.increment();
    }

    /// @notice Transfers Ether from buyer to seller based on price and quantity of the merchandise purchased
    /// @dev BUG Transferring Ether sends to contract and not the seller
    function transactMerchandise(uint256 _merchandiseId, uint16 _quantity) external payable {
        require(idToMerchandise[_merchandiseId].supply >= _quantity, 'Insufficient supply');
        require(msg.value == idToMerchandise[_merchandiseId].price * _quantity, 'Invalid payment value');
        
        // Transfer Ether
        (bool success, ) = payable(idToMerchandise[_merchandiseId].seller).call{value: msg.value}("");
        require(success, 'Payment error');
        // payable(idToMerchandise[_merchandiseId].seller).transfer(msg.value)

        // Issue receipt (merchandise token) to buyer
        _safeTransferFrom(address(this), msg.sender, _merchandiseId, _quantity, '');

        // Reflect transaction in FreeMarket
        idToMerchandise[_merchandiseId].supply = uint16(SafeMath.sub(idToMerchandise[_merchandiseId].supply, _quantity));
        emit Transaction(idToMerchandise[_merchandiseId].seller, msg.sender, _quantity, _merchandiseId);
    }

    /// @notice Gets all merchandise and returns it in an array
    /// @dev TODO Allow for filtered searches or find another solution when too many merchandise
    function fetchMerchandiseAll() public view returns (Merchandise[] memory) {
        
        // For array & loop tracking
        uint merchandiseIdCount = merchandiseIds.current();
        uint merchandiseCount = SafeMath.sub(merchandiseIds.current(), merchandiseExpired.current());
        uint currentIndex = 0;

        // Loop through merchandise in FreeMarket to save merchandise into an array
        Merchandise[] memory merchandise = new Merchandise[](merchandiseCount);
        for(uint i=0; i<merchandiseIdCount; i++) {
            if(idToMerchandise[i+1].merchandiseId != 0) { // delete(Merchandise merch) sets all merchandise attributes to 0, so valid merchandiseId should always >0
                uint currentId = idToMerchandise[i+1].merchandiseId;
                Merchandise storage currentMerchandise = idToMerchandise[currentId];
                merchandise[currentIndex] = currentMerchandise;
                currentIndex = SafeMath.add(currentIndex, 1);
            }
        }

        return merchandise;
    }

    /// @notice Gets both in-stock and out-of-stock merchandise from a specified seller
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

    /// @notice Allow for retrieval of URI in token metadata
    function uri(uint256 _merchandiseId) override public view returns (string memory) {
        return(idToMerchandise[_merchandiseId].uri);
    }

    /// @notice Inherited functions that may be useful
    // balanceOf(address account, uint256 merchandiseId)
    // _burn(address from, uint256 id, uint256 amount)

    /// @notice Sets merchandise URI within the merchandise struct
    function setMerchandiseUri(uint256 _merchandiseId, string memory _uri) private {
        require(bytes(idToMerchandise[_merchandiseId].uri).length == 0, 'Cannot set uri twice'); 
        idToMerchandise[_merchandiseId].uri = _uri;
    }

    /// @dev To fix error: "Derived contract must override function supportsInterface".
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155Receiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// @dev ERC1155Receiver implementation
    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    /// @dev ERC1155Receiver implementation
    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}