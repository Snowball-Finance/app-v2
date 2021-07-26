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

let provider = null;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  provider = new ethers.providers.Web3Provider(window.ethereum);
}

export {
  isServer,
  isEmpty,
  delay,
  provider
}