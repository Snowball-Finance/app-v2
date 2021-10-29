import { ethers } from "ethers";

export const approveContractAction = async ({ contract, spender, amount, account, infiniteApproval = true }) => {
    const approvalNumber = infiniteApproval ? ethers.constants.MaxUint256 : amount
    return new Promise(async (resolve, reject) => {
        try {
            const allowance = await contract.allowance(account, spender)
            if (amount.gt(allowance)) {
                let useExact = false;
                await contract.estimateGas.approve(
                    spender,
                    ethers.constants.MaxUint256
                ).catch((error) => {
                    // general fallback for tokens who restrict approval amounts
                    console.log(error);
                    useExact = true;
                })
                const approval = await contract.approve(spender,
                    useExact
                        ? approvalNumber
                        : amount);
                const transactionApprove = await approval.wait(1);
                if (!transactionApprove.status) {
                    setPopUp({
                        title: 'Transaction Error',
                        text: `Error Approving`
                    });
                    reject(false);
                }
            }
            resolve(true)
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}
