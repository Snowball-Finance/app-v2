
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
import UpgradeSteps from './UpgradeSteps'
import { isEmpty } from 'utils/helpers/utility'
import { Typography } from '@material-ui/core'
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context'
import { useLastSnowballInfo } from 'contexts/api-context'
import ANIMATIONS from 'utils/constants/animate-icons'

const GeneralAlerts = () => {
  const { account, library } = useWeb3React()
  const { gauges } = useContracts()
  const { setPopUp } = usePopup()
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } =
    useLastSnowballInfo();

  //upgrade gaugesv2
  const [upgradeGauge, setUpgradeGauge] = useState({upgrade:false,checked:false})
  const [userGauges, setUserGauges] = useState([])
  const [upgradingStep, setUpgradingStep] = useState({current:0,total:0,pools:0})


  //partial investments
  const [asked, setAsked] = useState(false);
  const [deposited, setDeposited] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [pendingPools, setPendingPools] = useState([]);
  const { userPools, deposit, approve } = useCompoundAndEarnContract();
  const [modal, setModal] = useState(
    { open: false, title: '', text: '', textButton: '' }
  )

  useEffect(() => {
    if(!asked && account && userPools.length > 0 && gauges.length > 0
      && (upgradeGauge.checked && !(upgradeGauge.upgrade))){
        const checkUserPools = async () =>{
          if (userPools.length > 0) {
            let pending = [];
            //check for funds dangling in snowglobes
            for (const idx in userPools) {
              if (userPools[idx].userBalanceSnowglobe > 0) {
                pending.push(userPools[idx]);
              }
            }
            setUpgradingStep({total:pending.length*2,current:0,pools:pending.length});
            setPendingPools(pending);
            setAsked(true);
          }
        }
      checkUserPools();
    }
  },[account,asked,userPools,gauges,upgradeGauge]);

  useEffect(() => {
    if (pendingPools.length > 0) {
      const readMore = (
        <>
          <Typography>
           Some of your investments are compounding, but not receiving the SNOB
                    rewards you&apos;re entitled to. Click below to resolve.
          </Typography>
          <a target='_blank' rel="noreferrer" href="https://snowballs.gitbook.io/snowball-docs/products/compounding#the-benefits-of-compounding-with-snowball">
              Read More.
          </a>
        </>);
      setModal({
        open: true,
        title: 'We noticed that you\'re leaving potential income on the table!',
        text: readMore,
        textButton: 'Fix my pools'
      });
    }
  },[pendingPools]);

  useEffect(() => {
    async function fixPools(){
      if (confirmed && !deposited && pendingPools.length > 0 && pools.length > 0) {
        setDeposited(true);
        for (const idx in pendingPools) {
          const pool = pools.find((item) => {
            return pendingPools[idx].address.toLowerCase()
              === item.address.toLowerCase()
          });
          if(pool){
            setUpgradingStep((prev) => {
              return {
                current:prev.current++,
                ...prev
              }
            });
            await approve(pool, pendingPools[idx].userBalanceSnowglobe, true);
            setUpgradingStep((prev) => {
              return {
                current:prev.current++,
                ...prev
              }
            });
            await deposit(pool, pendingPools[idx].userBalanceSnowglobe, true);
          }
        }
        setTimeout(() => { window.location.reload(); }, 2000);
      }
    }
    fixPools();
  }, [confirmed, pendingPools, pools, deposited, approve, deposit]);




  useEffect(() => {
    if (account && !isEmpty(gauges)) {
      checkUserBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, gauges]);

  const checkUserBalance = async () => {
    try {
      let userGauges = [];
      const gaugeProxyV1Contract = new ethers.Contract(CONTRACTS.GAUGE_PROXYV1, GAUGE_PROXY_ABI, library.getSigner());
      const gaugeProxyV2Contract = new ethers.Contract(CONTRACTS.GAUGE_PROXYV2, GAUGE_PROXY_ABI, library.getSigner());
      await Promise.all(
        gauges.map(async (item) => {
          const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
          const oldGaugeAddress = await gaugeProxyV1Contract.getGauge(item.token);
          const newGaugeAddress = await gaugeProxyV2Contract.getGauge(item.token);
          //ensure that we have a gauge
          if(oldGaugeAddress !== ZERO_ADDRESS && newGaugeAddress !== ZERO_ADDRESS){
            const gaugeContract = new ethers.Contract(oldGaugeAddress, GAUGE_ABI, library.getSigner());
            const gaugeBalance = await gaugeContract.balanceOf(account);
            const gauge = {
              address:oldGaugeAddress,
              token:item.token
            }
            if (gaugeBalance.gt(0x00)) {
              userGauges = [
                ...userGauges,
                gauge
              ]
            }
          }
        }));

      if (!isEmpty(userGauges)) {
        const text = (
          <>
            In order to better serve the community{"'"}s desire for more frequent
            changes in SNOB rewards, we have upgraded to GaugeProxyV2.
            This will allow us to have much more frequent SNOB reward distribution
            changes.
            <br/> <br/>
            Please click the button below to upgrade to GaugeProxyV2 and
            continue receiving SNOB rewards.
          </>
        )
        setUpgradingStep({total:userGauges.length*4,current:0,pools:userGauges.length});
        setUserGauges(userGauges);
        setModal({
          open: true,
          title: 'We have upgraded the GaugeProxy system!',
          text: text,
          textButton: 'Upgrade!'
        });
      }else{
        setUpgradeGauge({upgrade:false,checked:true})
      }
    } catch (error) {
      console.log('[checkUserBalance] Error => ', error)
    }
  }

  useEffect(() => {
    if (upgradeGauge.upgrade) {
      upgradeGaugeProxy2()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgradeGauge])

  const upgradeGaugeProxy2 = async () => {
    try {
      const gaugeProxyV2Contract = new ethers.Contract(CONTRACTS.GAUGE_PROXYV2, GAUGE_PROXY_ABI, library.getSigner())

      for (const gauge of userGauges) {
        const newGaugeAddress = await gaugeProxyV2Contract.getGauge(gauge.token)
        if (!newGaugeAddress) {
          setPopUp({
            title: 'Transaction Error',
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error get New Gauge Address from New GaugeProxy`
          });
          setUpgradeGauge({upgrade:false,checked:true})
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
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error withdrawing from Gauge`
          });
          setUpgradeGauge({upgrade:false,checked:true})
          return
        }
        setUpgradingStep((prev) => {
          return {
            current:prev.current++,
            ...prev
          }
        });

        // claim from oldGauge
        const gaugeClaim = await gaugeContract.getReward();
        const transactionGaugeClaim = await gaugeClaim.wait(1);
        if (!transactionGaugeClaim.status) {
          setPopUp({
            title: 'Transaction Error',
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error claiming from Gauge`
          });
          setUpgradeGauge({upgrade:false,checked:true})
          return
        }
        setUpgradingStep((prev) => {
          return {
            current:prev.current++,
            ...prev
          }
        });

        // approve token newGauge
        const tokenBalance = await tokenContract.balanceOf(account)
        const tokenApprove = await tokenContract.approve(newGaugeAddress,ethers.constants.MaxUint256);
        const transactionTokenApprove = await tokenApprove.wait(1);
        if (!transactionTokenApprove.status) {
          setPopUp({
            title: 'Transaction Error',
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error approving token`
          });
          setUpgradeGauge({upgrade:false,checked:true})
          return
        }
        setUpgradingStep((prev) => {
          return {
            current:prev.current++,
            ...prev
          }
        });

        // deposit token on newGauge
        const tokenDeposit = await newGaugeContract.deposit(tokenBalance);
        const transactionTokenDeposit = await tokenDeposit.wait(1);
        if (!transactionTokenDeposit.status) {
          setPopUp({
            title: 'Transaction Error',
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error depositing token`
          });
          setUpgradeGauge({upgrade:false,checked:true})
          return
        }
        setUpgradingStep((prev) => {
          return {
            current:prev.current++,
            ...prev
          }
        });
      }

      setPopUp({
        title: 'Success',
        icon: ANIMATIONS.SUCCESS.VALUE,
        text: 'Upgrade to GaugeProxyV2 completed!'
      });
      setTimeout(() => { window.location.reload(); }, 2000);
    } catch (error) {
      setUpgradeGauge({upgrade:false,checked:true})
      console.log('[upgradeGaugeProxy2] Error => ', error)
    }
  }

  return (
    <>
      {modal.open && (
        <WarningDialogs
          open={modal.open}
          title={modal.title}
          text={modal.text}
          textButton={modal.textButton}
          setConfirmed={(status) => {
            if(userGauges.length > 0){
              setUpgradeGauge({upgrade:status,checked:true});
            }else{
              setConfirmed(status);
            }
          }}
          handleClose={() => setModal({ open: false, title: '' })}
        />
      )}
      {(upgradeGauge.upgrade || confirmed) &&
        <UpgradeSteps
          length={upgradingStep.pools}
          step={upgradingStep.current}
          open={upgradeGauge.upgrade || confirmed}
          totalSteps={upgradingStep.total}
          handleClose={() =>{
            setUpgradingStep({total:0,current:0,pools:0});
            if(userGauges.length > 0){
              setUpgradeGauge({upgrade:false,checked:true});
            }else{
              setConfirmed(false);
            }
          }}
        />}
    </>
  )
}

export default memo(GeneralAlerts)