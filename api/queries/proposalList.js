import { gql } from '@apollo/client';

const PROPOSAL_LIST = gql`
  query {
    ProposalList{
      proposalCount
      quorumVotes
      proposals{
        index
        origin
        offset
        title
        duration
        startDate
        endDate
        state
        forVotes
        againstVotes
        proposer
        metadata
        details
      }
    }
  }
`;

export { PROPOSAL_LIST };