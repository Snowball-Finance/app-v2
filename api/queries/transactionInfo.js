import { gql } from '@apollo/client';

const MULTIPLE_TRANSACTION_INFO = gql`
  query multipleTransactionInfo($first: Int!, $skip: Int) {
    MultipleTransactionInfo(first: $first, skip: $skip) {
      createdAt
      source
      ticker
      type
      hash
      valueUSD
    }
  }
`;

export { MULTIPLE_TRANSACTION_INFO };