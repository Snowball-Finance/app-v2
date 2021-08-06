import LINKS from 'utils/constants/links'

const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';
const PangolinPoolURL = 'https://app.pangolin.exchange/#/add/';
const JoePoolURL = 'https://www.traderjoexyz.com/#/pool/';

const getProperAction = (item, setModal, balance, deposit = 0) => {
	const token1 = item.token0.address == WAVAX ? "AVAX" : item.token0.address.toLowerCase();
	const token2 = item.token1.address == WAVAX ? "AVAX" : item.token1.address.toLowerCase();

	let action = [];
	if (deposit > 0) {
		action = ["Details", () => {}]
	} else if (balance > 0) {
		action = ["Deposit", () => setModal({ open: true, title: 'Deposit' })];
	} else {
		if (item.source == "Pangolin") {
			action = ["Get_PGL", () => { window.open(`${PangolinPoolURL}${token1}/${token2}`) }];
		} else if (item.source == "Trader Joe") {
			action = ["Get_JLP", () => { window.open(`${JoePoolURL}${token1}/${token2}`) }];
		} else if (item.name == "S3D (USDT-BUSD-DAI)") {
			action = ["Get_s3D", (router) => { router.push(LINKS.S3D_VAULT.HREF) }];
		} else if (item.name == "S3F (FRAX-TUSD-USDT)") {
			action = ["Get_s3F", (router) => { router.push(LINKS.S3F_VAULT.HREF) }];
		}
	}

	return action;
}

export default getProperAction
