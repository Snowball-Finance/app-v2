
import { memo, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'react-feather'

import { useVoteContract } from 'contexts/vote-context'
import LinkButton from 'components/UI/Buttons/LinkButton'
import PageHeader from 'parts/PageHeader'
import XSnowballCard from 'parts/Vote/XSnowballCard'
import VoteHistory from 'parts/Vote/ProposalVoteHistory'
import ProposalDetailHeader from './ProposalDetailHeader'
import ProposalAction from './ProposalAction'
import ProposalDetailInfo from './ProposalDetailInfo'
import ProposalMetaInfo from './ProposalMetaInfo'
import { isEmpty } from 'utils/helpers/utility'
import LINKS from 'utils/constants/links'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { BNToFloat } from 'utils/helpers/format'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: theme.custom.layout.maxDesktopWidth,
    marginTop: theme.spacing(2)
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'unset'
  }
}));

const ProposalDetails = () => {
  const classes = useStyles();
  const { account } = useWeb3React();
  const router = useRouter();
  const { proposals, governanceV2Contract } = useVoteContract();
  const [proposalReceipt, setProposalReceipt] = useState({});
  const [voted, setVoted] = useState(true);

  const proposal = useMemo(() => proposals.find((proposal) => proposal.index === parseInt(router.query.proposal, 10))
    , [router.query.proposal, proposals]);

  useEffect(() => {
    const getReceipt = async () => {
      if (account && voted) {
        try {
          const proposalIdValue = ethers.utils.parseUnits(proposal.offset.toString(), 0);
          const receipt = await governanceV2Contract.getReceipt(proposalIdValue, account);
          const votes = BNToFloat(receipt[2], 18);
          setProposalReceipt({
            hasVoted: receipt[0] || false,
            support: receipt[1] || false,
            votes
          });
          setVoted(false);
        } catch (error) {
          console.log('error => ', error)
        }
      }
    }
    if (!isEmpty(proposal)) {
      getReceipt()
    }
  }, [proposal, setProposalReceipt, account, governanceV2Contract, voted]);

  return (
    <main className={classes.root}>
      <PageHeader
        title='Governance'
        subHeader='Use xSNOB to vote for proposals'
      />
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12}>
          <LinkButton className={classes.backLink} href={LINKS.GOVERNANCE.HREF}>
            <ArrowLeft size={20} /> Go back to all proposals
          </LinkButton>
        </Grid>
        {!isEmpty(proposal) &&
          <>
            <Grid item xs={12} md={8}>
              <ProposalDetailHeader proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={4}>
              <XSnowballCard />
            </Grid>
            <Grid item xs={12}>
              <VoteHistory
                proposal={proposal}
                proposalReceipt={proposalReceipt}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProposalAction action='For' proposal={proposal} setVoted={setVoted} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProposalAction action='Against' proposal={proposal} setVoted={setVoted} />
            </Grid>
            <Grid item xs={12} md={8}>
              <ProposalDetailInfo proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProposalMetaInfo proposal={proposal} />
            </Grid>
          </>
        }
      </Grid>
    </main>
  )
}

export default memo(ProposalDetails)