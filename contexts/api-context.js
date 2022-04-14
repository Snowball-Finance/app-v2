import { useQuery } from '@apollo/client';
import { DEPRECATED_CONTRACTS } from 'api/queries/contractList';
import { CURRENT_DISTRIBUTION_PHASE } from 'api/queries/distributionPhase';
import { NFTS_LIST } from 'api/queries/nftsList';
import { PROPOSAL_LIST } from 'api/queries/proposalList';
import { LAST_SNOWBALL_INFO } from 'api/queries/snowballInfo';
import { MULTIPLE_TRANSACTION_INFO } from 'api/queries/transactionInfo';
import { USER_LAST_DEPOSIT } from 'api/queries/userLastDeposit';
import { createContext, useContext } from 'react';

const APIContext = createContext(null);

export function APIProvider({ children }) {

  const getLastSnowballInfo = () => {
    return useQuery(LAST_SNOWBALL_INFO);
  }

  const getMultipleTransactionsInfo = (first = 10, skip = 0) => {
    return useQuery(
      MULTIPLE_TRANSACTION_INFO,
      {
        variables: {
          first: first,
          skip: skip,
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
        nextFetchPolicy: 'cache-first',
      }
    );
  }

  const getCurrentDistributionPhase = () => {
    return useQuery(CURRENT_DISTRIBUTION_PHASE);
  }

  const getDeprecatedContracts = () => {
    return useQuery(DEPRECATED_CONTRACTS);
  }

  const getNFTsList = () => {
    return useQuery(NFTS_LIST);
  };

  const getProposalList = () => {
    return useQuery(PROPOSAL_LIST);
  }

  const getUserLastDeposits = (variables) => {
    return useQuery(USER_LAST_DEPOSIT, variables);
  }

  return (
    <APIContext.Provider value={{ getCurrentDistributionPhase,getLastSnowballInfo,
      getMultipleTransactionsInfo, getNFTsList, getProposalList,
      getDeprecatedContracts, getUserLastDeposits }}>
      {children}
    </APIContext.Provider>
  );
}

export function useAPIContext() {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('Context not initialized yet.');
  }

  const { getCurrentDistributionPhase,getLastSnowballInfo, getMultipleTransactionsInfo,
     getNFTsList, getProposalList,getDeprecatedContracts, getUserLastDeposits } = context;

  return { getCurrentDistributionPhase,getLastSnowballInfo, getMultipleTransactionsInfo,
    getNFTsList, getProposalList, getDeprecatedContracts, getUserLastDeposits };
}