import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { NO_IMAGE_PATH } from 'utils/constants/image-paths';
import orderBasePair from 'utils/helpers/orderBasePair';

const useStyles = makeStyles((theme) => ({
  secondTokenIcon: {
    marginLeft: theme.spacing(-2),
  },
  tokenImage: (props) => ({
    width: props.size,
    height: props.size,
    borderRadius: '50%',
    objectFit: 'container',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  }),
}));

const SnowPairsIcon = ({ pairsIcon, size, className }) => {
  const classes = useStyles({ size });
  pairsIcon = orderBasePair(pairsIcon)
  return pairsIcon.map((pair, index) => {
    if (pair) {
      const src = `https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/${pair}/logo.png`;
      return (
        <img
          key={pair}
          alt="token"
          src={src}
          className={clsx(classes.tokenImage, className, {
            [classes.secondTokenIcon]: index > 0,
          })}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = NO_IMAGE_PATH;
          }}
        />
      );
    }
    return null;
  });
};

export default memo(SnowPairsIcon);
