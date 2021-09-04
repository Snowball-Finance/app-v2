
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
import Toast from 'components/Toast'
import { toast } from 'react-toastify'
import { Typography } from '@material-ui/core'
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context'
import { useAPIContext } from 'contexts/api-context'

const GeneralAlerts = () => {
  const { account, library } = useWeb3React()
  const { gauges } = useContracts()
  const { setPopUp } = usePopup()
  const { getLastSnowballInfo } = useAPIContext()
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } = getLastSnowballInfo()

  //upgrade gaugesv2
  const [openModal, setOpenModal] = useState(false)
  const [upgradeGauge, setUpgradeGauge] = useState({upgrade:false,checked:false})
  const [userGauges, setUserGauges] = useState([])
  const [upgradingStep, setUpgradingStep] = useState(0)


  //partial investments
  const [asked, setAsked] = useState(false);
  const [deposited, setDeposited] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [pendingPools, setPendingPools] = useState([]);
  const { userPools, deposit, approve } = useCompoundAndEarnContract();
  const [modal, setModal] = useState({ open: false, title: '', text: '', textButton: '' })

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
      toast(<Toast 
        message={'Please click here to understand why.'} 
        toastType={'warning'}
        title={'You\'re leaving potential income'}
        processing={false}/>,{onClick: () => 
          setModal({ 
            open: true, 
            title: 'We noticed that you\'re leaving potential income on the table!',
            text: readMore,
            textButton: 'Fix my pools'
          })});
    }
  },[pendingPools]);

  useEffect(() => {
    async function fixPools(){
      if (confirmed && !deposited && pendingPools.length > 0 && pools.length > 0) {
        setDeposited(true);
        let step = 0;
        for (const idx in pendingPools) {
          const pool = pools.find((item) => {
            return pendingPools[idx].address.toLowerCase()
              === item.address.toLowerCase()
          });
          if(pool){
            step++;
            toast(<Toast
              title={`Step ${step}/${pendingPools.length *2}`}
              message={'Please Accept the transactions to fix your deposits!'} />)
            await approve(pool, pendingPools[idx].userBalanceSnowglobe, true);
            step++;
            toast(<Toast
              title={`Step ${step}/${pendingPools.length *2}`}
              message={'Please Accept the transactions to fix your deposits!'} />)
            await deposit(pool, pendingPools[idx].userBalanceSnowglobe, true);
          }
        }
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
        setOpenModal(true)
        setUserGauges(userGauges)
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
            text: `Error withdrawing from Gauge`
          });
          setUpgradeGauge({upgrade:false,checked:true})
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
          setUpgradeGauge({upgrade:false,checked:true})
          return
        }
        setUpgradingStep((prev) => prev + 1)

        // approve token newGauge
        const tokenBalance = await tokenContract.balanceOf(account)
        const tokenApprove = await tokenContract.approve(newGaugeAddress,tokenBalance);
        const transactionTokenApprove = await tokenApprove.wait(1);
        if (!transactionTokenApprove.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error approving token`
          });
          setUpgradeGauge({upgrade:false,checked:true})
          return
        }
        setUpgradingStep((prev) => prev + 1)

        // deposit token on newGauge
        const tokenDeposit = await newGaugeContract.deposit(tokenBalance);
        const transactionTokenDeposit = await tokenDeposit.wait(1);
        if (!transactionTokenDeposit.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error depositing token`
          });
          setUpgradeGauge({upgrade:false,checked:true})
          return
        }
        setUpgradingStep((prev) => prev + 1)
      }

      setPopUp({
        title: 'Success',
        text: 'Upgrade to GaugeProxyV2 completed!'
      });
      setTimeout(() => { window.location.reload(); }, 2000);
    } catch (error) {
      setUpgradeGauge({upgrade:false,checked:true})
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
          setConfirmed={(status) => {setUpgradeGauge({upgrade:status,checked:true})}}
          handleClose={closeModalHandler}
        />
      }
      {upgradeGauge.upgrade &&
        <UpgradeGaugeSteps
          gaugesLength={userGauges.length}
          step={upgradingStep}
          open={upgradeGauge.upgrade}
          handleClose={() => setUpgradeGauge({upgrade:false,checked:true})}
        />
      }
      {modal.open && (
      <WarningDialogs
        open={modal.open}
        title={modal.title}
        text={modal.text}
        textButton={modal.textButton}
        setConfirmed={setConfirmed}
        handleClose={() => setModal({ open: false, title: '' })}
      />
    )}
    </>
  )
}

export default memo(GeneralAlerts)