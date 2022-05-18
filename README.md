# Free Market

**Description**

Proof-of-concept of a browser-based platform for users transact Ether in exchange for merchandise. Requires MetaMask browser extension.


**Core features**

 - Web3-based market
 - Allow for transactions between buyer and seller
 - Sellers can list merchandise for sale 
 - Merchandise purchasable with Ether
 - Owner of merchandise can create or remove it from the market
 - Each merchandise is represented by a token (ERC1155), which is transferred upon transaction like a receipt


**Debugging**

 - Deploy contract in remix environment: cd freemarket, remixd -s ., go to remix.ethereum.org
 - Run contract tests: npx hardhat test


**Deploy locally**
 
 - Add local test network to Metamask: Metamask -> settings -> networks -> add network {network name: Localhost 8545, RPC URL: http://localhost:8545, chain ID: 1337, Currency symbol: ETH}
 - Install dependencies: npm install
 - Start local node: (NEW TERMINAL) npx hardhat compile, npx hardhat node, add one of the accounts listed to MetaMask
 - Deploy contract to localhost: (NEW TERMINAL) npx hardhat run scripts/deploy.js --network localhost
 - Update contract address in fmAddress.js with output of previous command
 - Start webapp: (NEW TERMINAL) npm run dev
 - metamask -> settings -> advanced -> reset account (general fix for bugs related to Nonce)


**Todo & additional features**

 - Improve form validation
 - Out-of-stock/unavailable alert upon purchasing more than available supply
 - Blocking page (like pinterest) if MetaMask is not detected
 - Allow multiple images for merchandise
 - ~~Fixed image size and reorganized card info UI~~
 - ~~Option to remove merchandise from catalogue~~
 - ~~Burn tokens when merchandise is removed from fm~~
 - ~~My orders page~~ Implemented as My Receipts
 - ~~Allow for purchases of variable quantity~~
 - ~~Show supply of merchandise~~
 - ~~Guard re-entry attacks @ FreeMarket.sol, https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard~~

 **Known bugs**

 - ~~During merchandise transaction, buyer's ether is sent to contract instead of seller~~

