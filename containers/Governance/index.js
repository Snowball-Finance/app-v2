
import { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import PageHeader from 'parts/PageHeader'
import SubMenuTabs from 'parts/SubMenuTabs'
import ActiveProposals from './ActiveProposals'
import AllProposals from './AllProposals'
import NewProposal from './NewProposal'
import { VOTE_TABS, VOTE_TABS_ARRAY } from 'utils/constants/vote-tabs'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  tabs: {
    marginTop: theme.spacing(2)
  }
}));

const Governance = () => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(VOTE_TABS.active.VALUE)

  return (
    <main className={classes.root}>
      <PageHeader
        title='Governance'
        subHeader='Use xSNOB to vote for proposals'
      />
      <SubMenuTabs
        tabs={VOTE_TABS_ARRAY}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        className={classes.tabs}
      />
      {selectedTab === VOTE_TABS.active.VALUE && <ActiveProposals />}
      {selectedTab === VOTE_TABS.all.VALUE && <AllProposals />}
      {selectedTab === VOTE_TABS.newProposal.VALUE && <NewProposal />}
    </main>
  )
}

export default memo(Governance)
