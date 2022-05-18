import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { freemarketAddress } from '../fmAddress'
import Freemarket from '../artifacts/contracts/FreeMarket.sol/FreeMarket.json'

export default function MyReceipts() {
 
  const [myAccount, setMyAccount] = useState(null)
  const [myReceipts, setMyReceipts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadMyReceipts()
    
  }, [myAccount])

  async function connectAccount() {
    if(typeof window.ethereum == 'undefined') {
      console.log('This features requires an Ethereum wallet')
      return false
    } else {
      const myAddress = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setMyAccount(myAddress[0])
      return true
    }
  }

  async function loadMyReceipts() {

    // Try to connect to Ethereum wallet
    await connectAccount()
    .then(async () => {

      // If successfully connected, fetch receipt balances from connected account
      if(myAccount) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const contract = new ethers.Contract(freemarketAddress, Freemarket.abi, provider)
        const data = await contract.fetchReceiptsFrom(myAccount)

        // Format merchandise associated with receipts and render to catalogue
        const myReceipts = await Promise.all(data.map(async (b, i) => {
            const merchandiseReference = await contract.fetchMerchandiseById(i+1)
            const merchandiseUri = await contract.uri(merchandiseReference.merchandiseId)
            const meta = await axios.get(merchandiseUri)
            let receipt = {
                merchandiseId: merchandiseReference.merchandiseId.toNumber(),
                seller: merchandiseReference.seller,
                buyer: myAccount,
                price: ethers.utils.formatUnits(merchandiseReference.price.toString(), 'ether'),
                name: meta.data.name,
                description: meta.data.description,
                image: meta.data.image,
                quantity: b.toNumber()
            }
            return receipt
            }))
            setMyReceipts(myReceipts)
        }
    })
    setLoadingState('loaded')
  }
  
  if (loadingState === 'loaded' && myAccount && !myReceipts.length) return (<h1 className="py-10 px-20 text-3xl">No receipts</h1>)
  if (loadingState === 'loaded' && !myAccount) return (<h1 className="py-10 px-20 text-3xl">Ethereum browser wallet is required for this feature</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            myReceipts.map((receipt, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={receipt.image} className="rounded" />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{receipt.name}</p>
                  <div style={{ height: '100px', overflow: 'hidden' }}>
                    <p className="text-gray-400">Buyer: {receipt.buyer}</p>
                    <p className="text-gray-400">Seller: {receipt.seller}</p>

                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-xl font-bold text-white">Price - {receipt.price} Eth ea.</p>
                  <p className="text-xl font-bold text-white">Quantity - {receipt.quantity} purchased</p>

                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}