import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import CurrencyItem from 'parts/Vault/CurrencyItem'
import TotalLockedValue from 'parts/Vault/TotalLockedValue'

const CurrencyReserves = ({ vault }) => {
  const { tokenArray, tokenValues, totalSupply } = (vault == 's3D') ? useS3dVaultContracts() : useS3fVaultContracts();

  return (
    <CardFormWrapper title='Currency Reserves'>
      <Grid container spacing={2}>
        {tokenArray.map((token) => {
          const tokenValue = tokenValues[token.name]
          return (
            <>
              <Grid item xs={12}>
                <CurrencyItem
                  token={token}
                  value={tokenValue.supply}
                  percent={tokenValue.percentage * 100}
                />
              </Grid>
            </>
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
