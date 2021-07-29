
import { memo, useEffect, useMemo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { formatEther } from 'ethers/lib/utils'

import { useStakingContract } from 'contexts/staking-context'
import SnowSelect from 'components/UI/SnowSelect'
import SnowTextField from 'components/UI/TextFields/SnowTextField'
import ContainedButton from 'components/UI/Buttons/ContainedButton'

const CalculatorForm = ({
  setBoostFactor,
  setXSnobRequired,
  setSelectedGauge
}) => {
  const { snowconeBalance, totalSupply, gauges } = useStakingContract();

  const [token, setToken] = useState('')
  const [balance, setBalance] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)

  const xSnobValue = useMemo(() => formatEther(snowconeBalance?.toString() || '0'), [snowconeBalance]);

  useEffect(() => {
    if (token) {
      const selectedGauge = gauges.find((item) => item.token === token);
      setSelectedGauge(selectedGauge)

      const balance = +formatEther(selectedGauge.balance.add(selectedGauge.staked));
      const balanceUSD = (balance * selectedGauge.usdPerToken);
      setBalance(balanceUSD);

      const totalBalance = parseFloat(selectedGauge.totalSupply * selectedGauge.usdPerToken);
      console.log(totalBalance)
      setTotalBalance(totalBalance)
    }
  }, [token])

  const onCalculate = async () => {
    try {
      const xSnobTotalSupply = parseFloat(formatEther(totalSupply || 0));
      const xSnobRatio = xSnobTotalSupply ? +snowconeBalance / (xSnobTotalSupply || 1) : 0;

      const _derived = balance * 0.4;
      const _adjusted = +totalBalance * xSnobRatio * 0.6;
      const boostFactor = balance ? Math.min(balance, _derived + _adjusted) / (balance * 0.4) : 0;
      const xSnobRequired = totalBalance ? ((balance - _derived) * xSnobTotalSupply) / (+totalBalance * 0.6) : 0;

      setBoostFactor(boostFactor);
      setXSnobRequired(xSnobRequired);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SnowSelect
          name='token'
          label='Token'
          placeholder='Select Token'
          items={gauges}
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <SnowTextField
          type='number'
          name='balance'
          label='Balance'
          placeholder='Balance'
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <SnowTextField
          readOnly
          name='total'
          label='Total'
          placeholder='Total'
          value={totalBalance}
        />
      </Grid>
      <Grid item xs={12}>
        <SnowTextField
          type='number'
          name='xSnob'
          label='xSNOB'
          placeholder='xSNOB'
          value={xSnobValue}
        />
      </Grid>
      <Grid item xs={12}>
        <ContainedButton
          fullWidth
          onClick={onCalculate}
        >
          Calculate
        </ContainedButton>
      </Grid>
    </Grid>
  )
}

export default memo(CalculatorForm)