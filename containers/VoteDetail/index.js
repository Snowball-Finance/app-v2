
import { memo, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'react-feather'

import { useVoteContract } from 'contexts/vote-context'
import LinkButton from 'components/UI/Buttons/LinkButton'
import PageHeader from 'parts/PageHeader'
import XSnowballCard from 'parts/Vote/XSnowballCard'
import VoteDetailHeader from './VoteDetailHeader'
import VoteForAction from './VoteForAction'
import VoteAgainstAction from './VoteAgainstAction'
import VoteDetailInfo from './VoteDetailInfo'
import VoteChange from './VoteChange'
import VoteMetaInfo from './VoteMetaInfo'
import { isEmpty } from 'utils/helpers/utility'
import LINKS from 'utils/constants/links'

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

const VoteDetail = () => {
  const classes = useStyles();
  const router = useRouter();
  const { proposals, getProposalReceipt } = useVoteContract();
  const [proposalReceipt, setProposalReceipt] = useState({});

  const proposal = useMemo(() => proposals.find((proposal) => proposal.index === parseInt(router.query.proposal, 10))
    , [router.query.proposal, proposals]);

  useEffect(() => {
    const getReceipt = async () => {
      const proposalReceipt = await getProposalReceipt(proposal.offset)
      setProposalReceipt(proposalReceipt);
    }

    if (!isEmpty(proposal)) {
      getReceipt()
    }
  }, [proposal, getProposalReceipt, setProposalReceipt]);

  return (
    <main className={classes.root}>
      <PageHeader
        title='Governance'
        subHeader='To vote you must stake your SNOB for xSNOB.'
      />
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12}>
          <LinkButton className={classes.backLink} href={LINKS.VOTE.HREF}>
            <ArrowLeft size={20} /> Go back to all proposals
          </LinkButton>
        </Grid>
        {!isEmpty(proposal) &&
          <>
            <Grid item xs={12} md={8}>
              <VoteDetailHeader proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={4}>
              <XSnowballCard />
            </Grid>
            {proposal.state === 'Active' && (proposalReceipt?.hasVoted || false) &&
              <Grid item xs={12}>
                <VoteChange
                  proposal={proposal}
                  proposalReceipt={proposalReceipt}
                />
              </Grid>
            }
            <Grid item xs={12} md={6}>
              <VoteForAction proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={6}>
              <VoteAgainstAction proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={8}>
              <VoteDetailInfo proposal={proposal} />
            </Grid>
            <Grid item xs={12} md={4}>
              <VoteMetaInfo proposal={proposal} />
            </Grid>
          </>
        }
      </Grid>
    </main>
  )
}

export default memo(VoteDetail)