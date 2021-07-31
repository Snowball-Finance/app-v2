import { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { useS4dVaultContracts } from 'contexts/s4d-vault-context'
import SnowLoading from 'components/SnowLoading'
import VaultHeader from 'parts/Vault/VaultHeader'
import SubMenuTabs from 'parts/SubMenuTabs'
import SwapForm from './SwapForm'
import LiquidityForm from './LiquidityForm'
import TransactionsCard from './TransactionsCard'
import MyShare from './MyShare'
import { VAULT_S3D_IMAGE_PATH } from 'utils/constants/image-paths'
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
    marginBottom: theme.spacing(3),
    background: `linear-gradient(90deg, ${theme.custom.palette.blue} 0%, ${theme.custom.palette.darkBlue} 100%)`,
  },
}));

const S4Vault = () => {
  const classes = useStyles();
  const { loading, pairNames } = useS4dVaultContracts();

  const [selectedTab, setSelectedTab] = useState(VAULT_TABS.swap.VALUE)

  return (
    <main className={classes.root}>
      {loading && <SnowLoading loading={loading} />}
      <VaultHeader
        title={`s4d Vault`}
        subHeader={pairNames}
        icon={VAULT_S3D_IMAGE_PATH}
        className={classes.header}
      />
      <SubMenuTabs
        tabs={VAULT_TABS_ARRAY}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === VAULT_TABS.swap.VALUE && <SwapForm />}
      {selectedTab === VAULT_TABS.liquidity.VALUE && <LiquidityForm />}
      {selectedTab === VAULT_TABS.transactions.VALUE && <TransactionsCard />}
      {selectedTab === VAULT_TABS.share.VALUE && <MyShare />}
    </main>
  );
}
export default memo(S4Vault)