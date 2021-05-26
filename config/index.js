
const IS_MAINNET = true;

const C_CHAIN_ID = IS_MAINNET ? 43114 : 43113

const CONTRACTS = IS_MAINNET
  ? {
    SNOWBALL: '0xc38f41a296a4493ff429f1238e030924a1542e50',
  } : {
    SNOWBALL: '0xF319e2f610462F846d6e93F51CdC862EEFF2a554',
  }

const PROXY_URL = 'https://snob-backend-api.herokuapp.com/graphql'

export {
  C_CHAIN_ID,
  CONTRACTS,
  PROXY_URL
}