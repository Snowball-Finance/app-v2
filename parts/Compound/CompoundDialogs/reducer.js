import { calculatedBalance, extractValidTokens } from "./utils"
import { ethers } from 'ethers';
import { roundDown } from "utils/helpers/utility";
import { BNToFloat, floatToBN } from "utils/helpers/format";
import { divide, multiply } from "precise-math";
import { storage, StorageKeys } from "utils/storage";
import { WAVAX } from "utils/constants/addresses";

export const compoundDialogActionTypes = {
    setSliderValue: 'setSliderValue',
    setInputValue: 'setInputValue',
    setApproved: 'setApproved',
    setInfiniteApprovalCheckboxValue: 'setInfiniteApprovalCheckboxValue',
    setSlippage: 'setSlippage',
    setPriceImpact: 'setPriceImpact',
    setShowAdvanced: 'setShowAdvanced',
    setUserData: 'setUserData',
    reset: 'reset',
}

export const compoundDialogReducer = (state, action) => {
    const newState = { ...state }
    const { title, userData, selectedToken } = newState

    switch (action.type) {

        case compoundDialogActionTypes.reset: {
            return { ...newState, ...action.payload }
        }
        case compoundDialogActionTypes.setInfiniteApprovalCheckboxValue: {
            storage.write(StorageKeys.infiniteApproval, action.payload)
            newState.isInfiniteApproval = action.payload
        }
            break
        case compoundDialogActionTypes.setShowAdvanced: {
            storage.write(StorageKeys.showAdvanced, action.payload)
            newState.showAdvanced = action.payload
        }
        case compoundDialogActionTypes.setSlippage: {
            storage.write(StorageKeys.slippage, action.payload)
            newState.slippage = action.payload
        }
            break
        case compoundDialogActionTypes.setInfiniteApprovalCheckboxValue: {
            storage.write(StorageKeys.infiniteApproval, action.payload)
            newState.isInfiniteApproval = action.payload
        }
            break
        case compoundDialogActionTypes.setUserData: {

            let tokens = extractValidTokens({ obj: action.payload })

            if (tokens.length > 1 && action.payload.kind === "Snowglobe") {
                //if its an LP
                tokens.push({
                    addresses: [action.payload.lpAddress],
                    address: action.payload.lpAddress,
                    decimals: action.payload.lpDecimals,
                    pangolinPrice: action.payload.pricePoolToken,
                    name: action.payload.name,
                    symbol: action.payload.symbol,
                    balance: action.payload.userLPBalance,
                    isLpToken: true
                })
            } else if(tokens.length === 1 && action.payload.kind === "Snowglobe") {
                tokens[0].isLpToken = true;
            }
            //we probably want to change this later on the API to inform us when a token is a metatoken
            const WAVAXToken = tokens.find(o => o.address.toLowerCase() === WAVAX.toLowerCase());
            if (
                action.payload.kind !== "Stablevault" 
            ) {
                if (tokens.length > 1 || WAVAXToken) {
                    newState.hasAVAX = tokens.length === 1 && WAVAXToken;
                    tokens.push({
                        addresses: ["0x0"],
                        address: "0x0",
                        decimals: 18,
                        pangolinPrice: Number(action.payload.prices.AVAX),
                        name: "AVAX",
                        symbol: "AVAX",
                        balance: action.payload.userAVAXBalance,
                        isNativeAVAX: true
                    })
                }
            }

            newState.tokens = tokens.map((token, index) => {
                //set the balance for selected token
                const key = ('token' + index + 'Balance')
                //not AVAX
                let balance
                if(token.address === "0x0") {
                    balance = floatToBN(action.payload.userAVAXBalance)
                } else if(token.isLpToken){
                    balance = action.payload.userLPBalance
                } else {
                    balance = action.payload[key]
                }
    
                if (token.symbol === selectedToken.symbol) {
                    newState.selectedToken = { ...newState.selectedToken, balance }
                }
                return { ...token, balance }
            })
            let s4VaultToken;
            if (newState.pool.kind === 'Stablevault') {
                s4VaultToken = {
                    addresses: tokens.map(token => token.address),
                    // useless, just to have something in address field
                    address: tokens[0].address,
                    decimals: 18,
                    pangolinPrice: action.payload.pricePoolToken,
                    name: action.payload.name,
                    symbol: action.payload.symbol,
                    balance: action.payload.userLPBalance
                }
            }
            newState.userData = action.payload
            newState.userData.s4VaultToken = s4VaultToken
        }
            break
        case compoundDialogActionTypes.setApproved: {
            newState.approved = action.payload
        }
            break
        case compoundDialogActionTypes.setPriceImpact: {
            const hasWAVAX = newState.tokens.find(o => o.address.toLowerCase() === WAVAX.toLowerCase());

            const selectedAddress = selectedToken.address === "0x0" && hasWAVAX  
                ? WAVAX.toLowerCase()
                : hasWAVAX ?
                    selectedToken.address.toLowerCase() 
                    : newState.tokens[0].address.toLowerCase()

            const baseToken = newState.tokens.find(
                o => o.address.toLowerCase() === selectedAddress)

            const totalTokens = (action.payload.swap[baseToken.address].reserve / 10 ** baseToken.decimals) 
            const amount = (action.payload.swap[baseToken.address].amount / 10 ** baseToken.decimals) 

            newState.priceImpact = (amount/totalTokens) * 100
            newState.tokensSwapOut = action.payload.swap
        }
            break
        case compoundDialogActionTypes.setSliderValue: {
            const value = action.payload
            const usedBalance = selectedToken.balance.mul(value).div(100)
            if (selectedToken.balance && (BNToFloat(usedBalance) > 0 || value === 0)) {
                
                const inputAmount = (usedBalance / 10 ** selectedToken.decimals)
                newState.mixedTokenValue = calculatedBalance({ userData, title, value })
                newState.amount = usedBalance
                newState.inputAmount = inputAmount > 1e-6 
                    ? inputAmount 
                    : Number(inputAmount).toLocaleString('en-US', { maximumSignificantDigits: selectedToken.decimals })

                newState.error = null
                newState.sliderValue = action.payload
            }
        }
            break

        case compoundDialogActionTypes.setInputValue: {
            const value = action.payload
            const balance = BNToFloat(newState.selectedToken.balance)
            if (value > 0 && !Object.is(NaN, value) && balance > 0) {
                const percentage = multiply(divide(value, BNToFloat(newState.selectedToken.balance)), 100)
                if (balance >= value) {
                    newState.inputAmount = value
                    newState.amount = ethers.utils.parseUnits(roundDown(value).toString(), 18)
                    newState.sliderValue = Number(percentage.toString().split('.')[0])
                    newState.error = null

                } else {
                    newState.error = `Can't exceed the max limit`
                }
            } else {
                newState.amount = ethers.BigNumber.from(0)
                newState.inputAmount = 0
            }
        }
            break
        default:
            break
    }
    return newState

}