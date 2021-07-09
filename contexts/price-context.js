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
      });

      const prices = {
        snowball: response['snowball-token']?.usd || 0,
        png: response['pangolin']?.usd || 0,
        wavax: response['wrapped-avax']?.usd || 0,
        busd: response['binance-usd']?.usd || 0,
        frax: response['frax']?.usd || 0,
      };
      setPrices(prices);
    };

    getPrices();
    setInterval(() => getPrices(), 120000);
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