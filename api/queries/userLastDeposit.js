import { gql } from '@apollo/client';

const USER_LAST_DEPOSIT = gql`
query ListLastDepositsPerWallet($wallet: String!) {
  ListLastDepositsPerWallet(wallet:$wallet){
      snowglobeAddress
      lastBlockScanned
      lpQuantity
      slpQuantity
    }
  }
`;

export { USER_LAST_DEPOSIT };