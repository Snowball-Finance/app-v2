
import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import CurrencyItem from 'parts/Vault/CurrencyItem'
import TotalLockedValue from 'parts/Vault/TotalLockedValue'

const CurrencyReserves = () => {
  const { usdtToken, busdToken, daiToken, totalSupply } = useS3dVaultContracts()

  return (
    <CardFormWrapper title='Currency Reserves'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CurrencyItem
            token={usdtToken}
            value={usdtToken.supply.toLocaleString()}
            percent={(usdtToken.percentage * 100).toLocaleString()}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyItem
            token={busdToken}
            value={busdToken.supply.toLocaleString()}
            percent={(busdToken.percentage * 100).toLocaleString()}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyItem
            token={daiToken}
            value={daiToken.supply.toLocaleString()}
            percent={(daiToken.percentage * 100).toLocaleString()}
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