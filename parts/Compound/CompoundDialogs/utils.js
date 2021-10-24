export const calculatedBalance = ({ value, item, title }) => {
    return title != "Withdraw" ? item?.userLPBalance.mul(value).div(100) : item?.userBalanceGauge.mul(value).div(100);
};
export const calculatePercentage = ({ amount, item, title }) => {
    return title != "Withdraw" ? amount / (item?.userLPBalance / 10 ** item?.lpDecimals) * 100 : amount / (item?.userBalanceGauge / 10 ** item?.lpDecimals) * 100
};