import SNOWGLOBE_ABI from 'libs/abis/snowglobe.json';
import GAUGE_ABI from 'libs/abis/gauge.json';
import LP_ABI from 'libs/abis/lp-token.json';
import { ContractCall } from 'libs/services/multicall';


const getPoolCalls = (item, account) => {
  const lpContractCalls = new ContractCall(item.lpAddress, LP_ABI);
  const snowglobeContractCalls = new ContractCall(item.address, SNOWGLOBE_ABI);
  lpContractCalls.setCall("balanceOf", [account]);
  lpContractCalls.setCall("decimals", []);
  if (item.kind === "Snowglobe" && item.token1.address) {
    lpContractCalls.setCall("getReserves", []);
  }
  lpContractCalls.setCall("totalSupply", []);

  snowglobeContractCalls.setCall("balanceOf", [account]);
  snowglobeContractCalls.setCall("decimals", []);
  if (item.kind === "Snowglobe") {
    snowglobeContractCalls.setCall("getRatio", []);
    snowglobeContractCalls.setCall("balance", []);
  }
  snowglobeContractCalls.setCall("totalSupply", []);

  return [lpContractCalls, snowglobeContractCalls];
}

const getGaugeCalls = (pool, account) => {
  const gaugeTokenCalls = new ContractCall(pool.address, SNOWGLOBE_ABI);
  const gaugeCalls = new ContractCall(pool.gaugeInfo.address, GAUGE_ABI);
  gaugeTokenCalls.setCall("balanceOf", [account]);
  gaugeCalls.setCall("balanceOf", [account]);
  gaugeCalls.setCall("earned", [account]);
  gaugeCalls.setCall("totalSupply", []);

  return [gaugeTokenCalls, gaugeCalls];
}

const getDeprecatedCalls = (pool, account) => {
  const snowglobeCalls = new ContractCall(pool.contractAddresses[0], SNOWGLOBE_ABI);
  const gaugeCalls = new ContractCall(pool.contractAddresses[1], GAUGE_ABI);

  snowglobeCalls.setCall("balanceOf", [account]);
  gaugeCalls.setCall("balanceOf", [account]);
  gaugeCalls.setCall("earned", [account]);

  return [snowglobeCalls,gaugeCalls];
}

export {
  getGaugeCalls,
  getPoolCalls,
  getDeprecatedCalls
}