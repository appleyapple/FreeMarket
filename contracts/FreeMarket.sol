pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2; // for passing structs into function parameters

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


/// @title Digital shop
/// @author Henry Yip 
/// @notice Contract should allow users to purchase an item with ether and post products for sale 
contract FreeMarket {

    using SafeMath for uint;

    struct Item {
        address seller;
        string name;
        string description;
        uint16 supply;
        uint256 price;
        uint256 id;
    }

    event transaction(address _buyer, address _seller, string _itemName);

    /// @notice Storage variables
    /// @dev itemIdList order is not maintained
    uint256[] public itemIdList; // array of IDs per item for sale
    mapping (uint256 => Item) public itemCatalogue;  // mapping of item IDs to item

    /// @notice Modifier for sellers to manage their own items
    modifier onlySeller(Item memory _item) {
        require(msg.sender == _item.seller);
        _;
    }

    /// @notice One time purchase; transfers ether from buyer to seller based on price and quantity of the item purchased
    /// @dev No actual item implemented, currently just decrements item supply and prints to console
    function buy(uint256 _itemId, uint16 _quantity) public payable {
        require(itemCatalogue[_itemId].supply >= _quantity, 'Insufficient supply');
        // require(msg.value == itemCatalogue[_itemId].price * _quantity, 'Payment value invalid');
        // address payable seller = payable(itemCatalogue[_itemId].seller);
        // (bool success, ) = seller.call{value: msg.value}("");
        // require(success, 'Payment error');
        // seller.transfer(msg.value);
        payable(0xDd89C395dF8fE36D39Be8E4470EaCd34aAA2F981).transfer(10);
        transactItem(itemCatalogue[_itemId], _quantity);
        emit transaction(msg.sender, payable(0xDd89C395dF8fE36D39Be8E4470EaCd34aAA2F981), itemCatalogue[_itemId].name);
    }

    /// @notice Handles item transaction by decreasing supply of item in catalogue and prints to console
    /// @dev Implement actual item transfer and event in the future
    function transactItem(Item storage _item, uint16 _quantity) private {
        itemCatalogue[_item.id].supply = uint16(SafeMath.sub(itemCatalogue[_item.id].supply, _quantity));
        console.log(_quantity, _item.name, 'has been sold!');
    }

    /// @notice Create an item for sale, adds it to the catalogue, and stores the itemId
    /// @dev itemId is not unique if seller creates items with the same name; throw error
    function createItem(string memory _name, string memory _description, uint16 _supply, uint256 _price) public returns (bool) {
        uint256 itemId = uint256(keccak256(abi.encodePacked(_name, msg.sender)));
        if (itemCatalogue[itemId].id != 0) {
            return false; // item already exists
        } else {
            itemCatalogue[itemId] = Item(msg.sender, _name, _description, _supply, _price, itemId);
            itemIdList.push(itemId);
            return true;
        }
    }

    /// @notice Remove item from catalogue
    /// @dev Only the seller can remove their item from the catalogue
    function removeItem(uint256 _itemId) public onlySeller(itemCatalogue[_itemId]) {
        int index = getIndexFromId(_itemId);
        if(index >= 0) {
            delete(itemCatalogue[_itemId]);
            itemIdList[uint(index)] = itemIdList[SafeMath.sub(itemIdList.length, 1)];
            itemIdList.pop();
            // uint256[] memory itemIdListCopy = itemIdList; // make edits to storage array on a copy to reduce gas fees
            // itemIdListCopy[uint(index)] = itemIdListCopy[itemIdListCopy.length - 1];
            // itemIdList = itemIdListCopy.pop(); // cannot pop, splice from memory array :(
        }
    }

    /// @notice Checks if an item exists
    /// @dev Returns index of item in itemIdList; if return value is -1, the item was not found
    function getIndexFromId(uint256 _itemId) private view returns (int) {
        for(int i=0; i<int(itemIdList.length); i++) {
            if(itemIdList[uint(i)] == _itemId) {
                return i;
            }
        }
        return -1;
    }

    /// @notice Custom getters function for itemIdList 
    /// @dev Returns list of strings instead for JS readability
    function getItemIdList() public view returns (string[] memory) {
        string[] memory itemIdStrings = new string[](itemIdList.length);
        for(uint i=0; i<itemIdList.length; i++) {
            itemIdStrings[i] = (Strings.toString(itemIdList[i]));
        }
        return itemIdStrings;
    }

    /// @notice Gets seller address from itemId
    /// @dev Called by react frontend to draw item cards
    function getSellerFromId(uint256 _itemId) external view returns (address) {
        return itemCatalogue[_itemId].seller;
    }

    /// @notice Gets itemId from item name + seller
    /// @dev Used for frontend to identify an item by name and seller
    function getItemIdFromNameSeller(string memory _name, address _seller) external pure returns (uint256) {
        uint256 itemId = uint256(keccak256(abi.encodePacked(_name, _seller)));
        return itemId;
    }
}
