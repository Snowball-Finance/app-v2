import { memo } from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 0,
    width: '100%'
  },
  leftCard: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  rightCard: {
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  }
}));

const LiquidityForm = ({vault}) => {
	const classes = useStyles();

	return (
		<Grid container spacing={6} className={classes.container}>
			<Grid item sm={12} md={6} className={classes.leftCard}>
				<AddLiquidity vault={vault}/>
			</Grid>
			<Grid item sm={12} md={6} className={classes.rightCard}>
				<RemoveLiquidity vault={vault}/>
			</Grid>
		</Grid>
	)
}

export default memo(LiquidityForm)
