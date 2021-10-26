import { calculatedBalance, calculatePercentage } from "./utils"
import { ethers } from 'ethers';
import { roundDown } from "utils/helpers/utility";

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
    const { title, userData } = newState


    switch (action.type) {

        case compoundDialogActionTypes.reset: {
            return { ...action.payload }
        }
        case compoundDialogActionTypes.setInfiniteApprovalCheckboxValue: {
            newState.isInfiniteApprovalChecked = action.payload
        }
            break
        case compoundDialogActionTypes.setUserData: {
            newState.userData = action.payload
        }
            break
        case compoundDialogActionTypes.setApproved: {
            newState.approved = action.payload
        }
            break
        case compoundDialogActionTypes.setSliderValue: {
            const value = action.payload
            const usedBalance = calculatedBalance({ userData, title, value });
            const inputAmount = (usedBalance / 10 ** userData?.lpDecimals);

            newState.amount = usedBalance
            newState.inputAmount = inputAmount > 1e-6 ? inputAmount : Number(inputAmount).toLocaleString('en-US', { maximumSignificantDigits: 18 })
            newState.error = null
            newState.sliderValue = action.payload
        }
            break

        case compoundDialogActionTypes.setInputValue: {
            const value = action.payload
            if (value > 0 && !Object.is(NaN, value)) {
                const percentage = calculatePercentage({ amount: value, userData, title });
                const balance = title != "Withdraw" ? userData?.userLPBalance / 10 ** userData?.lpDecimals : userData?.userBalanceGauge / 10 ** userData?.lpDecimals;
                if (balance >= value) {
                    newState.inputAmount = value
                    newState.amount = ethers.utils.parseUnits(roundDown(value).toString(), 18)
                    newState.sliderValue = percentage
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