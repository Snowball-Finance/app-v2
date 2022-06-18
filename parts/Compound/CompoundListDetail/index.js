import { memo, useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Typography, useMediaQuery } from '@material-ui/core';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import ApyCalculation from './ApyCalculation';
import SnobApyCalculation from './SnobApyCalculation';
import Total from './Total';
import ManualHarvest from 'components/ManualHarvest';
import CompoundWithdrawDialogs from '../CompoundWithdrawDialogs';
import getProperAction from 'utils/helpers/getProperAction';
import CompoundActionButton from '../CompoundActionButton';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import { toast } from 'react-toastify';
import Toast from 'components/Toast';
import { useContracts } from 'contexts/contract-context';
import SwapAPRInfo from './SwapAPRInfo';
import { useWeb3React } from '@web3-react/core';
import HARVESTER_ABI from 'libs/abis/harvester.json';
import { CONTRACTS } from 'config';
import { ethers } from 'ethers';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	details: {
		borderTop: '1px solid rgba(110, 107, 123, 0.24)',
		paddingTop: theme.spacing(2),
	},
	button: {
		marginTop: theme.spacing(2),
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: theme.spacing(2),
	},
	dialogTitle: {
		background: 'none',
		justifyContent: 'left',
	},
	dialogTitleText: {
		color: 'currentColor',
		textTransform: 'none',
	},
	dialogCloseIcon: {
		color: 'currentColor',
	},
}));

const CompoundListDetail = ({ item, userBoost, totalAPY, setModal,
	userData, setUserData, boost, userLastDeposit, renderCaution }) => {
	const { library, account } = useWeb3React();
	const classes = useStyles();
	const theme = useTheme();
	const isSm = useMediaQuery(theme.breakpoints.down('sm'), {
		defaultMatches: true,
	});
	const [availableHarvest, setAvailableHarvest] = useState(false);
	const [nextHarvest, setNextHarvest] = useState(0);
	const [action, setAction] = useState({ actionType: 'Get_Token' });

	const { withdraw, claim, isTransacting, getBalanceInfoSinglePool,
		setTransactionStatus, handleHarvest } = useCompoundAndEarnContract();
	const { AVAXBalance } = useContracts();

	useEffect(() => {
		async function fetchData(){
			const now = new Date();
			if(account){
				const harvesterContract = 
					new ethers.Contract(CONTRACTS.HARVESTER_CONTRACT, HARVESTER_ABI, library.getSigner());
				const lastHarvested = await harvesterContract.lastHarvested(item.strategyAddress);
				const harvestWindow = await harvesterContract.harvestWindow(item.strategyAddress);
				const nextManualHarvest =
					(lastHarvested * 1) + (harvestWindow * 1);
				const nextDateHarvest = new Date(nextManualHarvest * 1000);
				setNextHarvest(nextDateHarvest);
				setAvailableHarvest(now > nextDateHarvest);
			}
		}
		fetchData()
		const evalPool = userData ? userData : item;
		if (item.token0 && AVAXBalance !== 0) {
			let actionType, func;
			[actionType, func] = getProperAction(evalPool, setModal, evalPool.userLPBalance, AVAXBalance, 0, true);
			setAction({ actionType, func });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData, item, AVAXBalance]);

	let dailyAPR = item.dailyAPR > 999999 ? 999999 : item.dailyAPR;
	let weeklyAPY = item.weeklyAPY > 999999 ? 999999 : item.weeklyAPY;
	let yearlyAPY = item.yearlyAPY > 999999 ? 999999 : item.yearlyAPY;

	const [withdraw_modal, setWithdraw] = useState(false);
	const handleCloseWithdraw = () => {
		setWithdraw(false);
	};

	// const { setTransactionStatus } = useCompoundAndEarnContract();

	const handleClaim = async () => {
		toast(<Toast message={'Claiming your Tokens...'} toastType={'processing'} />)
		try {
			await claim(item);
			const userData = await getBalanceInfoSinglePool(item.address);
			setUserData(userData);
		} catch (error) {
			console.log(error)
		}
	};

	const handleWithdraw = () => {
		setTransactionStatus({ withdrawStep: 0 });
		setWithdraw(true)
	}

	const renderDate = () => {
		if(nextHarvest > 0){
			return <><br /> You need to wait until {nextHarvest.toLocaleString()} to be able to harvest.</>
		}else{
			return ''
		}
	}

	const harvest = () => {
		handleHarvest(item);
	}

	return (
		<div className={classes.root}>
			<Grid
				className={classes.details}
				container
				direction="row"
				justify="space-between"
				alignItems="flex-start"
				spacing={2}
			>
				{renderCaution(item)}

				<Grid item xs={12} lg={4}>
					<Grid container spacing={2}>
						{!item.deprecatedPool && (
							<Grid item xs={12}>
								<ApyCalculation
									kind={item.kind}
									dailyAPR={dailyAPR}
									weeklyAPY={weeklyAPY}
									yearlyAPY={yearlyAPY}
								/>
							</Grid>
						)}
						<Grid item xs={12}>
							{!item.deprecatedPool &&
								<SwapAPRInfo yearlySwapFees={item.yearlySwapFees} />}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} lg={4}>
					<SnobApyCalculation
						kind={item.kind}
						isDeprecated={item.deprecatedPool}
						boostedSnobAPR={boost * item.gaugeInfo?.snobYearlyAPR}
						unboostedSnobAPR={item.gaugeInfo?.snobYearlyAPR}
						totalAPY={totalAPY}
						userBoost={userBoost}
						userData={userData}
					/>
				</Grid>
				<Grid item xs={12} lg={4}>
					<Total item={item} userData={userData} userLastDeposit={userLastDeposit} />
				</Grid>
			</Grid>
			{!item.deprecatedPool && !item.deprecated && !item.harvestInfo?.errored &&
				<Grid item xs={12}>
					<ManualHarvest>
						<Grid
							display='flex'
							flexDirection='column'
							alignItems='flex-start'
						>
							<div className={classes.container}>
								<Typography variant="caption">
									Anyone can perform a manual harvest on our pools. Keep in mind this process will consume some gas!
									Thank you for your service!
									{!availableHarvest && renderDate()}
								</Typography>
							</div>
							<div className={classes.container}>
								<ContainedButton
									disabled={!availableHarvest || !library}
									loading={isTransacting.pageview}
									onClick={harvest}
									fullWidth={isSm ? true : false}
								>
									Harvest
								</ContainedButton>
							</div>
						</Grid>
					</ManualHarvest>
				</Grid>}
			<div
				className={classes.button}
			>
				{(!item.deprecatedPool && action?.actionType && AVAXBalance) ?
					<CompoundActionButton
						type={action.actionType}
						action={action.func}
						endIcon={false}
						disabled={item.deprecated}
						fullWidth={isSm ? true : false}
					/> : <></>
				}
				{/* {!item.deprecatedPool ? */}
				<ContainedButton
					disabled={userData?.SNOBHarvestable === 0 || userData?.claimed || !userData}
					loading={isTransacting.pageview}
					onClick={handleClaim}
					fullWidth={isSm ? true : false}
				>
					Claim
				</ContainedButton>
				{/* :
					<div />
				} */}
				<ContainedButton
					disabled={userData?.userDepositedLP === 0 || userData?.withdrew || !userData}
					loading={isTransacting.pageview}
					onClick={handleWithdraw}
					fullWidth={isSm ? true : false}
				>
					Withdraw
				</ContainedButton>
			</div>
			{(withdraw && userData && withdraw_modal) && (
				<CompoundWithdrawDialogs
					open={withdraw_modal}
					title="Withdraw"
					handleClose={handleCloseWithdraw}
					item={userData}
				/>
			)}
		</div>
	);
};

export default memo(CompoundListDetail);
