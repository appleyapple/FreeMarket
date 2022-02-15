# Free Market

**Description**

Proof-of-concept of a browser-based platform for users to share digital goods/services in limited quantities in exchange for Ethereum.


**Primary goals**

 - Create React.js components for common features such as wallet connection, general user/UI information, etc. for future use
 - Solidity contract to administrate app features securely and robustly
 - Familiarize with Solidity/Ethers/React stack


**Features TBD**

 - Web3-based market
 - Products purchasable with Ethereum
 - Products organized in a grid of cards
 - Each card should display product name, description/ToS, availably quantity, pricing
 - Each product may have an expiry date 
 - Rating for each product/user
 - Owner of a product can create or remove an item from the catalogue

**Todo**

 - 

 **Known bugs**

 - buy function (payable(address).call()/transfer()) in contract sends ether to contract instead of seller even when address is hardcoded, maybe needs withdraw function (think of how seller will withdraw)? https://docs.soliditylang.org/en/v0.8.11/common-patterns.html?highlight=transfer#withdrawal-from-contracts


