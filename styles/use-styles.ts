
import { makeStyles } from '@material-ui/core/styles'

const useCommonStyles = makeStyles(theme => ({
  containerWidth: {
    width: '100%',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    maxWidth: theme.custom.layout.maxDesktopWidth,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  }
}));

const useFormStyles = makeStyles((theme) => ({
  button: {
    fontSize: 24,
    textTransform: 'capitalize'
  },
  iconContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center'
  },
  icon: {
    cursor: 'pointer',
    position: 'absolute',
    bottom: -theme.spacing(4.5),
  }
}));

export {
  useCommonStyles,
  useFormStyles
};
