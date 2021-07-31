import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

import { IS_MAINNET } from 'config';
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json';
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json';
import SNOWGLOBE_ABI from 'libs/abis/snowglobe.json'
import GAUGE_ABI from 'libs/abis/gauge.json';
import { useQuery } from '@apollo/client';
import { LAST_SNOWBALL_INFO } from 'api/compound-and-earn/queries';
import { usePopup } from 'contexts/popup-context'
import { usePoolContract } from './pool-context';
import { useContracts } from './contract-context';

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI;
const CompoundAndEarnContext = createContext(null);

export function CompoundAndEarnProvider({ children }) {
  const { library, account } = useWeb3React();
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
    if (!account || !gauges || !pools) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
    } else {
      const lpContract = new ethers.Contract(item.lpAddress, ERC20_ABI, library.getSigner());
      const balance = await lpContract.balanceOf(account);
      
      amount = ethers.utils.parseEther(amount.toString());
      if (amount > balance) {
        setPopUp({
          title: 'Error',
          text: `Insufficient Balance`
        })
        return false;
      } else {
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());
        const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());   
      
        // Approve transfer from LP to snowglobe for amount + 10
        // Approve transfer from snowglobe to gauge for (amount + 10) * snowgloberatio
        const snowglobeRatio = await snowglobeContract.getRatio();
        amount += 10;
        lpContract.approve(snowglobeContract.address, amount).then((approved) => {
          if (approved) {
            snowglobeContract.approve(gauge.address, amount * snowglobeRatio).then((approved) => {
              return approved
            }).catch((error) => {
              setPopUp({
                title: 'Approve Error',
                text: `Error approving deposit into Gauge ${error}`
              });                  
            });
          }
        }).catch((error) => {
          setPopUp({
            title: 'Approve Error',
            text: `Error approving deposit into Snowglobe ${error}`
          });    
        });   
        return false;
      }
    }
  }

  const deposit = async (item, amount) => {
    if (!account || !gauges || !pools) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return false;
    } else {
      const lpContract = new ethers.Contract(item.lpAddress, ERC20_ABI, library.getSigner());
      const balance = await lpContract.balanceOf(account);
      
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      amount = ethers.utils.parseEther(amount.toString());
      if (amount > balance) {
        setPopUp({
          title: 'Error',
          text: `Insufficient Balance`
        })
        return false;
      } else {
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());
        const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());   

        lpContract.transfer(snowglobeContract.address, amount).then((t) => {
          web3.waitForTransaction(t.hash).then((globeReceipt) => {
            snowglobeContract.balanceOf(account).then((snowglobeBalance) => {
              snowglobeContract.transfer(gauge.address, snowglobeBalance).then((t) => {
                web3.waitForTransaction(t.hash).then((gaugeReceipt) => {
                  setPopUp({
                    title: 'Deposit Complete',
                    text: `Globe Receipt: ${globeReceipt}\nGauge Receipt: ${gaugeReceipt}\n`
                  });
                  return true;
                }).catch((error) => {
                  setPopUp({
                    title: 'Transaction Error',
                    text: `Error depositing into Gauge ${error}`
                  });
                }); 
              }).catch((error) => {
                setPopUp({
                  title: 'Deposit Error',
                  text: `Error depositing into Gauge ${error}`
                });    
              }); 
            });
          }).catch((error) => {
            setPopUp({
              title: 'Transaction Error',
              text: `Error depositing into Snowglobe ${error}`
            });        
          }); 
        }).catch((error) => {
          setPopUp({
            title: 'Deposit Error',
            text: `Error depositing into Snowglobe ${error}`
          });
        }); 
      }
      return false;
    }
  }

  const withdraw = async (item) => {
    if (!account || !gauges || !pools) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      });
      return false;
    } else {
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
      const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());
      const gaugeBalance = await gaugeContract.balanceOf(account);

      const snowglobeContract = new ethers.Contract(item.address,
        SNOWGLOBE_ABI, library.getSigner());
      const snowglobeBalance = await snowglobeContract.balanceOf(account);

      gaugeContract.withdraw(gaugeBalance).then((t) => {
        web3.waitForTransaction(t.hash).then((gaugeReceipt) => {
          snowglobeContract.withdraw(snowglobeBalance).then((t) => {
            web3.waitForTransaction(t.hash).then((globeReceipt) => {
              setPopUp({
                title: 'Withdraw Complete',
                text: `Gauge Receipt: ${gaugeReceipt}\nGlobe Receipt: ${globeReceipt}\n`
              })
            }).catch((error) => {
              setPopUp({
                title: 'Transaction Error',
                text: `Error withdrawing from Snowglobe ${error}`
              })     
            }); 
          }).catch((error) => {
            setPopUp({
              title: 'Withdraw Error',
              text: `Error withdrawing from Snowglobe ${error}`
            })     
          }); 
        }).catch((error) => {
          setPopUp({
            title: 'Transaction Error',
            text: `Error withdrawing from Gauge ${error}`
          })          
        }); 
      }).catch((error) => {
        setPopUp({
          title: 'Withdraw Error',
          text: `Error withdrawing from Gauge ${error}`
        });
      }); 
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
 
    const ethereumProvider = await detectEthereumProvider();
    const web3 = new Web3(ethereumProvider);

    gaugeContract.getReward().then((t) => {
      web3.waitForTransaction(t.hash).then((receipt) => {
        setPopUp({
          title: 'Claim Complete',
          text: `Claim Receipt: ${receipt}\n`
        });
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
    const dataWithPoolBalance = await Promise.all(pools.map(async (item) => {
      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() ===
        item.gaugeInfo.address.toLowerCase());
      let totalSupply, userDepositedLP, SNOBHarvestable, SNOBValue;
      if (item.kind === 'Snowglobe') {
        const snowglobeContract = new ethers.Contract(item.address,
          SNOWGLOBE_ABI, library.getSigner());

        totalSupply = await snowglobeContract.totalSupply() / 1e18;
        const snowglobeRatio = (await snowglobeContract.getRatio()) / 1e18;
        let balanceSnowglobe = await snowglobeContract.balanceOf(account) / 1e18;
        if (gauge) {
          balanceSnowglobe += gauge.staked / 1e18;
          SNOBHarvestable = gauge.harvestable / 1e18;
          SNOBValue = SNOBHarvestable * data?.LastSnowballInfo?.snowballToken.pangolinPrice;
        }
        userDepositedLP = (balanceSnowglobe * snowglobeRatio);
      } else {
        if (gauge) {
          userDepositedLP = gauge.staked / 1e18;
          totalSupply = gauge.totalSupply / 1e18;
          SNOBHarvestable = gauge.harvestable / 1e18;
          SNOBValue = SNOBHarvestable * data?.LastSnowballInfo?.snowballToken.pangolinPrice;
        }
      }

      const lpContract = new ethers.Contract(item.lpAddress, ERC20_ABI, library.getSigner());
      const userLPBalance = await lpContract.balanceOf(account) / 1e18;

      return {
        ...item,
        address: item.address,
        userLPBalance: userLPBalance,
        userDepositedLP: userDepositedLP,
        usdValue: userDepositedLP * item.pricePoolToken,
        totalSupply, SNOBHarvestable,
        SNOBValue
      };
    }));
    setUserPools(dataWithPoolBalance);
  };

  return (
    <CompoundAndEarnContext.Provider value={{ approve, deposit, withdraw, claim, userPools }}>
      {children}
    </CompoundAndEarnContext.Provider>
  );
}

export function useCompoundAndEarnContract() {
  const context = useContext(CompoundAndEarnContext);
  if (!context) {
    throw new Error('Missing stats context');
  }

  const { approve, deposit, withdraw, claim, userPools } = context;

  return { approve, deposit, withdraw, claim, userPools  };
}
