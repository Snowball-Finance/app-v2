import {memo,useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';

import SnowPairsIcon from 'components/SnowPairsIcon';
import Selects from 'components/UI/Selects';

import SnowTextField from 'components/UI/TextFields/SnowTextField';

const useStyles=makeStyles((theme) => ({
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

const Available=({isDeposit,item,classes}) => {
	return <Typography variant='caption' className={classes.balanceText}>
		Available: {(item[isDeposit? 'userLPBalance':'userBalanceGauge']/10**item.lpDecimals).toLocaleString(
			undefined,{maximumSignificantDigits: 18})} {item.symbol}
	</Typography>
}

const Details=({
	item,
	poolList,
	title,
	amount,
	error,
	inputHandler,
	onTokenChange

}) => {
	const classes=useStyles();

	// all the tokens, may need some modification if there are more token than 4
	const rawTokens=[item.token0,item.token1,item.token2,item.token3]

	// extract valid tokens
	const tokens=rawTokens.filter((item) => item.address)

	//create options for selects component
	const options=tokens.map((item) => {
		return {
			iconComponent: <SnowPairsIcon pairsIcon={[item.address]} size={32} />,
			label: item.name,
			value: item.symbol,
		}
	})
	//first token is selected by default
	const [selectedToken,setSelectedToken]=useState(tokens[0])

	// set the selected token and pass it to outside world if possible
	const handleSelectChange=(e) => {
		const value=e.target.value
		const token=tokens.filter((item) => item.symbol===value)[0]
		setSelectedToken(token)
		onTokenChange&&onTokenChange(token)
	}

	return (
		<div className={classes.container}>
			<div className={classes.tokenSelect}>
				<Selects
					className={classes.select}
					value={selectedToken.symbol}
					{...{options}}
					onChange={handleSelectChange}
				/>
			</div>
			<div className={classes.inputContainer}>
				<SnowTextField
					className={classes.input}
					type='number'
					name='percent'
					value={amount>0? amount:0}
					error={error}
					onChange={inputHandler}
				/>
				<Available isDeposit={title!=="Withdraw"} {...{item,classes}} />
			</div>
		</div>
	);
};

export default memo(Details);
