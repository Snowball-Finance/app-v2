import { createContext, useState, useContext, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS } from 'config'
import { NFTS_LIST } from 'api/nft-marketplace/queries'
import getNFTABI from 'libs/abis/nft'
import GOVERNANCE_ABI from 'libs/abis/governance.json'
import { usePopup } from 'contexts/popup-context'

const ContractContext = createContext(null)

export function NFTContractProvider({ children }) {
  const { account, library } = useWeb3React();
  const { setPopUp } = usePopup();
  const [loading, setLoading] = useState(false);

  const { data: { NFTsList: nftsList = [] } = {} } = useQuery(NFTS_LIST);
  const governanceContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.GOVERNANCE, GOVERNANCE_ABI, library.getSigner()) : null, [library])

  const claimNFTs = useMemo(() => nftsList.filter((item) => item.category === 'Claimmable'), [nftsList]);
  const shopNFTs = useMemo(() => nftsList.filter((item) => item.category !== 'Claimmable'), [nftsList]);

  const claimNFT = async (item) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }
    setLoading(true)
    try {
      const { address } = item;
      const { abi, type } = getNFTABI(address);
      const nftContract = new ethers.Contract(address, abi, library.getSigner())

      let nftClaim = {}
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

        nftClaim = await nftContract.claim(account)
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

        nftClaim = await nftContract.mint(account)
      }

      const transactionClaim = await nftClaim.wait(1);
      if (transactionClaim.status) {
        setPopUp({
          title: 'Success',
          text: `You claimed this NFT successfully`
        })
      }
    } catch (error) {
      setPopUp({
        title: 'Error',
        text: `You don\'t have enough AVAX to buy this NFT`
      })
      console.log('[Error] claimNFT => ', error)
    }
    setLoading(false)
  }

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
      const { baseCost, address } = item;
      const { abi } = getNFTABI(address);
      const nftContract = new ethers.Contract(address, abi, library.getSigner())

      const overrides = { value: ethers.utils.parseEther((baseCost || 0).toString()) }
      const nftMint = await nftContract.approve(account, overrides);
      const transactionMint = await nftMint.wait(1);

      if (transactionMint.status) {
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
        loading,
        claimNFTs,
        shopNFTs,
        purchaseNFT,
        claimNFT
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
    loading,
    claimNFTs,
    shopNFTs,
    purchaseNFT,
    claimNFT
  } = context

  return {
    loading,
    claimNFTs,
    shopNFTs,
    purchaseNFT,
    claimNFT
  }
}