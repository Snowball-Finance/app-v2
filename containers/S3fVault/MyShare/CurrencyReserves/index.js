
import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import CurrencyItem from 'parts/Vault/CurrencyItem'
import TotalLockedValue from 'parts/Vault/TotalLockedValue'

const CurrencyReserves = () => {
  const { fraxToken, tusdToken, usdtToken, totalSupply } = useS3fVaultContracts()

  return (
    <CardFormWrapper title='Currency Reserves'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CurrencyItem
            token={fraxToken}
            value={fraxToken.supply}
            percent={fraxToken.percentage * 100}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyItem
            token={tusdToken}
            value={tusdToken.supply}
            percent={tusdToken.percentage * 100}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyItem
            token={usdtToken}
            value={usdtToken.supply}
            percent={usdtToken.percentage * 100}
          />
        </Grid>
        <Grid item xs={12}>
          <TotalLockedValue value={totalSupply.toLocaleString()} />
        </Grid>
      </Grid>
    </CardFormWrapper>
  )
}

export default memo(CurrencyReserves)