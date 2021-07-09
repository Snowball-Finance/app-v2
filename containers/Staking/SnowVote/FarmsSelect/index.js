import { memo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { useStakingContract } from 'contexts/staking-context'
import SnowMultiSelect from 'components/UI/SnowMultiSelect'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import { isEmpty } from 'utils/helpers/utility'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  selectContainer: {
    width: 'calc(100% - 128px)'
  },
  buttonContainer: {
    width: 128,
    marginLeft: theme.spacing(1)
  },
  selectAll: {
    width: 120
  },
}));

const FarmsSelect = ({
  selectedFarms,
  setSelectedFarms
}) => {
  const classes = useStyles();
  const { gauges } = useStakingContract();

  const selectAllHandler = useCallback(() => {
    if (!isEmpty(gauges)) {
      setSelectedFarms(gauges)
    }
  }, [gauges, setSelectedFarms])

  return (
    <div className={classes.root}>
      <div className={classes.selectContainer}>
        <SnowMultiSelect
          name='farms'
          placeholder='Select farms to boost'
          items={gauges}
          value={selectedFarms}
          onChange={e => setSelectedFarms(e.target.value)}
        />
      </div>
      <div className={classes.buttonContainer}>
        <ContainedButton
          className={classes.selectAll}
          onClick={selectAllHandler}
        >
          Select All
        </ContainedButton>
      </div>
    </div>
  )
}

export default memo(FarmsSelect)
