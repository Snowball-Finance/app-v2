import { createContext, useContext, useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { IS_MAINNET } from 'config';
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json';
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json';
import SNOWGLOBE_ABI from 'libs/abis/snowglobe.json';
import GAUGE_ABI from 'libs/abis/gauge.json';
import LP_ABI from 'libs/abis/lp-token.json';
import { useQuery } from '@apollo/client';
import { LAST_SNOWBALL_INFO } from 'api/compound-and-earn/queries';
import { usePopup } from 'contexts/popup-context'
import { usePoolContract } from './pool-context';
import { useContracts } from './contract-context';

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI;
const CompoundAndEarnContext = createContext(null);

export function CompoundAndEarnProvider({ children }) {
  const { library, account } = useWeb3React();
  const [loading, setLoading] = useState(false);

  const [userPools, setUserPools] = useState([]);
  const { gauges } = useContracts();
  const { pools } = usePoolContract();
  const { data } = useQuery(LAST_SNOWBALL_INFO);

  useEffect(() => {
    {
      getBalanceInfosByPool();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps   
  }, [data, pools, gauges, account]);

  const { setPopUp } = usePopup();

  const approve = async (item, amount) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
    } 
    
    try {
      if (item.kind === "Stablevault") {
        const vaultContract = new ethers.Contract(item.address, ERC20_ABI, library.getSigner());
        const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());

        return await _approve(vaultContract, gauge.address, amount)
      }
      else {
        const lpContract = new ethers.Contract(item.lpAddress, ERC20_ABI, library.getSigner());
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());
        const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());

        //make sure that the gauge approval will not overflow
        var snowglobeRatio;
        try{
          snowglobeRatio = (await snowglobeContract.getRatio()).add(ethers.utils.parseUnits("0.1"));
        }catch(error){
          //fix to safemath if snowglobe is empty
          snowglobeRatio = ethers.utils.parseUnits("1.1");
        }

        await _approve(lpContract, snowglobeContract.address, amount);
        await _approve(snowglobeContract, gauge.address, amount.mul(snowglobeRatio));
      }
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        text: `Error Approving: ${error.message}`
      });
      console.log(error)
    }
  }


  const _approve = (contract, spender, amount) => {
    return new Promise(async (resolve, reject) => {
      const allowance = await contract.allowance(account, spender)
      if (amount.gt(allowance)) {
        const approval = await contract.approve(spender, amount);
        const transactionApprove = await approval.wait(1);
        if (!transactionApprove.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error Approving`
          });
          reject(false);
        }
      }
      resolve(true)
    })
  }

  const deposit = async (item, amount) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return false;
    } 

    try {
      if (item.kind === "Snowglobe") {
        const lpContract = new ethers.Contract(item.lpAddress, ERC20_ABI, library.getSigner());
        const balance = await lpContract.balanceOf(account);

        amount = amount.gt(balance) ? balance : amount
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());
        const snowglobeDeposit = await snowglobeContract.deposit(amount);
        const transactionSnowglobeDeposit = await snowglobeDeposit.wait(1);
        if (!transactionSnowglobeDeposit.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error depositing into Snowglobe`
          });
          return;
        }

        amount = await snowglobeContract.balanceOf(account);
      }
      else {
        const vaultContract = new ethers.Contract(item.address, ERC20_ABI, library.getSigner());
        const balance = await vaultContract.balanceOf(account);
        amount = ethers.utils.parseEther(amount.toString());
        amount = amount.gt(balance) ? balance : amount
      }
      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
      const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());
      
      const gaugeDeposit = await gaugeContract.deposit(amount);
      const transactionGaugeDeposit = await gaugeDeposit.wait(1);
      if (!transactionGaugeDeposit.status) {
        setPopUp({
          title: 'Transaction Error',
          text: `Error depositing into Gauge`
        });
        return;
      }
      setTimeout(() => { window.location.reload(); }, 2000);
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        text: `Error Depositing: ${error.message}`
      })
    }
  }

  const withdraw = async (item) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      }); 
      return false;
    }
  
    try {
      
      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
      const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());
      const gaugeBalance = await gaugeContract.balanceOf(account);

      if (gaugeBalance.gt(0x00)) {
        const gaugeWithdraw = await gaugeContract.withdraw(gaugeBalance);
        const transactionGaugeWithdraw = await gaugeWithdraw.wait(1);
        if (!transactionGaugeWithdraw.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error withdrawing from Gauge`
          });
          return;
        }
        if (item.kind === "Stablevault") {
          setPopUp({
            title: 'Withdraw Complete',
            text: `Gauge Receipt: ${transactionGaugeWithdraw.transactionHash}\n`
          });
          setTimeout(() => { window.location.reload(); }, 2000);
        }
      }

      if (item.kind === "Snowglobe") {
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());
        const snowglobeBalance = await snowglobeContract.balanceOf(account);
        if (snowglobeBalance.gt(0x00)) {
          const snowglobeWithdraw = await snowglobeContract.withdraw(snowglobeBalance);
          const transactionSnowglobeWithdraw = await snowglobeWithdraw.wait(1)

          if (!transactionSnowglobeWithdraw.status) {
            setPopUp({
              title: 'Transaction Error',
              text: `Error withdrawing from Snowglobe`
            });
            return;
          }
          setPopUp({
            title: 'Withdraw Complete',
            text: `Globe Receipt: ${transactionSnowglobeWithdraw.transactionHash}\n`
          });
          setTimeout(() => { window.location.reload(); }, 2000);
        }
      }
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        text: `Error withdrawing`
      });
      console.log(error)
    }
  }

  const claim = async (item) => {
    if (!account || !gauges || !pools) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return false; 
    }
    const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
    const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());

    gaugeContract.getReward().then((t) => {
      t.wait().then((receipt) => {
        setPopUp({
          title: 'Claim Complete',
          text: `Claim Receipt: ${receipt.transactionHash}\n`
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }).catch((error) => {
        setPopUp({
          title: 'Transaction Error',
          text: `Error claiming from Gauge ${error}`
        });         
      }); 
    }).catch((error) => {
      setPopUp({
        title: 'Claim Error',
        text: `Error claiming from Gauge ${error}`
      });
    }); 
  }

  const getBalanceInfosByPool = async () => {
    if (!account || !gauges || !pools) {
      return false;
    }
    setLoading(true);
    const dataWithPoolBalance = await Promise.all(pools.map(async (item) => {
      const lpContract = new ethers.Contract(item.lpAddress, LP_ABI, library.getSigner());
      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() ===
        item.gaugeInfo.address.toLowerCase());
      let totalSupply, userDepositedLP, SNOBHarvestable, SNOBValue, underlyingTokens;
      if (item.kind === 'Snowglobe') {
        const snowglobeContract = new ethers.Contract(item.address,
          SNOWGLOBE_ABI, library.getSigner());

        totalSupply = await snowglobeContract.totalSupply();

        var snowglobeRatio;

        //avoid safemath error
        let snowglobeTotalBalance = await snowglobeContract.balance();
        if(snowglobeTotalBalance > 0) {
          snowglobeRatio = (await snowglobeContract.getRatio()) / 1e18;
        } else {
          snowglobeRatio = 1;
        }

        let balanceSnowglobe = await snowglobeContract.balanceOf(account) /1e18;
        if (gauge) {
          balanceSnowglobe += gauge.staked/1e18;
          SNOBHarvestable = gauge.harvestable / 1e18;
          SNOBValue = SNOBHarvestable * data?.LastSnowballInfo?.snowballToken.pangolinPrice;
        }

        userDepositedLP = (balanceSnowglobe * snowglobeRatio);
        
        if(userDepositedLP > 0 && item.name !== "xJoe"){
          let reserves = await lpContract.getReserves();
          let totalSupplyPGL = await lpContract.totalSupply() /1e18;
          const r0 = reserves._reserve0 / 10 ** item.token0.decimals;
          const r1 = reserves._reserve1 / 10 ** item.token1.decimals;
          let reserve0Owned = userDepositedLP * (r0) / (totalSupplyPGL);
          let reserve1Owned = userDepositedLP * (r1) / (totalSupplyPGL);
          underlyingTokens = {
            token0:{
              address:item.token0.address,
              symbol:item.token0.symbol,
              reserveOwned:reserve0Owned,
            },
            token1:{
              address:item.token1.address,
              symbol:item.token1.symbol,
              reserveOwned:reserve1Owned,
            }
          }
        }
      } else {
        if (gauge) {
          userDepositedLP = gauge.staked/1e18;
          totalSupply = gauge.totalSupply;
          SNOBHarvestable = gauge.harvestable / 1e18;
          SNOBValue = SNOBHarvestable * data?.LastSnowballInfo?.snowballToken.pangolinPrice;
        }
      }
      const userLPBalance =  BigNumber.from(await lpContract.balanceOf(account));

      return {
        ...item,
        address: item.address,
        userLPBalance: userLPBalance,
        userDepositedLP: userDepositedLP,
        usdValue: (userDepositedLP) * item.pricePoolToken,
        totalSupply, 
        SNOBHarvestable,
        SNOBValue,
        underlyingTokens
      };
    }));
    setLoading(false);
    setUserPools(dataWithPoolBalance);
  };

  return (
    <CompoundAndEarnContext.Provider value={{ loading, approve, deposit, withdraw, claim, userPools }}>
      {children}
    </CompoundAndEarnContext.Provider>
  );
}

export function useCompoundAndEarnContract() {
  const context = useContext(CompoundAndEarnContext);
  if (!context) {
    throw new Error('Missing stats context');
  }

  const { loading, approve, deposit, withdraw, claim, userPools } = context;

  return { loading, approve, deposit, withdraw, claim, userPools };
}
