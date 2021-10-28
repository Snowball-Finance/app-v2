export const calculatedBalance = ({ value, userData, title }) => {

    return title != "Withdraw" ? userData?.userLPBalance.mul(value).div(100) : userData?.userBalanceGauge.mul(value).div(100);
};
export const calculatePercentage = ({ amount, userData, title }) => {
    return title != "Withdraw" ? amount / (userData?.userLPBalance / 10 ** userData?.lpDecimals) * 100 : amount / (userData?.userBalanceGauge / 10 ** userData?.lpDecimals) * 100
};
export const extractValidTokens = ({ obj }) => {
    const rawTokens = [obj.token0, obj.token1, obj.token2, obj.token3]
    // extract valid tokens
    return rawTokens.filter((el) => el.address)
}
