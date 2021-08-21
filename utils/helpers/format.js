import { ethers } from "ethers";
import { isEmpty, roundDown } from "./utility";

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

//this function doesnt parse scientific notation floats, you need
//to use toLocaleString if you want to avoid it
export const floatToBN = (number, decimals = 18) => {
  try{
    if(!isEmpty(number)){
      return ethers.utils.parseUnits(roundDown(number,decimals),decimals);
    }else{
      return ethers.utils.parseUnits("0");
    }
  }catch(error){
    console.error(error.message);
  }
}

export const BNToString = (bn, decimals = 18) => {
  try{
    return ethers.utils.formatUnits(bn,decimals).toLocaleString(undefined,{minimumFractionDigits:decimals});
  }catch(error){
    console.error(error.message);
  }
}

//be aware that converting too big or too small numbers to float will
//cause it to be converted to scientific notation
export const BNToFloat = (bn, decimals = 18) => {
  try{
    return Number(bn / 10 ** decimals);
  }catch(error){
    console.error(error.message);
  }
}
