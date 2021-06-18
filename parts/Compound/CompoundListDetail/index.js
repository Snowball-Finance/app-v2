import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import ApyCalculation from './ApyCalculation';
import SnobAbyCalculation from './SnobAbyCalculation';
import Total from './Total';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTop: '1px solid rgba(110, 107, 123, 0.24)',
    paddingTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
}));

const CompoundListDetail = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.details}>
        <ApyCalculation />
        <SnobAbyCalculation />
        <Total />
      </div>
      <div className={classes.button}>
        <ContainedButton>Deposit</ContainedButton>
        <ContainedButton>Withdraw</ContainedButton>
        <ContainedButton>Claim</ContainedButton>
      </div>
    </div>
  );
};

export default memo(CompoundListDetail);
