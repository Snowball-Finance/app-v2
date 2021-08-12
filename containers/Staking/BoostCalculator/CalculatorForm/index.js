
import { memo, useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'

import { useStakingContract } from 'contexts/staking-context'
import SnowSelect from 'components/UI/SnowSelect'
import SnowTextField from 'components/UI/TextFields/SnowTextField'
import ContainedButton from 'components/UI/Buttons/ContainedButton'

const CalculatorForm = ({
  setBoostFactor,
  setXSnobRequired
}) => {
  const { snowconeBalance, totalSupply, gauges } = useStakingContract();

  const [token, setToken] = useState('');
  const [balance, setBalance] = useState(0);
  const [supplyGauge, setSupplyGauge] = useState(0);
  const [userxSNOB, setUserxSNOB] = useState(0);
  const [selectedGauge, setSelectedGauge] = useState(undefined);

  useEffect(() => {
    if (token) {
      const gauge = gauges.find((item) => item.token === token);
      if (gauge) {
        setSelectedGauge(gauge);

        setBalance(gauge.staked / 1e18);
        setSupplyGauge(gauge.totalSupply / 1e18);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setUserxSNOB(snowconeBalance/1e18);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snowconeBalance]);

  const onCalculate = async () => {
    try {
      if(balance > 0 && userxSNOB > 0){
        const xSnobTotalSupply = totalSupply / 1e18;

        const DB = balance * 0.4;
        const AB = ((supplyGauge * userxSNOB) / (totalSupply / 1e18)) * 0.6;
        const boostFactor = Math.min(DB + AB, balance) / DB;

        const xSnobRequired = supplyGauge ? ((balance - DB) * xSnobTotalSupply) / (+supplyGauge * 0.6) : 0;

        setBoostFactor(boostFactor);
        setXSnobRequired(xSnobRequired);
      }else{
        setBoostFactor(1);
        setXSnobRequired(0);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SnowSelect
          name='token'
          label='Gauge'
          placeholder='Select Gauge'
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
          type='number'
          name='xSnob'
          label='xSNOB'
          placeholder='xSNOB'
          value={userxSNOB}
          onChange={(e) => setUserxSNOB(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <ContainedButton
          fullWidth
          disabled={!selectedGauge || balance <= 0 || userxSNOB <= 0}
          onClick={onCalculate}
        >
          Calculate
        </ContainedButton>
      </Grid>
    </Grid>
  )
}

export default memo(CalculatorForm)