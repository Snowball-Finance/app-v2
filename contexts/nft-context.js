import { createContext, useState, useContext, useMemo } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

import { CONTRACTS, C_CHAIN_ID } from 'config'
import getNFTABI from 'libs/abis/nft'
import GOVERNANCE_ABI from 'libs/abis/governance.json'
import { usePopup } from 'contexts/popup-context'

const ContractContext = createContext(null)

export function NFTContractProvider({ children }) {
  const { account, library, chainId } = useWeb3React();
  const { setPopUp } = usePopup();
  const [loading, setLoading] = useState(false);

  const isWrongNetwork = useMemo(() => chainId !== C_CHAIN_ID, [chainId])
  const governanceContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.GOVERNANCE, GOVERNANCE_ABI, library.getSigner()) : null, [library])

  const purchaseNFT = async (item) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }
    setLoading(true)
    try {
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider()
      const web3 = new Web3(ethereumProvider)

      const { baseCost, address } = item;
      const { abi, type } = getNFTABI(address);
      const nftContract = new ethers.Contract(address, abi, library.getSigner())

      let hash = ''
      if (type === 'EARLY_VOTER') {
        const userVote1 = await governanceContract.getVote(1, account)
        const userVote2 = await governanceContract.getVote(2, account)
        if (!userVote1 && !userVote2) {
          setPopUp({
            title: 'Network Error',
            text: `You did not vote`
          })
          setLoading(false)
          return;
        }

        const userEarlyVoteBalance = await nftContract.balanceOf(account)
        if (userEarlyVoteBalance > 0) {
          setPopUp({
            title: 'Alert',
            text: `Already Claimed`
          })
          setLoading(false)
          return;
        }

        const response = await nftContract.claim(account)
        hash = response.hash;
      }

      if (type === 'COVID_RELIEF') {
        const covidReliefEligible = await nftContract.Wallets(account)
        if (!covidReliefEligible) {
          setPopUp({
            title: 'Network Error',
            text: `You did not donate`
          })
          setLoading(false)
          return;
        }

        const covidReliefBalance = await nftContract.balanceOf(account)
        if (covidReliefBalance > 0) {
          setPopUp({
            title: 'Alert',
            text: `Already Claimed`
          })
          setLoading(false)
          return;
        }

        const response = await nftContract.mint(account)
        hash = response.hash;
      }

      if (type === 'SNOWBALL_HEAD' || type === 'ROLLING') {
        const overrides = {
          value: ethers.utils.parseEther((baseCost || 0).toString()),
        }
        const response = await nftContract.mint(account, overrides)
        hash = response.hash;
      }

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(hash)
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
        setPopUp({
          title: 'Success',
          text: `You purchased this NFT successfully`
        })
      }
    } catch (error) {
      setPopUp({
        title: 'Error',
        text: `You don\'t have enough AVAX to buy this NFT`
      })
      console.log('[Error] purchaseNFT => ', error)
    }
    setLoading(false)
  }

  return (
    <ContractContext.Provider
      value={{
        isWrongNetwork,
        loading,
        purchaseNFT
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useNFTContract() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    isWrongNetwork,
    loading,
    purchaseNFT
  } = context

  return {
    isWrongNetwork,
    loading,
    purchaseNFT
  }
}