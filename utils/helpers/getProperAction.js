import LINKS from 'utils/constants/links'

const PangolinPoolURL = 'https://app.pangolin.exchange/#/add/';
const JoePoolURL = 'https://www.traderjoexyz.com/#/pool/';

const getProperAction = (item, balance, deposit = 0) => {
	let action = [];
	
	if (deposit > 0) {
		action = ["Details", () => {}]
	} else if (balance > 0) {
		action = ["Deposit", (_, setModal) => {setModal({ title: 'Deposit', item: item })}];
	} else {
		if (item.source == "Pangolin") {
			action = ["Get_PGL", () => {window.open(`${PangolinPoolURL}${item.token0.address.toLowerCase()}/${item.token1.address.toLowerCase()}`)}];
		} else if (item.source == "Trader Joe") {
			action = ["Get_JLP", () => {window.open(`${JoePoolURL}${item.token0.address.toLowerCase()}/${item.token1.address.toLowerCase()}`)}];
		} else if (item.name == "S3D (USDT-BUSD-DAI)") {
			action = ["Get_s3D", (router) => {router.push(LINKS.S3D_VAULT.HREF)}];
		} else if (item.name == "S3F (FRAX-TUSD-USDT)") {
			action = ["Get_s3F", (router) => {router.push(LINKS.S3F_VAULT.HREF)}];
		}
	}

	return action;
}

export default getProperAction
