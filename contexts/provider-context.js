import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";


const ProviderContext = createContext(null);

export function ProviderProvider({ children }) {
  const { account, library } = useWeb3React();
  const [provider, setProvider] = useState(null);

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
      const privateProvider = new ethers.providers.
        StaticJsonRpcProvider(`${PRIVATENODE}ext/bc/C/rpc`);
      //if there's a wallet connected
      if (library) {
        try {
          //do a quick call at avalanche burn address to see if it`s acessible
          const provider = library.getSigner().provider;
          await provider.getBalance('0x0100000000000000000000000000000000000000');
          setProvider(provider);
        } catch (error) {
          console.error(error);
          setProvider(privateProvider);
        }
        //we need an unsigned provider if there's no wallet connected
      }
    }
    loadProviders();
  }, [PRIVATENODE, library, account]);


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