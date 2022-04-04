import { CONTRACTS } from 'config';

export const getZapperContract = (item) => {
    let zapperAddress;
    switch(item.source) {
      case "Trader Joe":
        zapperAddress = CONTRACTS.SNOWGLOBE_ZAPPER_TJ
        break;
      case "Pangolin":
        zapperAddress = CONTRACTS.SNOWGLOBE_ZAPPER_PG
        break;
      case "Axial":
        if (item.name === "AVAX-AXIAL") {
          zapperAddress = CONTRACTS.SNOWGLOBE_ZAPPER_TJ
          break;
        }
      //we want to raise if its not avax-axial
      case "Vector":
        if (item.name === "xPTP-PTP") {
          zapperAddress = CONTRACTS.SNOWGLOBE_ZAPPER_TJ
          break;
        }
        default:
          throw new Error("Protocol is not zappable");      
    }
    return zapperAddress;
}