import { createContext, useState, useContext, useMemo, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS } from 'config'
import { useContracts } from 'contexts/contract-context'
import GOVERNANCE_ABI from 'libs/abis/vote-governance.json'
import { usePopup } from 'contexts/popup-context'
import { useAPIContext } from './api-context'
import { BNToFloat } from 'utils/helpers/format'
import MESSAGES from 'utils/constants/messages';

const ContractContext = createContext(null)

export function VoteContractProvider({ children }) {
  const { account, library } = useWeb3React();
  const { setPopUp } = usePopup();
  const { snowconeBalance } = useContracts()
  const [loading, setLoading] = useState(false);

  const { getProposalList } = useAPIContext();
  const { data: { ProposalList: { proposals = [], proposalCount = 0, quorumVotes = 0 } = {} } = {} } = getProposalList();
  const governanceV2Contract = useMemo(() => library ? new ethers.Contract(CONTRACTS.VOTE.GOVERNANCE_V2, GOVERNANCE_ABI, library.getSigner()) : null, [library])

  const activeProposals = useMemo(() => {
    const activeArray = proposals.filter((proposal) => proposal.state === 'Active')
    return activeArray || []
  }, [proposals]);

  const voteProposal = useCallback(async (proposal, isFor = true) => {
    if (proposal.state !== 'Active') {
      setPopUp({
        title: 'Proposal Error',
        text: `This proposal is not active now. You cannot vote on this proposal`
      })
      return;
    }

    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }

    if (snowconeBalance === 0) {
      setPopUp({
        title: 'Insufficient Balance',
        text: `Not enough xSnob balance to vote`
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
          text: `You voted on this proposal successfully`
        })
      }
    } catch (error) {
      setPopUp({
        title: 'Insufficient Balance',
        text: `You don\'t have enough xSnob to vote`
      })
    }
    setLoading(false)
  }, [account, library, snowconeBalance, setPopUp])

  const getProposalReceipt = useCallback(async (proposalId) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }

    try {
      const proposalIdValue = ethers.utils.parseUnits(proposalId.toString(), 0)
      const proposalReceipt = await governanceV2Contract.getReceipt(proposalIdValue, account)
      const votes = BNToFloat(proposalReceipt[2], 18)
      return {
        hasVoted: proposalReceipt[0] || false,
        support: proposalReceipt[1] || false,
        votes
      }
    } catch (error) {
      console.log('error => ', error)
    }
  }, [account, governanceV2Contract, setPopUp])

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
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }

    if (snowconeBalance < 100000) {
      setPopUp({
        title: 'Insufficient Balance',
        text: `You do not have enough xSnob to create a proposal`
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
          text: `You voted on this proposal successfully`
        })
      }
    } catch (error) {
      setPopUp({
        title: 'Error',
        text: `You don\'t have enough xSnob to vote`
      })
    }
    setLoading(false)
  }, [account, snowconeBalance, governanceV2Contract, setPopUp])

  return (
    <ContractContext.Provider
      value={{
        loading,
        proposals,
        activeProposals,
        proposalCount,
        quorumVotes,
        getProposalReceipt,
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
    getProposalReceipt,
    voteProposal,
    createProposal
  } = context

  return {
    loading,
    proposals,
    activeProposals,
    proposalCount,
    quorumVotes,
    getProposalReceipt,
    voteProposal,
    createProposal
  }
}