import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'

import { freemarketAddress } from '../fmAddress'
import Freemarket from '../artifacts/contracts/FreeMarket.sol/FreeMarket.json'

export default function MyShop() {
 
  const [myAccount, setMyAccount] = useState(null)
  const [myCatalogue, setMyCatalogue] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()

  useEffect(() => {
    loadMyShop()
    
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

  async function loadMyShop() {

    // Try to connect to Ethereum wallet
    await connectAccount()
    .then(async () => {

      // If successfully connected, fetch merchandise listed by the connected account
      if(myAccount) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const contract = new ethers.Contract(freemarketAddress, Freemarket.abi, provider)
        const data = await contract.fetchMerchandiseFrom(myAccount)

        // Format merchandise and render to catalogue
        const myCatalogue = await Promise.all(data.map(async i => {
          const merchandiseUri = await contract.uri(i.merchandiseId)
          const meta = await axios.get(merchandiseUri)
          let merchandise = {
            merchandiseId: i.merchandiseId.toNumber(),
            seller: i.seller,
            price: ethers.utils.formatUnits(i.price.toString(), 'ether'),
            supply: i.supply,
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
          }
          return merchandise
        }))
        setMyCatalogue(myCatalogue)
      }
    })
    setLoadingState('loaded')
  }
  
  if (loadingState === 'loaded' && myAccount && !myCatalogue.length) return (<h1 className="py-10 px-20 text-3xl">My shop is empty</h1>)
  if (loadingState === 'loaded' && !myAccount) return (<h1 className="py-10 px-20 text-3xl">Ethereum browser wallet is required for this feature</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            myCatalogue.map((merchandise, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={merchandise.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {merchandise.price} Eth</p>
                  <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => console.log('todo')}>Edit</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}