
import EARLY_VOTER_ABI from 'libs/abis/nft/early-voter.json'
import COVID_RELIEF_ABI from 'libs/abis/nft/covid-relief.json'
import ROLLING_ABI from 'libs/abis/nft/rolling.json'
import SNOWBALL_HEAD_ABI from 'libs/abis/nft/snowball-head.json'

const getNFTABI = (address) => {
  switch (address) {
    case '0x7B097A18738cA9Fd524384Dab74c57CB12DAC724':
      return {
        type: 'EARLY_VOTER',
        abi: EARLY_VOTER_ABI
      }
    case '0xD928Ab4b54F7FD0498160Ee52AC0C92BbB9C9cb3':
      return {
        type: 'COVID_RELIEF',
        abi: COVID_RELIEF_ABI
      }
    case '0x35F268DaC74f94785135aA134deDEf7e67Db8fe3':
    case '0xB954AE9a4374751CB3d578CfA3Db96e0E5881C00':
    case '0xD65e006644D417Af6A9385182C21733762b94E83':
    case '0xae88bE7d3fE6545C688b640B427aF4bAb90e2638':
    case '0x5edd9bC699B6A613875E6760B4978d14d6EB3899':
    case '0xd66Df640A2f213B6e5087204cAee2b2145A1c1c9':
      return {
        type: 'ROLLING',
        abi: ROLLING_ABI
      }
    case '0x7B097A18738cA9Fd524384Dab74c57CB12DAC724':
      return {
        type: 'EARLY_VOTER',
        abi: EARLY_VOTER_ABI
      }
    default:
      return {
        type: 'DEFAULT_NFT',
        abi: SNOWBALL_HEAD_ABI
      }
  }
}

export default getNFTABI