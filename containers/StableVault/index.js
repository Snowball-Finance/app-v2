import { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import { useS3fVaultContracts } from 'contexts/s3f-vault-context'

import SnowLoading from 'components/SnowLoading'
import VaultHeader from 'parts/Vault/VaultHeader'
import SubMenuTabs from 'parts/SubMenuTabs'
import SwapForm from './SwapForm'
import LiquidityForm from './LiquidityForm'
import TransactionsCard from './TransactionsCard'
import MyShare from './MyShare'
import { VAULT_S3D_IMAGE_PATH, VAULT_S3F_IMAGE_PATH } from 'utils/constants/image-paths'
import { VAULT_TABS, VAULT_TABS_ARRAY } from 'utils/constants/vault-tabs'

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
		marginTop: -theme.spacing(4),
	},
	header: {
		marginBottom: theme.spacing(3)
	},
	s3D: {
		background: `linear-gradient(90deg, ${theme.custom.palette.blue} 0%, ${theme.custom.palette.darkBlue} 100%)`,
	},
	s3F: {
		background: `linear-gradient(90deg, ${theme.custom.palette.green} 0%, ${theme.custom.palette.darkGreen} 100%)`,
	}
}));

const StableVault = ({vault}) => {
	const classes = useStyles();
	const { loading, pairNames} = (vault == 's3D') ? useS3dVaultContracts() : useS3fVaultContracts();

	const [selectedTab, setSelectedTab] = useState(VAULT_TABS.swap.VALUE)

	return (
		<main className={classes.root}>
			{loading && <SnowLoading loading={loading} />}
			<VaultHeader
				title={`${vault} Vault`}
				subHeader={pairNames}
				icon={(vault == 's3D') ? VAULT_S3D_IMAGE_PATH : VAULT_S3F_IMAGE_PATH}
				className={clsx(classes.header, classes[vault])}
			/>
			<SubMenuTabs
				tabs={VAULT_TABS_ARRAY}
				selectedTab={selectedTab}
				setSelectedTab={setSelectedTab}
			/>
			{selectedTab === VAULT_TABS.swap.VALUE && <SwapForm vault={vault}/>}
			{selectedTab === VAULT_TABS.liquidity.VALUE && <LiquidityForm vault={vault}/>}
			{selectedTab === VAULT_TABS.transactions.VALUE && <TransactionsCard vault={vault}/>}
			{selectedTab === VAULT_TABS.share.VALUE && <MyShare vault={vault}/>}
		</main>
	);
}
export default memo(StableVault)