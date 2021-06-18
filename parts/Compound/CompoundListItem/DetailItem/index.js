import { memo } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SnowTokenIcon from 'components/SnowTokenIcon';
import CustomPopover from 'components/CustomPopover';
import Tags from 'components/Tags';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
  },
  secondTokenIcon: {
    marginLeft: theme.spacing(-2),
  },
}));

const DetailItem = () => {
  const classes = useStyles();

  return (
    <div className={classes.card}>
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
    </div>
  );
};

export default memo(DetailItem);
