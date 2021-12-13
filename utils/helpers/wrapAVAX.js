import { ethers } from "ethers";
import { WAVAX } from "utils/constants/addresses";
import WETH_ABI from 'libs/abis/weth.json';

export const wrapAVAX = async (amount, signer) => {
    const WAVAXContract = new ethers.Contract(WAVAX, WETH_ABI, signer);
    const AVAXDeposit = await WAVAXContract.deposit( {value: amount.toHexString()} );
    //wait 8 blocks confirmation to be safe
    const transactionAVAXDeposit = await AVAXDeposit.wait(8);
    if (!transactionAVAXDeposit.status) {
        return false
    }
    return true;
}