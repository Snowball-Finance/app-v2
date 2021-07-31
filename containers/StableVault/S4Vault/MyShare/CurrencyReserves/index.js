import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS4dVaultContracts } from 'contexts/s4d-vault-context'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import CurrencyItem from 'parts/Vault/CurrencyItem'
import TotalLockedValue from 'parts/Vault/TotalLockedValue'

const CurrencyReserves = () => {
  const { tokenArray, tokenValues, totalSupply } = useS4dVaultContracts();

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
