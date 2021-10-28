import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import SnowPairsIcon from 'components/SnowPairsIcon';
import Selects from 'components/UI/Selects';

import SnowTextField from 'components/UI/TextFields/SnowTextField';
import { BNToFloat } from 'utils/helpers/format';

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'grid',
		gridTemplateColumns: '4fr 6fr',
		alignItems: 'center',
		gap: theme.spacing(1),
		border: `1px solid ${theme.custom.palette.border}`,
		borderRadius: 7,
		padding: theme.spacing(1),
	},
	tokenSelect: {
		display: 'flex',
		alignItems: 'center',
	},
	tokenLabel: {
		marginLeft: theme.spacing(1),
	},
	inputContainer: {
	},
	input: {
		'& .MuiOutlinedInput-root': {
			border: 'none',
		},
		'& input': {
			textAlign: 'end',
			fontSize: theme.typography.h4.fontSize
		},
	},
	balanceText: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-end',
		textAlign: 'right',
		whiteSpace: 'nowrap',
	},
	pairContainer: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center',
		marginBottom: theme.spacing(1),
	},
	pairText: {
		textAlign: 'center',
	},
	select: {
		boxShadow: theme.custom.utils.boxShadow,
	},
}));

const Available = ({ token, decimal, classes }) => {
	return <Typography variant='caption' className={classes.balanceText}>
		Available: {BNToFloat(token.balance._hex, decimal)} {token.symbol}
	</Typography>
}

const Details = ({
	userData,
	tokens,
	selectedToken,
	amount,
	error,
	inputHandler,
	onTokenChange

}) => {
	const classes = useStyles();


	//create options for selects component
	const options = tokens.map((el) => {
		return {
			iconComponent: <SnowPairsIcon pairsIcon={[el.address]} size={32} />,
			label: el.name,
			value: el.symbol,
		}
	})
	//first token is selected by default


	// set the selected token and pass it to outside world if possible
	const handleSelectChange = (e) => {
		const value = e.target.value
		const token = tokens.filter((el) => el.symbol === value)[0]
		onTokenChange && onTokenChange(token)
	}

	return (
		<div className={classes.container}>
			<div className={classes.tokenSelect}>
				<Selects
					className={classes.select}
					value={selectedToken.symbol}
					{...{ options }}
					onChange={handleSelectChange}
				/>
			</div>
			<div className={classes.inputContainer}>
				<SnowTextField
					className={classes.input}
					type='number'
					name='percent'
					value={amount > 0 ? amount : 0}
					error={error}
					onChange={inputHandler}
				/>
				{selectedToken.balance && <Available   {...{ classes }} token={selectedToken} decimal={userData.lpDecimals} />}
			</div>
		</div>
	);
};

export default memo(Details);
