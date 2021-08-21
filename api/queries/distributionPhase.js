import { gql } from '@apollo/client';

const CURRENT_DISTRIBUTION_PHASE = gql`
  query {
    CurrentDistributionPhase{
      startDate
      nextDate
      snobDistributed
    }
  }
`;

export { CURRENT_DISTRIBUTION_PHASE };