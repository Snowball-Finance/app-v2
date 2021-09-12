import { memo } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2.5, 1.5),
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
  }, 
  head: {
    textAlign: 'right',
    fontSize : 24,
  },
  body: {
    textAlign: 'right',
    fontSize: 12,
  }
}));

const DisplayToken = ({

}) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.head}>
        154001
      </div>
      <div className={classes.body}>
        Available: 154001
      </div>
    </div>
  );
}

export default memo(DisplayToken)