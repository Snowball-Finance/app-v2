
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import LoadingSpinner from './LoadingSpinner'

type StyleProps = {
  height: string | number | undefined,
};

const useStyles = makeStyles((theme) => ({
  root: (props: StyleProps) => ({
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: props.height ? props.height : '100%'
  })
}));

type SnowLoadingProps = {
  loading: boolean,
  height?: number,
  size?: number,
}

const SnowLoading = ({
  loading,
  height,
  size = 100
}: SnowLoadingProps): JSX.Element => {
  const classes = useStyles({ height });

  return (
    <div className={classes.root}>
      <LoadingSpinner
        loading={loading}
        size={size} />
    </div>
  );
};

export default memo(SnowLoading);