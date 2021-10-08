import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import SnowPairsIcon from 'components/SnowPairsIcon';
import Selects from 'components/UI/Selects';

import SnowTextField from 'components/UI/TextFields/SnowTextField';
import { extractValidTokens, hexToFloat } from '../utils';

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    border: '1px solid #6C757D',
    borderRadius: 7,
    padding: theme.spacing(1, 0),
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
    paddingRight: 20
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
}));

const Available = ({ isDeposit, userData, classes }) => {
	return <Typography variant='caption' className={classes.balanceText}>
		Available: {hexToFloat({ hex: userData[isDeposit ? 'userLPBalance' : 'userBalanceGauge'], decimal: userData.lpDecimals })} {userData.symbol}
	</Typography>
}

const Details = ({
	userData,
	poolList,
	pool,
	title,
	amount,
	error,
	inputHandler,
	onTokenChange

}) => {
  const classes = useStyles();
  const token0 = item.token0.address;
  const token1 = item.token1.address;
  const token2 = item.token2.address;
  const token3 = item.token3.address;
  console.log(item)
  return (
    <>
      {/* <div className={classes.pairContainer}>
        <div>
          <SnowPairsIcon pairsIcon={[token0, token1, token2, token3]} size={50} />
        </div>
        <div className={classes.pairText}>
          <Typography variant='caption'>{title}</Typography>
          <Typography variant='h6'>{item.name}</Typography>
        </div>
      </div> */}

	const tokens = extractValidTokens({ obj: userData })

	//create options for selects component
	const options = tokens.map((el) => {
		return {
			iconComponent: <SnowPairsIcon pairsIcon={[el.address]} size={32} />,
			label: el.name,
			value: el.symbol,
		}
	})
	//first token is selected by default
	const [selectedToken, setSelectedToken] = useState(tokens[0])

	// set the selected token and pass it to outside world if possible
	const handleSelectChange = (e) => {
		const value = e.target.value
		const token = tokens.filter((el) => el.symbol === value)[0]
		setSelectedToken(token)
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
				<Available isDeposit={title !== "Withdraw"} {...{ userData, classes }} />
			</div>
		</div>
	);
};

export default memo(Details);
