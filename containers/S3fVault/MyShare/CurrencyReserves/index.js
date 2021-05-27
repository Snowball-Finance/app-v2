
import { memo } from 'react'
import { Grid } from '@material-ui/core'

import CardFormWrapper from 'parts/Card/CardFormWrapper'
import CurrencyItem from 'parts/Vault/CurrencyItem'
import TotalLockedValue from 'parts/Vault/TotalLockedValue'
import TOKENS from 'utils/temp/tokens'

const CurrencyReserves = () => {
  return (
    <CardFormWrapper title='Currency Reserves'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CurrencyItem
            token={TOKENS[3]}
            value='407,740.8'
            percent='43.025'
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyItem
            token={TOKENS[1]}
            value='328,786.19'
            percent='34.694'
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyItem
            token={TOKENS[0]}
            value='211,147.6'
            percent='22.281'
          />
        </Grid>
        <Grid item xs={12}>
          <TotalLockedValue
            value='862,268.51'
          />
        </Grid>
      </Grid>
    </CardFormWrapper>
  )
}

export default memo(CurrencyReserves)