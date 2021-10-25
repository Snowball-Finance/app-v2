import { useQuery } from "@apollo/client";
import { DEPRECATED_CONTRACTS } from "api/queries/contractList";
import { CURRENT_DISTRIBUTION_PHASE } from "api/queries/distributionPhase";
import { NFTS_LIST } from "api/queries/nftsList";
import { PROPOSAL_LIST } from "api/queries/proposalList";
import { LAST_SNOWBALL_INFO } from "api/queries/snowballInfo";
import { MULTIPLE_TRANSACTION_INFO } from "api/queries/transactionInfo";
import { createContext, useContext, useMemo, useCallback } from "react";

const APIContext = createContext(null);

export const useLastSnowballInfo = () => useQuery(LAST_SNOWBALL_INFO);

export function APIProvider({ children }) {
  const getLastSnowballInfo = useCallback(
    () => useQuery(LAST_SNOWBALL_INFO),
    []
  );

  const getMultipleTransactionsInfo = useCallback((first = 10, skip = 0) => {
    return useQuery(MULTIPLE_TRANSACTION_INFO, {
      variables: {
        first: first,
        skip: skip,
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
      nextFetchPolicy: "cache-first",
    });
  }, []);

  const getCurrentDistributionPhase = useCallback(
    () => useQuery(CURRENT_DISTRIBUTION_PHASE),
    []
  );

  const getDeprecatedContracts = useCallback(
    () => useQuery(DEPRECATED_CONTRACTS),
    []
  );

  const getNFTsList = useCallback(() => useQuery(NFTS_LIST), []);

  const getProposalList = useCallback(() => useQuery(PROPOSAL_LIST), []);

  const value = useMemo(
    () => ({
      getCurrentDistributionPhase,
      getLastSnowballInfo,
      getMultipleTransactionsInfo,
      getNFTsList,
      getProposalList,
      getDeprecatedContracts,
    }),
    [
      getCurrentDistributionPhase,
      getLastSnowballInfo,
      getMultipleTransactionsInfo,
      getNFTsList,
      getProposalList,
      getDeprecatedContracts,
    ]
  );

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
}

export function useAPIContext() {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error("Context not initialized yet.");
  }

  const {
    getCurrentDistributionPhase,
    getLastSnowballInfo,
    getMultipleTransactionsInfo,
    getNFTsList,
    getProposalList,
    getDeprecatedContracts,
  } = context;

  return {
    getCurrentDistributionPhase,
    getLastSnowballInfo,
    getMultipleTransactionsInfo,
    getNFTsList,
    getProposalList,
    getDeprecatedContracts,
  };
}
