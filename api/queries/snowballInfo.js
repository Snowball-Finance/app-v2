import { gql } from '@apollo/client';


const LAST_SNOWBALL_INFO = gql`
  query {
    LastSnowballInfo{
      createdAt
      snowballTVL
      blocksPast24hrs
      snowballTVL
      snobPerBlock
      blockHeight
      snobNextPhase
      snowballToken {
        supply
        pangolinPrice
      }
      poolsInfo{
        address
        lpAddress
        name
        kind
        source
        symbol
        tvlStaked
        dailyAPR
        dailyAPY
        weeklyAPY
        yearlyAPY
        pricePoolToken
        performanceFees
        token0{
          address
          name
          symbol
          pangolinPrice
          supply
          decimals
        }
        token1{
          address
          name
          symbol
          pangolinPrice
          supply
          decimals
        }
        token2{
          address
          name
          symbol
          pangolinPrice
          supply
          decimals
        }
        token3{
          address
          name
          symbol
          pangolinPrice
          supply
          decimals
        }
        gaugeInfo{
          address
          tvlStaked
          snobDailyAPR
          snobWeeklyAPR
          snobYearlyAPR
          fullDailyAPY
          fullWeeklyAPY
          fullYearlyAPY
          snobAllocation
        }
      }
    }
  }
`;


const GET_TVL_INFO_LAST_SNOWBALL = gql`
  query {
    LastSnowballInfo {
      createdAt
      snowballTVL
      blocksPast24hrs
      snowballTVL
      snobPerBlock
      blockHeight
      snobNextPhase
      snowballToken {
        supply
        pangolinPrice
      }
    }
  }
`;

export { LAST_SNOWBALL_INFO,GET_TVL_INFO_LAST_SNOWBALL };