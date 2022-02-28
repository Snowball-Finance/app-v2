import CoinGecko from "coingecko-api";

export const getAPR = async (xsnob, snob, axial) => {
  let snobAPR = ((snob * 52) / xsnob) * 100;
  let axialAPR = 0;
  if (axial > 0) {
    const CoinGeckoClient = new CoinGecko();
    let prices;
    try {
      const { data: response } = await CoinGeckoClient.simple.price({
        ids: ["snowball-token", "axial-token"],
        vs_currencies: ["usd"],
        include_24hr_change: [true],
      });

      prices = {
        SNOB: response["snowball-token"]?.usd || 0,
        AXIAL: response["axial-token"]?.usd || 0,
      };
    } catch {
      console.log("Error of price fetching");
    }

    let ratio = prices.SNOB / prices.AXIAL;
    axialAPR = (((axial / ratio) * 52) / xsnob) * 100;
  }

  return [snobAPR, axialAPR];
};
