import { calculatedBalance, extractValidTokens } from "./utils"
import { ethers } from 'ethers';
import { roundDown } from "utils/helpers/utility";
import { BNToFloat } from "utils/helpers/format";
import { divide, multiply } from "precise-math";

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
            newState.isInfiniteApprovalChecked = action.payload
        }
            break
        case compoundDialogActionTypes.setUserData: {

            const tokens = extractValidTokens({ obj: action.payload }).map((token, index) => {
                const key = ('token' + index + 'Balance')
                //set the balance for selected token
                if (token.symbol === selectedToken.symbol) {
                    newState.selectedToken = { ...newState.selectedToken, balance: action.payload[key] }
                }
                return { ...token, balance: action.payload[key] }
            })
            newState.tokens = tokens
            newState.userData = action.payload
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