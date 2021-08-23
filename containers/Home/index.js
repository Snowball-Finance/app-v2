
import { memo, useEffect } from 'react'
import { Grid } from '@material-ui/core'

import CompoundAndEarn from './CompoundAndEarn'
import TotalLockedValue from './TotalLockedValue'
import TokenPairs from './TokenPairs'
import LastTransactions from './LastTransactions'
import { useDashboardContext } from 'contexts/dashboard-context'
import { useWeb3React } from '@web3-react/core'
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context'
import { useContracts } from 'contexts/contract-context'

const Home = () => {
  const { account } = useWeb3React();
  const { asked, checkUserPools } =  useDashboardContext();
  const { userPools } =  useCompoundAndEarnContract();
  const { gauges } = useContracts();
  useEffect(() => {
    if(!asked && account && userPools.length > 0 && gauges.length > 0){
      checkUserPools();
    }
  },[account,asked,userPools,gauges])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <CompoundAndEarn />
      </Grid>
      <Grid item xs={12} lg={6}>
        <TotalLockedValue />
      </Grid>
      <Grid item xs={12} lg={8}>
        <TokenPairs />
      </Grid>
      <Grid item xs={12} lg={4}>
        <LastTransactions />
      </Grid>
    </Grid>
  )
}

export default memo(Home)