import {memo,useEffect,useReducer} from 'react';
import {toast} from 'react-toastify';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Grid} from '@material-ui/core';
import clsx from 'clsx'

import {useCompoundAndEarnContract} from 'contexts/compound-and-earn-context';
import Toast from 'components/Toast';
import SnowStepBox from 'components/SnowStepBox';
import SnowDialog from 'components/SnowDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import CompoundSlider from './CompoundSlider';
import CompoundInfo from './CompoundInfo';
import Details from './Details';
import {compoundDialogReducer,compoundDialogActionTypes} from './reducer'
import {SnowCheckbox} from 'components/UI/Checkbox';

const useStyles=makeStyles((theme) => ({
	dialog: {
		minWidth: 200,
		width: 510,
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
	},
	dialogTitle: {
		background: 'none',
		justifyContent: 'left',
		height: 48,
		paddingBottom: 0,
	},
	dialogTitleText: {
		color: 'currentColor',
		textTransform: 'none',
	},
	dialogCloseIcon: {
		color: 'currentColor',
		top: theme.spacing(0.5),
		right: theme.spacing(1.5),
	},
	container: {
		padding: theme.spacing(1),
	},
	buttonContainer: {
		margin: theme.spacing(1,0,0,0),
	},
	modalButton: {
		padding: theme.spacing(2,0),
		textTransform: 'none',
		'&:disabled': {
			backgroundColor: `${theme.custom.palette.blueButton} !important`,
		}
	},
	mt1: {
		marginTop: theme.spacing(1)
	},
	button: {
		textTransform: 'none',
		width: '100%',
		padding: theme.spacing(2,0),
	},
	greyButton: {
		background: '#BDBDBD',
	}
}));

const CompoundDialogs=({
	open,
	title,
	pool,
	poolList,
	userData,
	handleClose,
}) => {
	const classes=useStyles();
	// i will need the pool to extract the token infos
	const [state,dispatch]=useReducer(compoundDialogReducer,{
		title,
		userData,
		sliderValue: 0,
		amount: 0,

		inputAmount: 0,
		selectedToken: pool.token0,
		approved: false,
		isInfiniteApprovalChecked: false,
		error: null
	})
	console.log(userData)
	const {approve,deposit,isTransacting,transactionStatus,withdraw}=useCompoundAndEarnContract();

	useEffect(() => {
		if(!isTransacting.deposit&&!isTransacting.approve&&!isTransacting.withdraw) {
			toast.dismiss();
		}
	}),[isTransacting];

	useEffect(() => {
		if(transactionStatus.depositStep===2) {
			handleClose();
		}
		if(transactionStatus.withdrawStep===3) {
			handleClose();
		}
	}),[transactionStatus];


	const enabledHandler=(isApproved=false) => {
		return (isApproved? state.approved:!state.approved)||(state.amount==0)||
			isTransacting.approve||isTransacting.deposit;
	}

	const handleInputChange=(event) => {
		const value=event.target.value
		dispatch({
			type: compoundDialogActionTypes.setInputValue,
			payload: value
		})
	};

	const handleSliderChange=(value) => {
		dispatch({
			type: compoundDialogActionTypes.setSliderValue,
			payload: value
		})
	};

	const handleApproveClick=async () => {

		try {
			toast(<Toast message={'Checking for approval...'} toastType={'processing'} />)
			const result=await approve(item,amount)
			if(result) {
				dispatch({type: compoundDialogActionTypes.setApproved,payload: true})
			}
		} catch(error) {
			console.log(error);
		}



	}

	const handleInfiniteApprovalCheckboxChange=(v) => {
		dispatch({type: compoundDialogActionTypes.setInfiniteApprovalCheckboxValue,payload: v})
	}


	const handleTokenChange=(token) => {
		dispatch({
			type: compoundDialogActionTypes.reset,payload: {
				title,
				userData,
				sliderValue: 0,
				amount: 0,
				inputAmount: 0,
				selectedToken: token,
				approved: false,
				isInfiniteApprovalChecked: false,
				error: null
			}
		})
	}

	useEffect(() => {
		dispatch({type: compoundDialogActionTypes.setUserData,payload: userData})
		return () => {

		}
	},[userData])

	// useEffect(() => {
	//   return () => {

	//   }
	// }, [pool])

	const renderButton=() => {
		switch(title) {
			case 'Deposit': {
				return (
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<ContainedButton
								className={classes.modalButton}
								disableElevation
								fullWidth
								disabled={enabledHandler(true)}
								loading={isTransacting.approve}
								onClick={() => {
									toast(<Toast message={'Checking for approval...'} toastType={'processing'} />)
									handleApproveClick()
								}}
							>
								Approve
							</ContainedButton>
						</Grid>
						<Grid item xs={6}>
							<ContainedButton
								className={classes.modalButton}
								disableElevation
								fullWidth
								disabled={enabledHandler(false)}
								loading={isTransacting.deposit}
								onClick={() => {
									toast(<Toast message={'Depositing your Tokens...'} toastType={'processing'} />)
									deposit(userData,state.amount)
								}
								}
							>
								Deposit
							</ContainedButton>
						</Grid>
					</Grid>
				);
			}
			case 'Withdraw': {
				return (
					<Grid item xs={12}>
						<ContainedButton
							className={clsx(classes.button)}
							disableElevation
							disabled={state.amount==0}
							loading={isTransacting.withdraw}
							onClick={() => {
								toast(<Toast message={'Withdrawing your Tokens...'} toastType={'processing'} />)
								withdraw(userData,state.amount)
							}}
						>
							Withdraw
						</ContainedButton>
					</Grid>
				)
			}
			default:
				return null;
		}
	};

	return (
		<SnowDialog
			open={open}
			title={title}
			onClose={() => handleClose()}

			dialogClass={classes.dialog}
			dialogTitleClass={classes.dialogTitle}
			titleTextClass={classes.dialogTitleText}
			closeIconClass={classes.dialogCloseIcon}
		>
			<Typography variant='subtitle2'>Select token to convert</Typography>
			<div className={classes.container} >
				<Details
					{...{
						userData,
						poolList,
						title,
						pool
					}}
					amount={state.inputAmount}
					onTokenChange={handleTokenChange}
					inputHandler={handleInputChange}
					error={state.error}
				/>

				<CompoundSlider value={state.sliderValue} onChange={handleSliderChange} />
				<CompoundInfo pool={pool} amount={state.inputAmount} activeToken={state.selectedToken} />
				<SnowCheckbox
					className={classes.mt1}
					label="Infinite Approval"
					isChecked={state.isInfiniteApprovalChecked}
					onChange={handleInfiniteApprovalCheckboxChange}
				/>
				<div className={classes.buttonContainer}>
					{renderButton()}
				</div>
			</div>
			<div className={classes.mt1}>
				<SnowStepBox transactionStatus={transactionStatus} title={title} />
			</div>
		</SnowDialog>
	);
};

export default memo(CompoundDialogs);