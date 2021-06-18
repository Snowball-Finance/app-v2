import { memo } from 'react';
import { Card, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import SnowTokenIcon from 'components/SnowTokenIcon';
import CustomPopover from 'components/CustomPopover';
import Tags from 'components/Tags';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    boxShadow: 'none'
  },
  depositButton: {
    color: '#28C76F',
    backgroundColor: 'rgba(40, 199, 111, 0.12)',
    textTransform: 'none',
  },
  secondTokenIcon: {
    marginLeft: theme.spacing(-2),
  },
}));

const DepositItem = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <div>
        <SnowTokenIcon size={50} token="png" />
        <SnowTokenIcon
          size={50}
          token="wavax"
          className={classes.secondTokenIcon}
        />
      </div>

      <div>
        <Typography variant="subtitle2">PNG-AVAX</Typography>
        <Tags type="secondary">
          <SnowTokenIcon size={12} token="png" />
          Pangolin LP
        </Tags>
      </div>

      <div>
        <Typography variant="body2">
          APY <CustomPopover />
        </Typography>
        <Typography variant="subtitle1">118.47%</Typography>
      </div>

      <div>
        <Typography variant="body2">
          TVL <CustomPopover />
        </Typography>
        <Typography variant="subtitle1">$37,542,257.99</Typography>
      </div>

      <div>
        <Typography variant="body2">
          Boost <CustomPopover />
        </Typography>
        <Tags type="primary">2.5x</Tags>
      </div>

      <div>
        <ContainedButton
          className={classes.depositButton}
          size="small"
          disableElevation
          endIcon={<GetAppIcon className={classes.rightIcon} />}
        >
          Deposit
        </ContainedButton>
      </div>
    </Card>
  );
};

export default memo(DepositItem);
