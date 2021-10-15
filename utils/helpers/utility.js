import { AVALANCHE_MAINNET_PARAMS, injected } from 'utils/constants/connectors';
import MESSAGES from 'utils/constants/messages';
import ANIMATIONS from 'utils/constants/animate-icons';
import { UnsupportedChainIdError } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { MAX_RETRIES } from 'config';
import { ethers } from 'ethers';

const isServer = () => typeof window === 'undefined';

const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

const delay = ms => new Promise(res => setTimeout(res, ms));

const addAvalancheNetwork = () => {
  injected.getProvider().then(provider => {
    provider
      .request({
        method: 'wallet_addEthereumChain',
        params: [AVALANCHE_MAINNET_PARAMS]
      })
      .catch((error) => {
        console.log(error)
      })
  })
};

const handleConnectionError = (error) => {
  if (error instanceof NoEthereumProviderError) {
    return {
      message: MESSAGES.CONNECT_NO_ETHEREUM_PROVIDER_ERROR,
      button: 'Download Metamask',
      confirmAction: metaMaskInstallHandler
    }
  } else if (error instanceof UnsupportedChainIdError) {
    return {
      message: MESSAGES.CONNECT_UNSUPPORTED_CHAIN_ID_ERROR,
      icon: ANIMATIONS.WARNING.VALUE,
      button: 'Switch to Avalanche',
      confirmAction: addAvalancheNetwork
    }
  } else if (
    error instanceof UserRejectedRequestErrorInjected
  ) {
    return {
      message: MESSAGES.CONNECT_ACCESS_AVALANCHE_ERROR,
      button: 'OK'
    }
  } else {
    return {
      message: MESSAGES.CONNECT_UNKNOWN_ERROR,
      button: 'OK'
    }
  }
}

const metaMaskInstallHandler = () => {
  window.open('https://metamask.io/download', '_blank');
}

const roundDown = (value, decimals = 18) => {
  const valueString = value.toString();
  const integerString = valueString.split('.')[0];
  const decimalsString = valueString.split('.')[1];
  if (!decimalsString) {
    return integerString
  }
  return `${integerString}.${decimalsString.slice(0, decimals)}`;
}

const getBalanceWithRetry = async (contract, account) => {
  let balance = ethers.BigNumber.from("0");

  let currentDepth = 0;
  while ((!balance.gt("0x0")) && (MAX_RETRIES > currentDepth)) {
    balance = await contract.balanceOf(account);
    currentDepth++;
  }
  return balance;
}

const getBestStaticProvider = async (library) => {
  const PRIVATENODE = process.env.PRIVATENODE;

  const privateProvider = new ethers.providers.
    StaticJsonRpcProvider(`${PRIVATENODE}ext/bc/C/rpc`);
  //if there's a wallet connected
  try {
    let provider;

    if (library) {
      provider = library.getSigner().provider;
    } else {
      provider = new ethers.providers.
        StaticJsonRpcProvider(`${AVALANCHE_MAINNET_PARAMS.rpcUrls[0]}`);
    }
    await provider.getBalance('0x0100000000000000000000000000000000000000');
    return provider
  } catch (error) {
    console.error(error);
    return privateProvider;
  }
}

export {
  isServer,
  isEmpty,
  delay,
  roundDown,
  AVALANCHE_MAINNET_PARAMS,
  addAvalancheNetwork,
  handleConnectionError,
  metaMaskInstallHandler,
  getBalanceWithRetry,
  getBestStaticProvider
}