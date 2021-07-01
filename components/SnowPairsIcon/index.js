import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import SnowTokenIcon from 'components/SnowTokenIcon';

const useStyles = makeStyles((theme) => ({
  secondTokenIcon: {
    marginLeft: theme.spacing(-2),
  },
}));

const SnowPairsIcon = ({ pairsIcon }) => {
  const classes = useStyles();

  return pairsIcon.map((pair, index) => (
    <SnowTokenIcon
      key={pair}
      size={50}
      token={pair.toLowerCase()}
      className={index > 0 ? classes.secondTokenIcon : null}
    />
  ));
};

export default memo(SnowPairsIcon);
