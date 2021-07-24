import { gql } from '@apollo/client';

const LAST_SNOWBALL_INFO = gql`
  query {
    LastSnowballInfo {
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
  query LastDepositPerWallet($wallet: String!, $snowglobe: String!) {
    LastDepositPerWallet(wallet:$wallet,snowglobe:$snowglobe){
      lastBlockScanned
      lpQuantity
      slpQuantity
    }
    PoolsInfoByAddress(address:$snowglobe){
      pricePoolToken
    }
  }
`;


export { LAST_SNOWBALL_INFO, USER_LAST_DEPOSIT };
