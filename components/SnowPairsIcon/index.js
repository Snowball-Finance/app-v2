import { memo } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import ImageFallback from 'components/UI/ImageFallback';
import orderBasePair from 'utils/helpers/orderBasePair';
import { iconSrcWithAddress } from 'utils/helpers/iconSrcWithAddress';

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
    ...(!props?.flat && { boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' })
    ,
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

const SnowPairsIcon = ({ pairsIcon, size, className, flat }) => {
  const classes = useStyles({ size, flat });
  pairsIcon = orderBasePair(pairsIcon)
  return <Box display='flex'>{pairsIcon.map((pair, index) => {
    if (pair) {
      const src = iconSrcWithAddress(pair);
      return (
        <div key={pair} className={clsx(classes.tokenImage, className, {
          [classes.secondTokenIcon]: index > 0,
        })}>
          <Image
            alt="token"
            src={src}
            width={size || 50}
            height={size || 50}
            layout='responsive'
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = NO_IMAGE_PATH;
            }}
          />
        </div>
      );
    }
    return null;
  })}</Box>;
};

export default memo(SnowPairsIcon);
