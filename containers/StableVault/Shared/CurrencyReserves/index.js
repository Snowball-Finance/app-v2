import { memo } from 'react'
import { Grid } from '@material-ui/core'

import CardFormWrapper from 'parts/Card/CardFormWrapper'
import CurrencyItem from 'containers/StableVault/Shared/CurrencyItem'
import TotalLockedValue from './TotalLockedValue'

const CurrencyReserves = ({ 
  tokenArray, 
  tokenValues, 
  totalSupply
 }) => {
  return (
    <CardFormWrapper title='Currency Reserves'>
      <Grid container spacing={2}>
        {tokenArray.map((token) => {
          const tokenValue = tokenValues[token.name]
          return (
            <Grid key={token.name} item xs={12}>
              <CurrencyItem
                token={token}
                value={tokenValue.supply}
                percent={tokenValue.percentage * 100}
              />
            </Grid>
          );
        })}

        <Grid item xs={12}>
          <TotalLockedValue value={totalSupply.toLocaleString()} />
        </Grid>
      </Grid>
    </CardFormWrapper>
  )
}

export default memo(CurrencyReserves)
