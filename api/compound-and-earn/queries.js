import { gql } from '@apollo/client';

const LAST_SNOWBALL_INFO = gql`
  query {
    LastSnowballInfo {
      poolsInfo {
        name
        kind
        dailyAPY
        weeklyAPY
        yearlyAPY
        tvlStaked
        performanceFees
        gaugeInfo {
          dailyAPY
          weeklyAPY
          yearlyAPY
          tvlStaked
          snobAllocation
        }
      }
    }
  }
`;

export { LAST_SNOWBALL_INFO };
