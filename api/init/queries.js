import { gql } from '@apollo/client';

const LAST_SNOWBALL_INFO = gql`
  query {
    LastSnowballInfo{
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

const CURRENT_DISTRIBUTION_PHASE = gql`
  query {
    CurrentDistributionPhase{
      startDate
      nextDate
      snobDistributed
    }
  }
`;

export {
  LAST_SNOWBALL_INFO, CURRENT_DISTRIBUTION_PHASE
};
