import { useQuery } from '@apollo/client';
import { CURRENT_DISTRIBUTION_PHASE } from 'api/queries/distributionPhase';
import { NFTS_LIST } from 'api/queries/nftsList';
import { MULTIPLE_PAIRS_INFO } from 'api/queries/pairsInfo';
import { PROPOSAL_LIST } from 'api/queries/proposalList';
import { LAST_SNOWBALL_INFO } from 'api/queries/snowballInfo';
import { MULTIPLE_TRANSACTION_INFO } from 'api/queries/transactionInfo';
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

  const getPairsInfo = () => {
    return useQuery(MULTIPLE_PAIRS_INFO, {
      variables: { first: 1, grouped: true },
    });
  }

  const getCurrentDistributionPhase = () => {
    return useQuery(CURRENT_DISTRIBUTION_PHASE);
  }

  const getNFTsList = () => {
    return useQuery(NFTS_LIST);
  };

  const getProposalList = () => {
    return useQuery(PROPOSAL_LIST);
  }

  return (
    <APIContext.Provider value={{ getCurrentDistributionPhase,getLastSnowballInfo,
      getMultipleTransactionsInfo, getNFTsList, getPairsInfo, getProposalList, }}>
      {children}
    </APIContext.Provider>
  );
}

export function useAPIContext() {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('Missing stats context');
  }

  const { getCurrentDistributionPhase,getLastSnowballInfo, getMultipleTransactionsInfo,
     getNFTsList, getPairsInfo, getProposalList } = context;

  return { getCurrentDistributionPhase,getLastSnowballInfo, getMultipleTransactionsInfo,
    getNFTsList, getPairsInfo, getProposalList };
}