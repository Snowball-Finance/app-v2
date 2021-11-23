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
            newState.isInfiniteApprovalChecked = action.payload
        }
            break
        case compoundDialogActionTypes.setUserData: {

            let tokens = extractValidTokens({ obj: action.payload })
            //if there's wrapped AVAX single staking
            if(tokens.length === 1 && tokens.find(o => o.address === WAVAX)) {
                tokens.push({
                    addresses: ["0x0"],
                    address: "0x0",
                    decimals: 18,
                    pangolinPrice: action.payload.pricePoolToken,
                    name: "Avalanche",
                    symbol: "AVAX",
                    balance: action.payload.userAVAXBalance
                })
                newState.hasAVAX = true
            }

            newState.tokens = tokens.map((token, index) => {
                //set the balance for selected token
                const key = ('token' + index + 'Balance')
                //not AVAX
                let balance
                if(token.address !== "0x0") {
                    balance = action.payload[key]
                } else {
                    balance = floatToBN(action.payload.userAVAXBalance)
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
        case compoundDialogActionTypes.setSliderValue: {
            const value = action.payload
            const usedBalance = selectedToken.balance.mul(value).div(100)
            if (selectedToken.balance && (BNToFloat(usedBalance) > 0 || value === 0)) {
                const inputAmount = (usedBalance / 10 ** userData?.lpDecimals)
                newState.mixedTokenValue = calculatedBalance({ userData, title, value })
                newState.amount = usedBalance
                newState.inputAmount = inputAmount > 1e-6 ? inputAmount : Number(inputAmount).toLocaleString('en-US', { maximumSignificantDigits: 18 })
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