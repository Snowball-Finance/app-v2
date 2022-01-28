import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';

import CustomPopover from 'components/CustomPopover';
import SwapAPRTooltip from './SwapAPRTooltip';

const useStyles = makeStyles(() => ({
  boldSubtitle: {
    fontWeight: 600,
  },
  percentValue: {
    marginLeft: 'auto',
  },
}));

const SwapAPRInfo = ({}) => {
  const classes = useStyles();

  return (
    <Box mb={3}>
      <Typography variant="subtitle1" className={classes.boldSubtitle}>
        Swap APR Information
      </Typography>

      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Typography variant="body2">SWAP APR</Typography>
            </Grid>
            <Grid item>
              <CustomPopover contentClassName={classes.popover}>
                  <SwapAPRTooltip />
              </CustomPopover>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Typography variant="subtitle2" className={classes.percentValue}>
            0.05%
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(SwapAPRInfo);
