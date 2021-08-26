import Toast from "components/Toast";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCompoundAndEarnContract } from "./compound-and-earn-context";
import { usePoolContract } from "./pool-context";


const DashboardContext = createContext(null);
export function DashboardProvider({ children }) {
  const [asked, setAsked] = useState(false);
  const [deposited, setDeposited] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [pendingPools, setPendingPools] = useState([]);
  const { pools } = usePoolContract();
  const { userPools, deposit, approve } = useCompoundAndEarnContract();

  useEffect(async () => {
    if(confirmed && !deposited && pendingPools.length > 0 && pools.length > 0){
      setDeposited(true);
      for(const idx in pendingPools){
        toast(<Toast 
          title={`Step ${Number(idx)+1}/${pendingPools.length}`}
          message={'Please Accept the transactions to fix your deposits!'}/>)
        const pool = pools.find((item) => { return pendingPools[idx].address.toLowerCase()
          === item.address.toLowerCase() });
      
        await approve(pool,pendingPools[idx].userBalanceSnowglobe);
        await deposit(pool,pendingPools[idx].userBalanceSnowglobe,false);
      }
    }
  },[confirmed,pendingPools,pools,deposited]); 

  const checkUserPools = () => {
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

  };

  return (
    <DashboardContext.Provider value={{ checkUserPools, asked, setAsked, 
      pendingPools, confirmed, setConfirmed }}>
      {children}
    </DashboardContext.Provider>
  );
}



export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('Missing stats context');
  }

  const { checkUserPools, asked, setAsked, pendingPools, confirmed, setConfirmed } = context;

  return { checkUserPools, asked, setAsked, pendingPools, confirmed, setConfirmed };
}