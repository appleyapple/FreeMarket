import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { freemarketAddress } from '../fmAddress'
import Freemarket from '../artifacts/contracts/FreeMarket.sol/FreeMarket.json'

export default function Catalogue() {

  const [catalogue, setCatalogue] = useState([])
  const [quantity, setQuantity] = useState(1) // May need to isolate for each merchandise to avoid multiple changes from different merchandise
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadCatalogue()
  }, [])

  function handleFormQuantity(event) {
    setQuantity(event.target.value.replace(/\D/,''))
  }

  async function loadCatalogue() {
    
    // Connect to contract and fetch all merchandise
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(freemarketAddress, Freemarket.abi, provider)
    const data = await contract.fetchMerchandiseAll()

    // Format merchandise and render to catalogue
    const catalogue = await Promise.all(data.map(async i => {
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
    setCatalogue(catalogue)
    setLoadingState('loaded') 
  }

  async function purchase(merchandise, quantity) {

    // Connect to contract and get buyer to sign transaction
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(freemarketAddress, Freemarket.abi, signer)

    // Buyer pays for merchandise
    try{
      const price = ethers.utils.parseUnits((merchandise.price * quantity).toString(), 'ether')
      const transaction = await contract.transactMerchandise(merchandise.merchandiseId, quantity, {
        value: price
      })
      await transaction.wait()
      loadCatalogue()

    // Alert if transaction failed
    } catch(err) {
      console.log('Insufficient supply or funds')
    }
  }

  if (loadingState === 'loaded' && !catalogue.length) return (<h1 className="px-20 py-10 text-3xl">Freemarket is empty</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            catalogue.map((merchandise, i) => (
              <div key={i} className="relative border shadow rounded-xl overflow-hidden">
                <img className='object-cover h-48 w-full' src={merchandise.image} />
                <div className="h-50 p-4">
                  <p style={{ height: '32px' }} className="text-2xl font-semibold">{merchandise.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{merchandise.description}</p>
                  </div>
                </div>
                <div className="static bottom-0 p-4">
                  <p className="text-xl font-bold">{merchandise.price} ETH, {merchandise.supply} left</p>
                  <button className="pt-2 mt-4 bg-blue-500 text-white font-bold py-2 px-12 rounded" onClick={() => purchase(merchandise, quantity)}>Buy</button>
                  <label className="pt-4 ml-2">Quantity: </label>
                  <input className="w-10" type={'number'} min={1} max={99} value={quantity} onChange={handleFormQuantity}/>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}