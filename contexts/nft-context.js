import { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS } from 'config'
import getNFTABI from 'libs/abis/nft'
import GOVERNANCE_ABI from 'libs/abis/governance.json'
import { usePopup } from 'contexts/popup-context'
import { isEmpty } from 'utils/helpers/utility'
import NFT_STATUS from 'utils/constants/nft-status'
import MESSAGES from 'utils/constants/messages';
import { useAPIContext } from './api-context'
import { BNToFloat, floatToBN } from 'utils/helpers/format'
import ANIMATIONS from 'utils/constants/animate-icons'

const ContractContext = createContext(null)

export function NFTContractProvider({ children }) {
  const { account, library } = useWeb3React();
  const { setPopUp } = usePopup();

  const [loading, setLoading] = useState(false);
  const [claimNFTs, setClaimNFTs] = useState([]);
  const [shopNFTs, setShopNFTs] = useState([]);
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);

  const { getNFTsList } = useAPIContext();

  const { data: { NFTsList: nftsList = [] } = {} } = getNFTsList();
  const governanceContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.GOVERNANCE, GOVERNANCE_ABI, library.getSigner()) : null, [library])

  const getNFTData = useCallback(async () => {
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
          const mintNFTBalanceValue = BNToFloat(mintNFTBalance, 18);

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
  }, [account, library, governanceContract, nftsList])

  useEffect(() => {
    if (!isEmpty(nftsList)) {
      getNFTData();
    }
  }, [nftsList, getNFTData])

  const claimNFT = useCallback(async (item) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }

    if (item.status !== NFT_STATUS.ELIGIBLE.VALUE) {
      setPopUp({
        title: 'Claim Error',
        icon: ANIMATIONS.WARNING.VALUE,
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
          icon: ANIMATIONS.SUCCESS.VALUE,
          text: `You claimed this NFT successfully`
        })
        getNFTData()
      }
    } catch (error) {
      setPopUp({
        title: 'Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: error.message
      })
      console.log('[Error] claimNFT => ', error)
    }
    setLoading(false)
  }, [account, library, getNFTData, setLoading, setPopUp])

  const purchaseNFT = useCallback(async (item) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }
    setLoading(true)
    try {
      const { baseCost, address } = item;
      const { abi } = getNFTABI(address);
      const nftContract = new ethers.Contract(address, abi, library.getSigner())

      const overrides = { value: floatToBN(baseCost || 0) }
      const nftMint = await nftContract.mint(account, overrides);
      const transactionMint = await nftMint.wait(1);

      if (transactionMint.status) {
        setPopUp({
          title: 'Success',
          icon: ANIMATIONS.SUCCESS.VALUE,
          text: `You purchased this NFT successfully`
        })
        getNFTData()
      }
    } catch (error) {
      setPopUp({
        title: 'Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: error.message
      })
      console.log('[Error] purchaseNFT => ', error)
    }
    setLoading(false)
  }, [account, library, setLoading, setPopUp, getNFTData])

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