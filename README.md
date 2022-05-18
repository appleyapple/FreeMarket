# Free Market

**Description**

Proof-of-concept of a browser-based platform for users transact Ether in exchange for merchandise. 


**Core features**

 - Web3 marketplace
 - Allow for transactions between buyer and seller
 - Sellers can list merchandise for sale 
 - Merchandise purchasable with Ether
 - Owner of merchandise can create or remove it from the market
 - Each merchandise is represented by a token (ERC1155), which is transferred upon transaction like a receipt


**Dependencies**
 - MetaMask Google Chrome extension
 - NPM


**Deploy locally**
 
 1. Install dependencies: npm install
 2. Setup Metamask: Download MetaMask Chrome Extension, create new account (do not have to use it)
 3. Start local node: (NEW TERMINAL) npx hardhat compile, npx hardhat node
 4. Switch to Localhost 8545 Network: Metamask -> Ethereum Mainnet (Top dropdown) -> Localhost 8545; skip step 5 if successfully connected to Localhost 8545
 5. Add Localhost 8545 network to Metamask if not already listed: Metamask -> settings -> networks -> add network {network name: Localhost 8545, RPC URL: http://localhost:8545, chain ID: 1337, Currency symbol: ETH}
 6. Import test account: metamask -> top right icon -> import account -> one of the accounts listed from output of step 3 to MetaMask
 7. Deploy contract to localhost: (NEW TERMINAL) npx hardhat run scripts/deploy.js --network localhost
 8. Update contract address in fmAddress.js with output of previous command (it will probably be the same)
 9. Start webapp: (NEW TERMINAL) npm run dev
 10. metamask -> settings -> advanced -> reset account (general fix for bugs related to Nonce)


**Debugging**

 - Deploy contract in remix environment: cd freemarket, remixd -s ., go to remix.ethereum.org
 - Run contract tests: npx hardhat test


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

