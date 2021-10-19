import { ethers } from "ethers";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { isEmpty, roundDown } from "./utility";

export const formatPercent = (decimal: number = 0): string => {
  return (decimal * 100).toFixed(2);
};

export const formatAPY = (apy: number): string => {
  if (apy === Number.POSITIVE_INFINITY) return "∞%";
  return apy.toFixed(2) + "%";
};

export const formatNumber = (num: BigNumberish, precision?: number, exponencial?: boolean): string =>
 num ?
    //exponencial for numbers too big/too small
    (exponencial && (num > 10 ** 5 || num < 1e-3)) ?
      Number(num).toExponential(5)
    :
      num.toLocaleString()
  :
    parseFloat("0").toFixed((precision || 0));

//this function doesnt parse scientific notation floats, you need
//to use toLocaleString if you want to avoid it
export const floatToBN = (number?: number, decimals: number = 18): BigNumber | undefined => {
  try{
    if(!isEmpty(number)){
      return ethers.utils.parseUnits(roundDown(number,decimals),decimals);
    }else{
      return ethers.utils.parseUnits("0");
    }
  }catch(error){
    // TODO: remove later dvd: https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

export const BNToString = (bn: BigNumberish, decimals: string | BigNumberish = 18): string | undefined => {
  try{
    return ethers.utils.formatUnits(bn, decimals).toLocaleString();
  }catch(error){
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

//be aware that converting too big or too small numbers to float will
//cause it to be converted to scientific notation
export const BNToFloat = (bn: any, decimals: number = 18): number | undefined => {
  try{
    return Number(bn / 10 ** decimals);
  }catch(error){
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
