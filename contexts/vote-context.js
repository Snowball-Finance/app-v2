import { createContext, useState, useContext, useMemo, useCallback } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { useWeb3React } from '@web3-react/core'
import { CONTRACTS } from 'config'
import { useContracts } from 'contexts/contract-context'
import GOVERNANCE_ABI from 'libs/abis/vote-governance.json'
import { usePopup } from 'contexts/popup-context'
import { useAPIContext } from './api-context'
import MESSAGES from 'utils/constants/messages';
import { minimumForProposal, minimumVotingPeriod, maximumVotingPeriod } from 'utils/constants/voting-limits'
import ANIMATIONS from 'utils/constants/animate-icons'

const ContractContext = createContext(null);

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

  const voteProposal = useCallback(async (proposal, isFor = true, setVoted) => {
    if (proposal.state !== 'Active') {
      setPopUp({
        title: 'Proposal Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: `This proposal is not active now. You cannot vote on this proposal`
      });
      return;
    }

    if (!account) {
      setPopUp({
        title: 'Network Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }

    if (snowconeBalance === 0) {
      setPopUp({
        title: 'Insufficient Balance',
        icon: ANIMATIONS.ERROR.VALUE,
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
          icon: ANIMATIONS.SUCCESS.VALUE,
          text: `You voted on this proposal successfully`
        });
        setVoted(true);
      }
    } catch (error) {
      setPopUp({
        title: 'Error Voting!',
        icon: ANIMATIONS.ERROR.VALUE,
        text: `${error.message}`
      })
    }
    setLoading(false)
  }, [account, library, snowconeBalance, setPopUp]);


const createProposal = useCallback(async (
  title,
  metadata,
  votingPeriod,
  newProposalCallback
) => {
  if (!account) {
    setPopUp({
      title: 'Network Error',
      text: MESSAGES.METAMASK_NOT_CONNECTED
    })
    return;
  }

  if (snowconeBalance < minimumForProposal) {
    setPopUp({
      title: 'Insufficient Balance',
      text: `You do not have enough xSnob to create a proposal`
    })
    return;
  }

  if (votingPeriod > maximumVotingPeriod || votingPeriod < minimumVotingPeriod) {
    setPopUp({
      title: 'Invalid Voting Period',
      text: `Voting period must be between ${minimumVotingPeriod} and ${maximumVotingPeriod} days`
    })
    return;
  }

  setLoading(true)

  let metadataURI;

  try {
    const res = await axios.request({
      method: "POST",
      url: process.env.IPFS_API_URL,
      data: JSON.stringify(metadata),
      headers: {
        'Content-Type': "application/json",
      }
    });

    if (res.status == 201 && res.headers["ipfs-hash"]) {
      console.log("Proposal metadata hash: ", res.headers["ipfs-hash"])
      metadataURI = process.env.IPFS_API_URL + res.headers["ipfs-hash"]
    } else {
      throw Error("Unexpected IPFS error")
    }
  } catch (error) {
    console.log(error);

    if (metadata.discussion || metadata.document) {
      setPopUp({
        title: 'Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: `An error occured while trying to submit your proposal`
      });
    } else {
      metadataURI = metadata.description
    }
  }

  const propose = await governanceV2Contract.propose(
    title,
    metadataURI,
    votingPeriod * (3600 * 24),
    account,
    0,
    0x00
  ).catch(err => {
    if (err.code == 4001) {
      setPopUp({
        title: 'Rejected',
        icon: ANIMATIONS.ERROR.VALUE,
        text: `You rejected creating this proposal`
      })
    } else {
      setPopUp({
        title: 'Internal Error',
        text: err.data.message
      })
    }
    console.log(err)
  });

  if (propose) {
    const proposeTx = await propose.wait(1);

    if (proposeTx.status) {
      setPopUp({
        title: 'Success',
        icon: ANIMATIONS.SUCCESS.VALUE,
        text: `Your proposal was submitted successfully`,
        confirmAction: newProposalCallback
      })
    }
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
      governanceV2Contract,
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
    governanceV2Contract,
    voteProposal,
    createProposal
  } = context

  return {
    loading,
    proposals,
    activeProposals,
    proposalCount,
    quorumVotes,
    governanceV2Contract,
    voteProposal,
    createProposal
  }
}