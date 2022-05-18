import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { freemarketAddress } from '../fmAddress'
import Freemarket from '../artifacts/contracts/FreeMarket.sol/FreeMarket.json'

export default function Sell() {
  
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ name: '', description: '', supply: '',  price: ''})
  const router = useRouter()

  // Upload merchandise images to IPFS and save URL to state
  async function onChange(e) {
    const files = e.target.files[0]
    // console.log(files[0])
    try {
      const added = await client.add(files)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
      console.log(url)
    } catch (error) {
      console.log('Error uploading files: ', error)
    }  
  }

  // Upload merchandise metadata to IPFS, returns URL 
  async function uploadToIPFS() {
    const { name, description, supply, price } = formInput

    // Simple form validation
    if (!name || !description || !supply || !price || !fileUrl) return
    
    const data = JSON.stringify({
      name, description, image: fileUrl
    })

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
      return url
    } catch (error) {
      console.log('Error uploading files: ', error)
    }  
  }

  // List merchandise for sale 
  async function addMerchandiseToCatalogue() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    // Add merchandise to catalogue
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(freemarketAddress, Freemarket.abi, signer)
    let transaction = await contract.addMerchandise(url, formInput.supply, price)
    await transaction.wait()

    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          required
        />
        <input
          placeholder="Supply"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, supply: e.target.value })}
          required
        />
        <input
          placeholder="Price in ETH"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          required
        />
        <input
          type="file" multiple
          name="Merchandise"
          className="my-4"
          onChange={onChange}
          required
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={addMerchandiseToCatalogue} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
          Add merchandise to Freemarket
        </button>
      </div>
    </div>
  )
}