import { ethers } from "ethers";

export const approveContract = async ({ contract, spender, amount }) => {
    return await contract.approve(spender, amount)
}

export const approveContractAction = async ({ contract, spender, amount, account, infiniteApproval = true }) => {
    const approvalNumber = infiniteApproval ? ethers.constants.MaxUint256 : amount
    return new Promise(async (resolve, reject) => {
        try {
            const allowance = await contract.allowance(account, spender)
            if (amount.gt(allowance)) {
                const approval = await approveContract({
                    contract,
                    spender,
                    amount: approvalNumber
                })
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
