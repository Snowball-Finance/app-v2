
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

export {
  useCommonStyles
};
