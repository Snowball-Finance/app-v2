
export const formatPercent = (decimal = 0) => {
  return (decimal * 100).toFixed(2);
};

export const formatAPY = (apy) => {
  if (apy === Number.POSITIVE_INFINITY) return "∞%";
  return apy.toFixed(2) + "%";
};

export const formatNumber = (num, precision, exponencial = false) =>
 num ?
    //exponencial for numbers too big/too small
    (exponencial && (num > 10 ** 5 || num < 1e-3)) ?
      Number(num).toExponential(5)
    :
      num.toLocaleString(undefined, {
        minimumFractionDigits: precision || 2,
        maximumFractionDigits: precision || 2})
  :
    0;
