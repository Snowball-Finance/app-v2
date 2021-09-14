import LINKS from 'utils/constants/links'
import { WAVAX } from 'utils/constants/addresses'

const PangolinPoolURL = 'https://app.pangolin.exchange/#/add/';
const JoePoolURL = 'https://www.traderjoexyz.com/#/pool/';

const getProperAction = (item, setModal, balance, deposit = 0) => {
  let action = [];

	const token1 = item.token0?.address == WAVAX ? "AVAX" : item.token0?.address?.toLowerCase();
	const token2 = item.token1?.address == WAVAX ? "AVAX" : item.token1?.address?.toLowerCase();

	if (deposit > 0) {
		action = ["Details", () => {}]
	} else if (balance > 0) {
		action = ["Deposit", () => setModal({ open: true, title: 'Deposit', address: item.address })];
  }else if (item.name == "xJOE") {
		action = ["Get_xJoe", () => { window.open(`https://www.traderjoexyz.com/#/stake`) }];
  } else if (!item.token1?.address){
    action = ["Get_Token", () => { window.open(`https://app.pangolin.exchange/#/swap/${token1}`) }];
	} else if (item.source == "Pangolin") {
		action = ["Get_PGL", () => { window.open(`${PangolinPoolURL}${token1}/${token2}`) }];
  } else if (item.source == "Trader Joe") {
		action = ["Get_JLP", () => { window.open(`${JoePoolURL}${token1}/${token2}`) }];
	} else if (item.name == "S3D (USDT-BUSD-DAI)") {
		action = ["Get_s3D", (router) => { router.push(LINKS.S3D_VAULT.HREF) }];
	} else if (item.name == "S3F (FRAX-TUSD-USDT)") {
		action = ["Get_s3F", (router) => { router.push(LINKS.S3F_VAULT.HREF) }];
	} else if (item.name == "S4D (DAI.e-FRAX-TUSD-USDT.e)") {
		action = ["Get_s4D", (router) => { router.push(LINKS.S4D_VAULT.HREF) }];
	}

	return action;
}

export default getProperAction
