import React from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import TopBar from './components/TopBar';
import './App.css';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.connectWallet = this.connectWallet.bind(this);

    this.state = {
      //contract
      contractRead: null,
      contractWrite: null,

      // ui
      userAddress: '',
      connection: false, // true: connected, false: not connected
      status: '', // Loading, Error, etc, empty: display contract address
    };
  };

  async connectWallet() {
    this.setState({ status: 'Loading...' })
    if(typeof window.ethereum == 'undefined') {
        this.setState({ status: 'Error: MetaMask is required to connect' });
    } else {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result => {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                this.setState({ contractRead: new ethers.Contract(contractAddress, Greeter.abi, provider) });
                this.setState({ contractWrite: new ethers.Contract(contractAddress, Greeter.abi, signer) });
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

  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <header className="App-header">
          <TopBar 
            connectWallet={this.connectWallet}
            connection={this.state.connection}
            status={this.state.status}
            userAddress={this.state.userAddress}
            contractAddress={contractAddress}
          />
        </header>
      </div>
    );
  }
}

export default App;
