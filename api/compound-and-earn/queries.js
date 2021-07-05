import { gql } from '@apollo/client';

const LAST_SNOWBALL_INFO = gql`
  query {
    LastSnowballInfo {
      poolsInfo {
        name
        source
        tvlStaked
        dailyAPY
        weeklyAPY
        yearlyAPY
        performanceFees
        gaugeInfo {
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

export { LAST_SNOWBALL_INFO };
