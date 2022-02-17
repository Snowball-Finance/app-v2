import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import SnowPairsIcon from 'components/SnowPairsIcon';
import Selects from 'components/UI/Selects';

import SnowTextField from 'components/UI/TextFields/SnowTextField';
import { BNToFloat } from 'utils/helpers/format';

const useStyles = makeStyles((theme) => ({
	container: {

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
	tokens,
	selectedToken,
	amount,
	vaultToken,
	error,
	inputHandler,
	onTokenChange

}) => {
	const classes = useStyles();
	//create options for selects component
	let options = tokens.map((el) => {
		const tokenCount = tokens.filter(o => !o.isNativeAVAX).length;
		const result = { 
			label: el.isLpToken && tokenCount > 1 ? el.name : el.symbol,
			value: el.symbol,
			iconComponent: null
		}
		result.iconComponent = el.isLpToken 
			? <SnowPairsIcon pairsIcon={[...tokens.filter(o=> (!(o.isLpToken) || !(tokenCount > 1)) && !o.isNativeAVAX).map(o=> o.address)]} size={32} />
			: <SnowPairsIcon pairsIcon={[el.address]} size={32} />
		return result
	})
	if (vaultToken) {
		options = [{
			iconComponent: <SnowPairsIcon pairsIcon={vaultToken.addresses} size={32} />,
			label: vaultToken.name.length > 20 ? vaultToken.symbol : vaultToken.name,
			value: vaultToken.symbol,
		}]
	}
	//first token is selected by default


	// set the selected token and pass it to outside world if possible
	const handleSelectChange = (e) => {
		const value = e.target.value
		const token = tokens.filter((el) => el.symbol === value)[0]
		onTokenChange && onTokenChange(token)
	}

	return (
		<Grid container className={classes.container}>
			<Grid item sm={12} md={5} className={classes.tokenSelect}>
				{options.length > 1 ? <Selects
					className={classes.select}
					value={selectedToken.symbol}
					{...{ options }}
					onChange={handleSelectChange}
				/> : <div style={{ display: 'flex', alignItems: 'center' }}>
					{options[0].iconComponent && <>
						{options[0].iconComponent}
						<div style={{ width: '4px' }} />
					</>} {options[0].label}
				</div>}
			</Grid>
			<Grid item sm={12} md={7} className={classes.inputContainer}>
				<SnowTextField
					className={classes.input}
					type='number'
					name='percent'
					value={amount > 0 ? amount : 0}
					error={error}
					onChange={inputHandler}
				/>
				{selectedToken.balance && <Available   {...{ classes }} token={vaultToken ? vaultToken : selectedToken} decimal={selectedToken.decimals} />}
			</Grid>
		</Grid>
	);
};

export default memo(Details);
