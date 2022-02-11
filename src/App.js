import React from 'react';
import { ethers } from 'ethers';
import FreeMarket from './artifacts/contracts/FreeMarket.sol/FreeMarket.json';
import TopBar from './components/TopBar';
import ItemCard from './components/ItemCard';
import NewItemForm from './components/NewItemForm';
import './App.css';

// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const fabStyle = {
  position: 'absolute',
  bottom: 40,
  right: 40,
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.connectWallet = this.connectWallet.bind(this);
    this.newItemOpen = this.newItemOpen.bind(this);
    this.newItemClose = this.newItemClose.bind(this);
    this.createItem = this.createItem.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.state = {
      // contract  
      contractRead: null,
      contractWrite: null,

      // catalogue
      itemIdList: null,
      itemCatalogue: null,

      // ui
      userAddress: '',
      connection: false, // true: connected, false: not connected
      status: '', // Loading, Error, etc, empty: display contract address
      itemCardList: [], // list of <ItemCard>s to display

      // buttons
      newItem: false, // pop up form 

      // new item form inputs
      newItemName: '',
      newItemDescription: '',
      newItemSupply: 0,
      newItemPrice: 0,
    };
  };

  async connectWallet() {
    this.setState({ status: 'Loading...' })
    // connect to metamask
    if(typeof window.ethereum == 'undefined') {
        this.setState({ status: 'Error: MetaMask is required to connect' });
    } else {
        try {
            // connect wallet & contract
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result => {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                this.setState({ contractRead: new ethers.Contract(contractAddress, FreeMarket.abi, provider) });
                this.setState({ contractWrite: new ethers.Contract(contractAddress, FreeMarket.abi, signer) });
                return result[0];
            })
            .then(result => {
                this.setState({ connection: true });
                this.setState({ userAddress: result });
                // console.log('Wallet connected @', this.userAddress, typeof(this.userAddress))
            });
        } catch(err) {
            this.setState({ status: 'Error: Failed to connect' });
        }
    }
    this.setState({ status: '' })
  };

  async connectCatalogue() {
    this.setState({ status: 'Loading...' })
    // connect to contract
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, FreeMarket.abi, provider);
      try {
        // get item catalogue
        let itemIdList = await contract.getItemIdList();
        this.setState({ itemIdList: itemIdList });
        // draw each catalogue item to react app
        for(let i=0; i<this.state.itemIdList.length; i++) {
          const catalogueItem = await contract.itemCatalogue(this.state.itemIdList[i]);
          // console.log(catalogueItem.name, catalogueItem.description, catalogueItem.supply, ethers.utils.formatEther(catalogueItem.price), catalogueItem.seller.toString);
          this.setState({ 
            newItemName: catalogueItem.name,
            newItemDescription: catalogueItem.description,
            newItemSupply: catalogueItem.supply,
            newItemPrice: ethers.utils.formatEther(catalogueItem.price)
          })
          this.setState({ itemCardList: [...this.state.itemCardList, this.createItemCard()] })
        } 
      } catch(err) {
        this.setState({ status: 'Error: Failed to connect to catalogue' });
      }
    }
    this.setState({ status: '' })
  }

  // toggle display for new item form
  newItemOpen() {
    this.setState({ newItem: true });
  }

  newItemClose() {
    this.setState({ newItem: false });
  }

  // grabs form data and stores into states
  async handleFormSubmit(name, description, supply, price) {
    this.setState({ status: 'Loading...' })
    this.setState({ 
      newItemName: name,
      newItemDescription: description,
      newItemSupply: supply,
      newItemPrice: price
    }, this.createItem)
    this.newItemClose();
  }


  // create item in catalogue from form data & draw item card
  async createItem() {
    if(typeof window.ethereum !== 'undefined') {
      try{
        const newItem = await this.state.contractWrite.createItem(
          this.state.newItemName,
          this.state.newItemDescription,
          this.state.newItemSupply,
          this.state.newItemPrice,
        )
        await newItem.wait();
        this.setState({ itemCardList: [...this.state.itemCardList, this.createItemCard()] });
      } catch(err) {
        this.setState({ status: 'Error: Failed to create new item' })
        console.log(err);
      }
    }
    this.setState({ status:'' })
  }
  
  // helper to draw item card
  createItemCard() {
    return (
    <Grid item xs={3} key={new Date().getTime() + this.state.newItemName}>
      <ItemCard
        newItemName={this.state.newItemName}
        newItemDescription={this.state.newItemDescription}
        newItemSupply={this.state.newItemSupply}
        newItemPrice={this.state.newItemPrice}
        // newItemSeller={this.state.userAddress}
      />
    </Grid>
    );
  }

  componentDidMount() {
    this.connectCatalogue();
  }
  
  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        {/* top status bar */}
        <header className="App-header">
          <TopBar 
            connectWallet={this.connectWallet}
            connection={this.state.connection}
            status={this.state.status}
            userAddress={this.state.userAddress}
            contractAddress={contractAddress}
          />
        </header>
        {/* catalogue */}
        <Box sx={{ margin: '1em'}}>
          <Grid container spacing={3}>
            {this.state.itemCardList}
          </Grid>
          {/* list new item button */}
          <Fab color="primary" aria-label="add" sx={fabStyle} onClick={this.newItemOpen}>
            <AddIcon />
          </Fab>
        </Box>
        
        {/* pop-up form to list new item */}
        <NewItemForm
          newItemOpen={this.newItemOpen}
          newItemClose={this.newItemClose}
          handleFormSubmit={this.handleFormSubmit}
          newItem={this.state.newItem}
          newItemName={this.state.newItemName}
          newItemDescription={this.state.newItemDescription}
          newItemSupply={this.state.newItemSupply}
          newItemPrice={this.state.newItemPrice}
        />
      </div>
    );
  }
}

export default App;
