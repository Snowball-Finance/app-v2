import { gql } from '@apollo/client';

const GET_PAIRS_INFOS = gql`
  query pairsInfos($order: Int, $first: Int) {
    pairsInfos(order: $order, first: $first) {
      totalTVL
      pairsInfo {
        name
        totalStakedUsd
        dailyAPR
        yearlyAPR
        weeklyAPR
        dailyAPY
        weeklyAPY
        yearlyAPY
        poolInfo {
          address
          p1
          p0
          t0 {
            address
            name
            totalSupply
          }
          t1 {
            address
            name
            totalSupply
          }
        }
      }
    }
  }
`;

const GET_LATEST_PAIRS_INFO = gql`
  query getLatestPairsInfo {
    getLatestPairsInfo {
      totalTVL
      marketcap
      circulatingSupply
      snobPerBlockDay
      blockPast24hrs
      pairsInfo {
        name
        totalStakedUsd
        dailyAPR
        yearlyAPR
        weeklyAPR
        poolInfo {
          p0
          p1
          q0
          q1
          tvl
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

export { GET_PAIRS_INFOS, GET_LATEST_PAIRS_INFO, GET_TVL_INFO_LAST_SNOWBALL };
