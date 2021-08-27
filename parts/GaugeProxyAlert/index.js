
import { memo, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { useContracts } from 'contexts/contract-context'
import { usePopup } from 'contexts/popup-context'
import { CONTRACTS } from 'config'
import GAUGE_PROXY_ABI from 'libs/abis/gauge-proxy.json'
import GAUGE_ABI from 'libs/abis/gauge.json'
import GAUGE_TOKEN_ABI from 'libs/abis/gauge-token.json'
import WarningDialogs from 'parts/WarningDialogs'
import UpgradeGaugeSteps from './UpgradeGaugeSteps'
import { isEmpty } from 'utils/helpers/utility'

const GaugeProxyAlert = () => {
  const { account, library } = useWeb3React()
  const { gauges } = useContracts()
  const { setPopUp } = usePopup()

  const [openModal, setOpenModal] = useState(false)
  const [upgradeGauge, setUpgradeGauge] = useState(false)
  const [userGauges, setUserGauges] = useState([])
  const [upgradingStep, setUpgradingStep] = useState(0)

  useEffect(() => {
    if (account && !isEmpty(gauges)) {
      checkUserBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, gauges]);

  const checkUserBalance = async () => {
    try {
      let userGauges = []
      await Promise.all(
        gauges.map(async (gauge) => {
          const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());
          const gaugeBalance = await gaugeContract.balanceOf(account);
          if (gaugeBalance.gt(0x00)) {
            userGauges = [
              ...userGauges,
              gauge
            ]
          }
        }));

      if (!isEmpty(userGauges)) {
        setOpenModal(true)
        setUserGauges(userGauges)
      }
    } catch (error) {
      console.log('[checkUserBalance] Error => ', error)
    }
  }

  useEffect(() => {
    if (upgradeGauge) {
      upgradeGaugeProxy2()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgradeGauge])

  const upgradeGaugeProxy2 = async () => {
    try {
      const gaugeProxyV2Contract = new ethers.Contract(CONTRACTS.GAUGE_PROXY, GAUGE_PROXY_ABI, library.getSigner())

      for (const gauge of userGauges) {
        const newGaugeAddress = await gaugeProxyV2Contract.getGauge(gauge.token)
        if (!newGaugeAddress) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error get New Gauge Address from New GaugeProxy`
          });
          setUpgradeGauge(false)
          return
        }

        const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());
        const newGaugeContract = new ethers.Contract(newGaugeAddress, GAUGE_ABI, library.getSigner());
        const tokenContract = new ethers.Contract(gauge.token, GAUGE_TOKEN_ABI, library.getSigner());

        // withdraw from oldGauge
        const gaugeBalance = await gaugeContract.balanceOf(account)
        const gaugeWithdraw = await gaugeContract.withdraw(gaugeBalance);
        const transactionGaugeWithdraw = await gaugeWithdraw.wait(1);
        if (!transactionGaugeWithdraw.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error withdrawing from Gauge`
          });
          setUpgradeGauge(false)
          return
        }
        setUpgradingStep((prev) => prev + 1)

        // claim from oldGauge
        const gaugeClaim = await gaugeContract.getReward();
        const transactionGaugeClaim = await gaugeClaim.wait(1);
        if (!transactionGaugeClaim.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error claiming from Gauge`
          });
          setUpgradeGauge(false)
          return
        }
        setUpgradingStep((prev) => prev + 1)

        // approve token newGauge
        const tokenBalance = await tokenContract.balanceOf(account)
        const tokenApprove = await tokenContract.approve(tokenBalance, newGaugeAddress);
        const transactionTokenApprove = await tokenApprove.wait(1);
        if (!transactionTokenApprove.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error approving token`
          });
          setUpgradeGauge(false)
          return
        }
        setUpgradingStep((prev) => prev + 1)

        // deposit token on newGauge
        const tokenDeposit = await newGaugeContract.approve(tokenBalance, newGaugeAddress);
        const transactionTokenDeposit = await tokenDeposit.wait(1);
        if (!transactionTokenDeposit.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error depositing token`
          });
          setUpgradeGauge(false)
          return
        }
        setUpgradingStep((prev) => prev + 1)
      }

      setPopUp({
        title: 'Success',
        text: 'Upgrade to GaugeProxyV2 and continue receiving SNOB rewards.'
      });
      setUpgradeGauge(false)
    } catch (error) {
      setUpgradeGauge(false)
      console.log('[upgradeGaugeProxy2] Error => ', error)
    }
  }

  const closeModalHandler = () => {
    setOpenModal(false)
  }

  return (
    <>
      {openModal &&
        <WarningDialogs
          open={openModal}
          title='We have upgraded the GaugeProxy system!'
          text={
            <>
              In order to better serve the community{"'"}s desire for more frequent
              changes in SNOB rewards, we have upgraded to GaugeProxyV2.
              This will allow us to have much more frequent SNOB reward distribution
              changes. To celebrate this launch, we will be increasing emissions
              by 1.5x for one week!
              <br /> <br />
              Please click the button below to upgrade to GaugeProxyV2 and
              continue receiving SNOB rewards.
            </>
          }
          textButton='Upgrade!'
          setConfirmed={setUpgradeGauge}
          handleClose={closeModalHandler}
        />
      }
      {upgradeGauge &&
        <UpgradeGaugeSteps
          gaugesLength={userGauges.length}
          step={upgradingStep}
          open={upgradeGauge}
          handleClose={() => setUpgradeGauge(false)}
        />
      }
    </>
  )
}

export default memo(GaugeProxyAlert)