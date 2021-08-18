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

const MULTIPLE_PAIRS_INFO = gql`
  query multiplePairsInfo($first: Int!, $grouped: Boolean) {
    MultiplePairsInfo(first: $first, grouped: $grouped) {
      createdAt
      pairs {
        name
        source
        kind
        status
        tvlStaked
        grouped
        token0 {
          address
          name
          symbol
          pangolinPrice
        }
        token1 {
          address
          name
          symbol
          pangolinPrice
        }
        token2 {
          address
          name
          symbol
          pangolinPrice
        }
        token3 {
          address
          name
          symbol
          pangolinPrice
        }
      }
    }
  }
`;

export { MULTIPLE_PAIRS_INFO,GET_PAIRS_INFOS,GET_LATEST_PAIRS_INFO };