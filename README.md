# Free Market

**Description**

Proof-of-concept of a browser-based platform for users transact Ether in exchange for merchandise.


**Primary goals**

 - Allow for transactions between buyer and seller
 - Sellers can list merchandise for sale 


**Features**

 - Web3-based market
 - Merchandise purchasable with Ether
 - Owner of merchandise can create or remove it from the market
 - Each merchandise is represented by a token (ERC1155), which is transferred upon transaction as a receipt


**Dev setup**

 - contract remix environment: cd freemarket, remixd -s ., go to remix.ethereum.org
 - webapp localhost:

**Todo**

 - Refactor to guard re-entry attacks @ FreeMarket.sol, https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard
 - Blocking page (like pinterest) if MetaMask is not detected
 - ?Allow sellers to update supply of merchandise
 - ?Burn tokens when merchandise is removed from fm

 **Known bugs**

 - During merchandise transaction, buyer's ether is sent to contract instead of seller

