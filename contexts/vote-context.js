import { createContext, useState, useContext, useMemo, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useQuery } from '@apollo/client'

import { CONTRACTS } from 'config'
import { PROPOSAL_LIST } from 'api/vote/queries'
import { useContracts } from 'contexts/contract-context'
import GOVERNANCE_ABI from 'libs/abis/vote-governance.json'
import { usePopup } from 'contexts/popup-context'

const ContractContext = createContext(null)

export function VoteContractProvider({ children }) {
  const { account, library } = useWeb3React();
  const { setPopUp } = usePopup();
  const { snowconeBalance } = useContracts()
  const [loading, setLoading] = useState(false);

  const { data: { ProposalList: { proposals = [], proposalCount = 0, quorumVotes = 0 } = {} } = {} } = useQuery(PROPOSAL_LIST);
  const governanceV2Contract = useMemo(() => library ? new ethers.Contract(CONTRACTS.VOTE.GOVERNANCE_V2, GOVERNANCE_ABI, library.getSigner()) : null, [library])

  const activeProposals = useMemo(() => {
    const activeArray = proposals.filter((proposal) => proposal.state === 'Active')
    return activeArray || []
  }, [proposals]);

  const voteProposal = useCallback(async (proposal, isFor = true) => {
    if (proposal.state !== 'Active') {
      setPopUp({
        title: 'Proposal Error',
        text: `This proposal is not active now. You cannot vote this proposal`
      })
      return;
    }

    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    if (snowconeBalance === 0) {
      setPopUp({
        title: 'Balance Error',
        text: `Do you have no enough xSnob balance to vote`
      })
      return;
    }

    setLoading(true)
    try {
      const { origin } = proposal;
      const governanceContract = new ethers.Contract(origin, GOVERNANCE_ABI, library.getSigner())
      const proposalVote = await governanceContract.vote(proposal.offset, isFor)
      const transactionVote = await proposalVote.wait(1)

      if (transactionVote.status) {
        setPopUp({
          title: 'Success',
          text: `You vote this proposal successfully`
        })
      }
    } catch (error) {
      setPopUp({
        title: 'Error',
        text: `You don\'t have enough xSnob to vote`
      })
    }
    setLoading(false)
  }, [account, library, snowconeBalance, setPopUp])

  const createProposal = useCallback(async ({
    title,
    metadata,
    votingPeriod,
    target,
    value,
    data
  }) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    if (snowconeBalance < 100000) {
      setPopUp({
        title: 'Balance Error',
        text: `Do you have no enough xSnob balance to vote`
      })
      return;
    }

    setLoading(true)
    try {
      const votePropose = await governanceV2Contract.propose(
        title,
        metadata,
        votingPeriod,
        target,
        value,
        data
      )
      const transactionPropose = await votePropose.wait(1)

      if (transactionPropose.status) {
        setPopUp({
          title: 'Success',
          text: `You vote this proposal successfully`
        })
      }
    } catch (error) {
      setPopUp({
        title: 'Error',
        text: `You don\'t have enough xSnob to vote`
      })
    }
    setLoading(false)
  }, [account, library, governanceV2Contract, setPopUp])

  return (
    <ContractContext.Provider
      value={{
        loading,
        proposals,
        activeProposals,
        proposalCount,
        quorumVotes,
        voteProposal,
        createProposal
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useVoteContract() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    loading,
    proposals,
    activeProposals,
    proposalCount,
    quorumVotes,
    voteProposal,
    createProposal
  } = context

  return {
    loading,
    proposals,
    activeProposals,
    proposalCount,
    quorumVotes,
    voteProposal,
    createProposal
  }
}