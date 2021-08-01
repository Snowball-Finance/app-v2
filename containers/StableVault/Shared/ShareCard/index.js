import { memo, useState } from 'react'

import CardFormWrapper from 'parts/Card/CardFormWrapper'
import StakeInformation from './StakeInformation'
import VaultRemoveLiquidityDialog from './VaultRemoveLiquidityDialog'

const ShareCard = ({
  vault,
  staked,
  tokenArray,
  getWithdrawAmount,
  removeLiquidity
}) => {
  const [liquidityDialog, setLiquidityDialog] = useState(false);

  return (
    <>
      <CardFormWrapper
        title='My Share'
        subTitle='StableVault stake information'
      >
        <StakeInformation
          vault={vault}
          staked={staked}
          onRemove={() => setLiquidityDialog(true)}
        />
      </CardFormWrapper>
      {liquidityDialog &&
        <VaultRemoveLiquidityDialog
          tokenArray={tokenArray}
          getWithdrawAmount={getWithdrawAmount}
          removeLiquidity={removeLiquidity}
          open={liquidityDialog}
          setOpen={setLiquidityDialog}
        />
      }
    </>
  )
}

export default memo(ShareCard)