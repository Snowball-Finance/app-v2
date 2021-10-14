import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";


const ProviderContext = createContext(null);

export function ProviderProvider({ children }) {
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);

  const PRIVATENODE = process.env.PRIVATENODE;
  const LOCALNODE = process.env.LOCALNODE;

  const nodeIsHealthy = async (url) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "jsonrpc": "2.0", "id": 1, "method": "health.getLiveness" });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
      const response = await fetch(`${url}/ext/health`, requestOptions);
      const bodyResponse = await response.json();
      return bodyResponse.healthy;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    const loadProviders = async () => {
      if (loading && library) {
        try {
          const privateProvider = new ethers.providers.
            StaticJsonRpcProvider(`${PRIVATENODE}ext/bc/C/rpc`);

          try {
            //do a quick call at avalanche burn address to see if it`s acessible
            const provider = library.getSigner().provider;
            await provider.getBalance('0x0100000000000000000000000000000000000000');
            setProvider(provider);
          } catch (error) {
            console.error(error);
            setProvider(privateProvider);
          }
        } finally {
          setLoading(false);
        }
      }
    }
    loadProviders();
  }, [loading, PRIVATENODE, LOCALNODE, library]);


  return (
    <ProviderContext.Provider
      value={{
        provider
      }}
    >
      {children}
    </ProviderContext.Provider>
  )
}

export function useProvider() {
  const context = useContext(ProviderContext)
  if (!context) {
    throw new Error('Context not Loaded yet!')
  }

  const {
    provider
  } = context

  return {
    provider
  }
}