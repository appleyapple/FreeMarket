# Free Market

**Description**

Proof-of-concept of a browser-based platform for users transact Ether in exchange for merchandise. 


**Core features**

 - Web3-based market
 - Allow for transactions between buyer and seller
 - Sellers can list merchandise for sale 
 - Merchandise purchasable with Ether
 - Owner of merchandise can create or remove it from the market
 - Each merchandise is represented by a token (ERC1155), which is transferred upon transaction like a receipt


**Dev setup**

 - Deploy contract in remix environment: cd freemarket, remixd -s ., go to remix.ethereum.org
 - Run contract tests: npx hardhat test

 - Deploy contract to localhost: npx hardhat compile, npx hardhat node, npx hardhat run scripts/deploy.js --network localhost
 - webapp localhost: npm run dev

**Todo & additional features**

 - Form validation
 - Out-of-stock/unavailable alert upon purchasing more than available supply
 - Blocking page (like pinterest) if MetaMask is not detected
 - Update front-end to better suit dapp features and display UI elements properly; front-end is currently significantly inspired by https://github.com/dabit3/polygon-ethereum-nextjs-marketplace for faster dev time
 - Wipe fm every month, subscribed users are not removed?
 - ~~Burn tokens when merchandise is removed from fm~~
 - ~~My orders page~~ Implemented as My Receipts
 - ~~Allow for purchases of variable quantity~~
 - ~~Show supply of merchandise~~
 - ~~Guard re-entry attacks @ FreeMarket.sol, https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard~~

 **Known bugs**

 - ~~During merchandise transaction, buyer's ether is sent to contract instead of seller~~

