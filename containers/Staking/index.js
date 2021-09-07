
import { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import SnowLoading from 'components/SnowLoading'
import SubMenuTabs from 'parts/SubMenuTabs'
import PageHeader from 'parts/PageHeader'
import SnowBalance from './SnowBalance'
import Unlocked from './Unlocked'
import TotalLocked from './TotalLocked'
import LockForm from './LockForm'
import SnowVote from './SnowVote'
import SnowClaim from './SnowClaim'
import VoteDistribution from './VoteDistribution'
import { STAKING_TABS, STAKING_TABS_ARRAY } from 'utils/constants/staking-tabs'
import BoostCalculator from './BoostCalculator'
import { useContracts } from 'contexts/contract-context'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  tabs: {
    marginTop: theme.spacing(2)
  },
  container: {
    width: '100%',
    maxWidth: 1020
  }
}));

const Staking = () => {
  const classes = useStyles()
  const { loading, isWrongNetwork } = useContracts();

  const [selectedTab, setSelectedTab] = useState(STAKING_TABS.info.VALUE)

  return (
    <main className={classes.root}>
      {loading && <SnowLoading loading={loading} />}
      <PageHeader
        title='Staking'
        subHeader='Stake your SNOB and earn xSNOB to vote in Governance'
      />
      <SubMenuTabs
        tabs={STAKING_TABS_ARRAY}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        className={classes.tabs}
      />
      <div className={classes.container}>
        {selectedTab === STAKING_TABS.info.VALUE &&
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <SnowBalance />
            </Grid>
            <Grid item xs={12} md={5}>
              <Unlocked />
            </Grid>
            <Grid item xs={12} md={4}>
              <TotalLocked />
            </Grid>
            {isWrongNetwork
              ? (
                <Grid item xs={12}>
                  <Typography variant='body1' color='textPrimary'>
                    Please switch to Avalanche Chain.
                  </Typography>
                </Grid>
              ) : (
                <>
                  <Grid item xs={12}>
                    <LockForm />
                  </Grid>
                  <Grid item xs={12}>
                    <SnowClaim />
                  </Grid>
                  <Grid item xs={12}>
                    <BoostCalculator />
                  </Grid>
                </>
              )}
          </Grid>
        }
        {selectedTab === STAKING_TABS.vote.VALUE &&
          <Grid container spacing={2}>
            {isWrongNetwork
              ? (
                <Grid item xs={12}>
                  <Typography variant='body1' color='textPrimary'>
                    Please switch to Avalanche Chain.
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <SnowVote />
                </Grid>
              )}
          </Grid>
        }
        {selectedTab === STAKING_TABS.allocations.VALUE &&
          <Grid container spacing={2}>
            {isWrongNetwork
              ? (
                <Grid item xs={12}>
                  <Typography variant='body1' color='textPrimary'>
                    Please switch to Avalanche Chain.
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <VoteDistribution />
                </Grid>
              )}
        </Grid>
        }
      </div>
    </main>
  )
}

export default memo(Staking)