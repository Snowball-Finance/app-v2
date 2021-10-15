import { useWeb3React } from "@web3-react/core";
import { createContext, useContext, useEffect, useState } from "react";
import { getBestStaticProvider } from "utils/helpers/utility";


const ProviderContext = createContext(null);

export function ProviderProvider({ children }) {
  const { account, library } = useWeb3React();
  const [provider, setProvider] = useState(null);
  const [unsignedProvider, setUnsignedProvider] = useState(null);

  const PRIVATENODE = process.env.PRIVATENODE;

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
      //if there's a wallet connected
      const bestProvider = await getBestStaticProvider(library)

      setUnsignedProvider(bestProvider)
      if(library){
        setProvider(bestProvider)
      }
    }
    loadProviders();
  }, [PRIVATENODE, library, account]);


  return (
    <ProviderContext.Provider
      value={{
        provider,
        unsignedProvider
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
    provider,
    unsignedProvider
  } = context

  return {
    provider,
    unsignedProvider
  }
}