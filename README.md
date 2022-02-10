# Free Market

**Description**

Proof-of-concept of a browser-based platform for users to share digital goods/services in limited quantities in exchange for Ethereum.


**Primary goals**

 - Create React.js components for common features such as wallet connection, general user/UI information, etc. for future use
 - Solidity contract to administrate app features securely and robustly


**Features TBD**

 - Web3-based market
 - Products purchasable with Ethereum
 - Products organized in a grid of cards
 - Each card should display product name, description/ToS, availably quantity, pricing
 - Each product may have an expiry date 
 - Rating for each product/user
 - Owner of a product can create or remove an item from the catalogue

**Todo**

 - Figure out why purchases send ether to the contract address instead of item seller (tested on remix)
 - Form input sanitization for new item 
 - Implement buy button
 - Display seller address in item card + creation
 - Limit item card height (description should truncate + '...')
 - Reset item states after item creation

