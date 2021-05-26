import { gql } from '@apollo/client';

const GET_PAIRS_INFOS = gql`
  query pairsInfos($order: Int, $first: Int) {
    pairsInfos (order: $order, first: $first){
      totalTVL,
      pairsInfo{ 
        name, 
        totalStakedUsd, 
        dailyAPR, 
        yearlyAPR, 
        weeklyAPR, 
        dailyAPY, 
        weeklyAPY, 
        yearlyAPY, 
        poolInfo{
            address, 
          p1, p0, 
          t0{address, name, totalSupply}, 
          t1{address, name, totalSupply}
      }}
    } 
  }
`;

export {
  GET_PAIRS_INFOS
};
