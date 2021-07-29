import { memo, useEffect, useState, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import { useStakingContract } from 'contexts/staking-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import CardWrapper from '../CardWrapper'
import FarmItem from './FarmItem'
import FarmsSelect from './FarmsSelect'
import { isEmpty } from 'utils/helpers/utility'

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  coin: {
    margin: theme.spacing(0, 1)
  }
}));

const SnowVote = () => {
  const classes = useStyles();
  const {
    snowconeBalance,
    gauges,
    voteFarms
  } = useStakingContract();

  const [selectedFarms, setSelectedFarms] = useState([]);
  const [newWeights, setNewWeights] = useState([]);
  const [voteWeights, setVoteWeights] = useState({});

  const totalGaugeWeight = useMemo(() => {
    let totalValue = 0
    for (let i = 0; i < gauges?.length; i++) {
      totalValue += voteWeights[gauges[i].address] || 0;
    }
    return totalValue;
  }, [voteWeights, gauges])
  const weightsValid = useMemo(() => totalGaugeWeight === 100, [totalGaugeWeight])

  useEffect(() => {
    const initialize = async () => {
      const updatedFarms = selectedFarms.map((farm) => gauges.find((gauge) => gauge.address === farm.address))
      setSelectedFarms(updatedFarms);
    };

    if (!isEmpty(selectedFarms)) {
      initialize();
    }
  }, [gauges]);

  useEffect(() => {
    let newVoteWeights = {};

    for (const farm of selectedFarms) {
      newVoteWeights = {
        ...newVoteWeights,
        [farm.address]: voteWeights[farm.address] || 0
      }
    }
    setNewWeights([]);
    setVoteWeights(newVoteWeights);
  }, [selectedFarms]);

  const calculateNewWeights = () => {
    if (weightsValid) {
      const voteArray = Object.entries(voteWeights).map((e) => ({
        [e[0]]: e[1],
      }));

      const newWeights = voteArray.map((x) => {
        const gaugeAddress = Object.keys(x)[0];
        const gauge = gauges.find((gauge) => gauge.address === gaugeAddress);
        if (!isEmpty(gauge) && snowconeBalance) {
          const xSnobBalance = +snowconeBalance.toString();
          const estimatedWeight =
            (gauge.gaugeWeight - gauge.userWeight + (xSnobBalance * Object.values(x)[0]) / 100)
            / (gauge.totalWeight - gauge.userCurrentWeights + xSnobBalance);
          return { [gauge.address]: estimatedWeight };
        } else {
          return null;
        }
      });
      setNewWeights(newWeights);
    } else {
      setNewWeights([]);
    }
  };

  useEffect(() => {
    calculateNewWeights();
  }, [weightsValid]);

  const onVoteWeightChange = (address) => (value) => {
    setVoteWeights((prev) => ({
      ...prev,
      [address]: parseFloat(value),
    }))
  }

  const voteHandler = async () => {
    if (isEmpty(gauges) || !weightsValid) return;
    try {
      let tokens = [];
      let weights = [];

      for (const gauge of gauges) {
        tokens = [...tokens, gauge.token]
        weights = [...weights, voteWeights[gauge.address] || 0]
      }

      await voteFarms(tokens, weights);
      setVoteWeights({})
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <CardWrapper title='Select which farms to allocate SNOB rewards to using your xSNOB balance'>
      <Typography
        variant='h1'
        className={classes.title}
      >
        Vote
      </Typography>
      <Typography
        gutterBottom
        color='textPrimary'
      >
        Once you&apos;ve voted your votes will continue to rollover each week,
        there&apos;s no need to revote unless you want to change the distribution
        you&apos;ve voted for.
      </Typography>

      {isEmpty(gauges)
        ? (
          <Typography variant='body1' color='textPrimary'>
            Loading Farms
          </Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FarmsSelect
                selectedFarms={selectedFarms}
                setSelectedFarms={setSelectedFarms}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>
                Selected Farms
              </Typography>
            </Grid>
            {isEmpty(selectedFarms)
              ? (
                <Grid item xs={12}>
                  <Typography variant='body1' color='textPrimary'>
                    Please select farms from dropdown
                  </Typography>
                </Grid>
              )
              : selectedFarms.map((farmItem, index) => (
                <Grid item xs={12} key={index}>
                  <FarmItem
                    item={farmItem}
                    newWeights={newWeights}
                    value={voteWeights[farmItem.address]}
                    onChange={onVoteWeightChange(farmItem.address)}
                  />
                </Grid>
              ))
            }
            <Grid item xs={12}>
              <Typography align='right' variant='body1' color='textPrimary'>
                {`Current allocation: ${totalGaugeWeight}%`}
              </Typography>
              <ContainedButton
                fullWidth
                disabled={!+snowconeBalance?.toString() || !weightsValid}
                onClick={voteHandler}
              >
                {+snowconeBalance?.toString()
                  ? weightsValid
                    ? 'Submit Vote'
                    : 'Submit Vote (weights must total 100%)'
                  : 'xSnob balance needed to vote'
                }
              </ContainedButton>
            </Grid>
          </Grid>
        )
      }
    </CardWrapper>
  )
}

export default memo(SnowVote)
