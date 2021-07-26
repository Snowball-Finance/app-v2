import { gql } from '@apollo/client';

const LAST_SNOWBALL_INFO = gql`
  query {
    LastSnowballInfo {
      snowballToken{
        pangolinPrice
      }
      poolsInfo {
        name
        address
        lpAddress
        source
        tvlStaked
        dailyAPR
        dailyAPY
        weeklyAPY
        yearlyAPY
        performanceFees
        pricePoolToken
        token0 {
          address
        }
        token1 {
          address
        }
        token2 {
          address
        }
        gaugeInfo {
          address
          fullYearlyAPY
          snobDailyAPR
          snobWeeklyAPR
          snobYearlyAPR
          tvlStaked
          snobAllocation
        }
      }
    }
  }
`;

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


export { LAST_SNOWBALL_INFO, USER_LAST_DEPOSIT };
