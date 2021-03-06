import LINKS from 'utils/constants/links'
import { WAVAX } from 'utils/constants/addresses'
import { floatToBN } from './format';

const PangolinURL = 'https://app.pangolin.exchange/#';
const JoeURL = 'https://www.traderjoexyz.com/#';
const AxialURL = 'https://app.axial.exchange/#';

const getProperAction = (item, setModal, balance, AVAXBalance, deposit = 0, details = false) => {
	let action = [];
	const token1 = item.token0?.address == WAVAX ? "AVAX" : item.token0?.address?.toLowerCase();
	
	if(!item.token1?.address && item.token0?.address === WAVAX) {
		if(balance > 0) {
			balance.add(floatToBN(AVAXBalance));
		} else {
			balance = floatToBN(AVAXBalance)
		}
	}

	if (item.SNOBHarvestable > 0 && item.userDepositedLP === 0 && !details) {
		action = ["CLAIM", () => { }]
	} else if (deposit > 0) {
		action = ["Details", () => { }]
	} else if (balance > 0) {
		action = ["Deposit", () => setModal({ open: true, title: 'Deposit', address: item.address })] 
	} else if (item.name == "xJOE") {
		action = ["Get_xJoe", () => { window.open(`${JoeURL}/stake`) }];
	} else if (!item.token1?.address && item.symbol !== "AXLP") {
		action = ["Get_Token", () => { window.open(`${PangolinURL}/swap/${token1}`) }];
	} else if (item.symbol == "AXLP" && item.name !== "AVAX-AXIAL"){
		const ticker = item.name.toLowerCase().split(" ")[0];

		action = ["Get_Token", () => { window.open(`${AxialURL}/pools/${ticker}/deposit`) }];
	} else if (
		item.source === "Pangolin"
	|| (item.source === "Trader Joe" 
	|| item.name === "AVAX-AXIAL"
	|| item.name === "xPTP-PTP")) {
		action = ["Deposit", () => setModal({ open: true, title: 'Deposit', address: item.address })];
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
