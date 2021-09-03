import { createContext, useContext, useState, useEffect } from 'react'
import CoinGecko from 'coingecko-api'

const ContractContext = createContext(null)

export function PriceProvider({ children }) {
  const [prices, setPrices] = useState({
    snowball: 0,
    png: 0,
    wavax: 0,
    busd: 0,
    frax: 0,
  });

  useEffect(() => {
    const getPrices = async () => {
      const CoinGeckoClient = new CoinGecko();
      const { data: response } = await CoinGeckoClient.simple.price({
        ids: [
          'snowball-token',
          'pangolin',
          'wrapped-avax',
          'binance-usd',
          'frax'
        ],
        vs_currencies: ['usd'],
        include_24hr_change: [true]
      });

      const prices = {
        SNOB: response['snowball-token']?.usd || 0,
        SNOB24HChange: response['snowball-token']?.usd_24h_change || 0,
      };
      setPrices(prices);
    };

    getPrices();
    //setInterval(() => getPrices(), 120000);
  }, []);

  return (
    <ContractContext.Provider value={{ prices }} >
      {children}
    </ContractContext.Provider>
  )
}

export function usePrices() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const { prices } = context

  return { prices }
}