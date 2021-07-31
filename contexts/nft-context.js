import { createContext, useState, useContext, useMemo, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS } from 'config'
import { NFTS_LIST } from 'api/nft-marketplace/queries'
import getNFTABI from 'libs/abis/nft'
import GOVERNANCE_ABI from 'libs/abis/governance.json'
import { usePopup } from 'contexts/popup-context'
import { isEmpty } from 'utils/helpers/utility'
import NFT_STATUS from 'utils/constants/nft-status'

const ContractContext = createContext(null)

export function NFTContractProvider({ children }) {
  const { account, library } = useWeb3React();
  const { setPopUp } = usePopup();

  const [loading, setLoading] = useState(false);
  const [claimNFTs, setClaimNFTs] = useState([]);
  const [shopNFTs, setShopNFTs] = useState([]);
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);

  const { data: { NFTsList: nftsList = [] } = {} } = useQuery(NFTS_LIST);
  const governanceContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.GOVERNANCE, GOVERNANCE_ABI, library.getSigner()) : null, [library])

  useEffect(() => {
    if (!isEmpty(nftsList)) {
      getNFTData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, nftsList])

  const getNFTData = async () => {
    let claimNFTs = []
    let shopNFTs = []
    let purchasedNFTs = []

    setLoading(true)
    for (const item of nftsList) {
      const { category, address } = item;

      if (account) {
        const { abi, type } = getNFTABI(address);
        const nftContract = new ethers.Contract(address, abi, library.getSigner());

        if (category === 'Claimmable') {
          let newItem = { ...item, status: NFT_STATUS.NOT_DONATE.VALUE }

          if (type === 'EARLY_VOTER') {
            const userVote1 = await governanceContract.getVote(1, account)
            const userVote2 = await governanceContract.getVote(2, account)

            if (!!userVote1 || !!userVote2) {
              const userEarlyVoteBalance = await nftContract.balanceOf(account)
              newItem = {
                ...newItem,
                status: userEarlyVoteBalance > 0 ? NFT_STATUS.CLAIMED.VALUE : NFT_STATUS.ELIGIBLE.VALUE
              }

              if (userEarlyVoteBalance > 0) {
                purchasedNFTs = [
                  ...purchasedNFTs,
                  newItem
                ]
              }
            }
          }

          if (type === 'COVID_RELIEF') {
            const covidReliefEligible = await nftContract.Wallets(account)
            if (!!covidReliefEligible) {
              const covidReliefBalance = await nftContract.balanceOf(account)

              newItem = {
                ...newItem,
                status: covidReliefBalance > 0 ? NFT_STATUS.CLAIMED.VALUE : NFT_STATUS.ELIGIBLE.VALUE
              }
              if (covidReliefBalance > 0) {
                purchasedNFTs = [
                  ...purchasedNFTs,
                  newItem
                ]
              }
            }
          }

          claimNFTs = [
            ...claimNFTs,
            newItem
          ]
        } else {
          shopNFTs = [...shopNFTs, item]
          const mintNFTBalance = await nftContract.balanceOf(account)
          const mintNFTBalanceValue = parseFloat(ethers.utils.formatUnits(mintNFTBalance, 18));

          if (mintNFTBalanceValue > 0) {
            purchasedNFTs = [
              ...purchasedNFTs,
              item
            ]
          }
        }
      } else {
        if (category === 'Claimmable') {
          claimNFTs = [
            ...claimNFTs,
            {
              ...item,
              status: NFT_STATUS.NOT_DONATE.VALUE
            }
          ]
        } else {
          shopNFTs = [...shopNFTs, item]
        }
      }
    }

    setClaimNFTs(claimNFTs)
    setShopNFTs(shopNFTs)
    setPurchasedNFTs(purchasedNFTs)
    setLoading(false)
  }

  const claimNFT = async (item) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    if (item.status !== NFT_STATUS.ELIGIBLE.VALUE) {
      setPopUp({
        title: 'Claim Error',
        text: `You cannot claim this NFT`
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
        nftClaim = await nftContract.claim(account)
      }

      if (type === 'COVID_RELIEF') {
        nftClaim = await nftContract.mint(account)
      }

      const transactionClaim = await nftClaim.wait(1);
      if (transactionClaim.status) {
        setPopUp({
          title: 'Success',
          text: `You claimed this NFT successfully`
        })
        getNFTData()
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
      const nftMint = await nftContract.mint(account, overrides);
      const transactionMint = await nftMint.wait(1);

      if (transactionMint.status) {
        setPopUp({
          title: 'Success',
          text: `You purchased this NFT successfully`
        })
        getNFTData()
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
        purchasedNFTs,
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
    purchasedNFTs,
    purchaseNFT,
    claimNFT
  } = context

  return {
    loading,
    claimNFTs,
    shopNFTs,
    purchasedNFTs,
    purchaseNFT,
    claimNFT
  }
}