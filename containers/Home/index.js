
import { memo, useEffect, useState } from 'react'
import { Grid, Link, Typography } from '@material-ui/core'

import CompoundAndEarn from './CompoundAndEarn'
import TotalLockedValue from './TotalLockedValue'
import TokenPairs from './TokenPairs'
import LastTransactions from './LastTransactions'
import { useDashboardContext } from 'contexts/dashboard-context'
import { useWeb3React } from '@web3-react/core'
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context'
import { useContracts } from 'contexts/contract-context'
import { toast } from 'react-toastify'
import Toast from 'components/Toast'
import WarningDialogs from 'parts/WarningDialogs'

const Home = () => {
  const readMore = (
  <>
    <Typography>
     Some of your investments are compounding, but not receiving the SNOB
              rewards you&apos;re entitled to. Click below to resolve. 
    </Typography>
    <a target='_blank' rel="noreferrer" href="https://snowballs.gitbook.io/snowball-docs/products/compounding#the-benefits-of-compounding-with-snowball">
        Read More.
    </a>
  </>);
  const { account } = useWeb3React();
  const { asked, checkUserPools, pendingPools, setConfirmed } =  useDashboardContext();
  const { userPools } =  useCompoundAndEarnContract();
  const { gauges } = useContracts();
  const [modal, setModal] = useState({ open: false, title: '', text: '', textButton: '' })
  useEffect(() => {
    if(!asked && account && userPools.length > 0 && gauges.length > 0){
      checkUserPools();
    }
  },[account,asked,userPools,gauges]);

  useEffect(() => {
    if (pendingPools.length > 0) {
      toast(<Toast 
        message={'Please click here to understand why.'} 
        toastType={'warning'}
        title={'You\'re leaving potential income'}
        processing={false}/>,{onClick: () => 
          setModal({ 
            open: true, 
            title: 'We noticed that you\'re leaving potential income on the table!',
            text: readMore,
            textButton: 'Fix my pools'
          })});
    }
  },[pendingPools]);
  

  return (
    <>
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
     {modal.open && (
      <WarningDialogs
        open={modal.open}
        title={modal.title}
        text={modal.text}
        textButton={modal.textButton}
        setConfirmed={setConfirmed}
        handleClose={() => setModal({ open: false, title: '' })}
      />
    )}
    </>
  )
}

export default memo(Home)