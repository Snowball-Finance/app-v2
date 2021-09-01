import { gql } from '@apollo/client';

const DEPRECATED_CONTRACTS = gql`
  query {
    DeprecatedContracts{
      kind
      source
      pair
      contractAddresses
    }
  }
`;

export { DEPRECATED_CONTRACTS };