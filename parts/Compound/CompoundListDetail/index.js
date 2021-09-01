import { memo, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, useMediaQuery } from '@material-ui/core';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import ApyCalculation from './ApyCalculation';
import SnobAbyCalculation from './SnobAbyCalculation';
import Total from './Total';
import CompoundDialogs from '../CompoundDialogs';
import getProperAction from 'utils/helpers/getProperAction';
import CompoundActionButton from '../CompoundActionButton';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import { toast } from 'react-toastify';
import Toast from 'components/Toast';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  details: {
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
  dialogTitle: {
    background: 'none',
    justifyContent: 'left',
  },
  dialogTitleText: {
    color: 'currentColor',
    textTransform: 'none',
  },
  dialogCloseIcon: {
    color: 'currentColor',
  },
}));

const CompoundListDetail = ({ item, userBoost, totalAPY }) => {
  const classes = useStyles();
  const [modal, setModal] = useState({ open: false, title: '' });
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const { withdraw, claim, isTransacting } = useCompoundAndEarnContract();

  let actionType, action;
  if(item.token0){
    [actionType, action] = getProperAction(item, setModal, item.userLPBalance);
  }

  const handleClose = () => {
    setModal({ open: false, title: '' });
  };
  let dailyAPR = item.dailyAPR > 999999?999999:item.dailyAPR;
  let yearlyAPY = item.yearlyAPY > 999999?999999:item.yearlyAPY;

  return (
    <div className={classes.root}>
      <Grid 
        className={classes.details}
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={12} lg={4}>
          <ApyCalculation
            dailyAPR={dailyAPR}
            yearlyAPY={yearlyAPY}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <SnobAbyCalculation
            snobAPR={item.gaugeInfo?.snobYearlyAPR}
            totalAPY={totalAPY}
            userBoost={userBoost}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Total item={item} />
        </Grid>
      </Grid>
      <Grid 
        className={classes.button}
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        spacing={2}
      >
        {actionType && <Grid item xs={12} lg={4}>
          <CompoundActionButton 
            type={actionType} 
            action={action} 
            endIcon={false} 
            disabled={item.deprecated}
            fullWidth={isSm ? true : false}
          />
        </Grid>}
        <Grid item xs={12} lg={4}>
          <ContainedButton
            disabled={(item.userDepositedLP == 0) || !item.userDepositedLP}
            loading={isTransacting.pageview}
            onClick={() => {
              toast(<Toast message={'Withdrawing your Tokens...'} toastType={'processing'} />)
              withdraw(item)
            }}
            fullWidth={isSm ? true : false}
          >
            Withdraw
          </ContainedButton>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ContainedButton
            disabled={(!item.SNOBHarvestable)}
            loading={isTransacting.pageview}
            onClick={() => {
              toast(<Toast message={'Claiming your Tokens...'} toastType={'processing'}/>)
              claim(item)
            }}
            fullWidth={isSm ? true : false}
          >
            Claim
          </ContainedButton>
        </Grid>
      </Grid>

      {modal.open && (
        <CompoundDialogs
          open={modal.open}
          title={modal.title}
          item={item}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default memo(CompoundListDetail);
