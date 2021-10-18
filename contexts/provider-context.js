import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";


const ProviderContext = createContext(null);

export function ProviderProvider({ children }) {
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
      if (loading) {
        try {
          if (process.env.ENVIRONMENT == 'DEV' && LOCALNODE) {
            const localProvider = new ethers.providers.StaticJsonRpcProvider(`${LOCALNODE}/ext/bc/C/rpc`);
            return setProvider(localProvider)
          }
          //check if our node is healthy
          const nodeHealthy = await nodeIsHealthy(PRIVATENODE);
          if (nodeHealthy) {

            const privateProvider = new ethers.providers.
              StaticJsonRpcProvider(`${PRIVATENODE}ext/bc/C/rpc`);

            //do a quick call to check if the node is sync
            try {
              //avalanche burn address
              await privateProvider.getBalance('0x0100000000000000000000000000000000000000');
              setProvider(privateProvider);
            } catch (error) {
              console.error(error);
              setProvider(
                new ethers.providers.
                  StaticJsonRpcProvider(AVALANCHE_MAINNET_PARAMS.rpcUrls[0])
              );
            }
          } else {
            setProvider(
              new ethers.providers.
                StaticJsonRpcProvider(AVALANCHE_MAINNET_PARAMS.rpcUrls[0])
            );
          }
        } finally {
          setLoading(false);
        }
      }
    }
    loadProviders();
  }, [loading, PRIVATENODE, LOCALNODE]);


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