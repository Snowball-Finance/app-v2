import { memo } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import ImageFallback from 'components/UI/ImageFallback';
import orderBasePair from 'utils/helpers/orderBasePair';

const useStyles = makeStyles(theme => ({
  secondTokenIcon: {
    marginLeft: theme.spacing(-2),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(-1),
    },
  },
  tokenImage: props => ({
    width: props.size || 50,
    height: props.size || 50,
    borderRadius: '50%',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'white',
    padding: 1,
    [theme.breakpoints.down('sm')]: {
      width: props.size || 30,
      height: props.size || 30,
    },
    '& img': {
      borderRadius: '50%',
      objectFit: 'contain',
    },
  }),
}));

const SnowPairsIcon = ({ pairsIcon, size, className }) => {
  const classes = useStyles({ size });
  pairsIcon = orderBasePair(pairsIcon);
  return (
    <Box display='flex'>
      {pairsIcon.map((pair, index) => {
        if (pair) {
          const src = `https://raw.githubusercontent.com/Snowball-Finance/bridge-tokens/main/avalanche-tokens/${pair}/logo.png`;

          return (
            <div
              key={pair}
              className={clsx(classes.tokenImage, className, {
                [classes.secondTokenIcon]: index > 0,
              })}>
              <ImageFallback alt='token' src={src} width={size || 50} height={size || 50} layout='responsive' />
            </div>
          );
        }
        return null;
      })}
    </Box>
  );
};

export default memo(SnowPairsIcon);
