import { ethers } from 'ethers'

const isServer = () => typeof window === 'undefined'

const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

const delay = ms => new Promise(res => setTimeout(res, ms));

const provider = new ethers.providers.getDefaultProvider('https://api.avax.network/ext/bc/C/rpc')

const roundDown = (number, decimals = 18) => (Math.floor(parseFloat(number) * Math.pow(10, decimals)) / Math.pow(10, decimals))

export {
  isServer,
  isEmpty,
  delay,
  roundDown,
  provider
}