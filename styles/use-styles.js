
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
  },
  segmentWidth: {
    width: '100%',
    maxWidth: theme.custom.layout.maxDesktopWidth,
    padding: theme.spacing(10, 4),
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      padding: theme.spacing(5, 2),
    }
  },
}));

export {
  useCommonStyles
};
