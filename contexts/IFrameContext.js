import { useRouter } from "next/router";
import React, { memo, useEffect } from "react";
import { widgetBridge, RomeEventType } from "@romeblockchain/bridge";


export const IFrameContext = React.createContext({
  widgetBridge: null,
});

const IframeProvider =({ children }) => {
  const router = useRouter();
  useEffect(() => {
    widgetBridge.init();
    widgetBridge
    widgetBridge.subscribe(
      RomeEventType.TERMINAL_CLICK_BUTTON,
      function (action) {
        const id=typeof action.payload==="string"?action.payload:action.payload.id
        switch (id) {
          case "home":
            case 'dashboard':
            case '':
            case '/':
            router.push("/");
            break;
          case "compound-and-earn":
            router.push("/compound-and-earn");
            break;
          case "staking":
            router.push("/staking");
            break;
          case "governance":
            router.push("/governance");
            break;
          case "nft-marketplace":
            router.push("/nft-marketplace");
            break;
          default:
            break;
        }
      }
    );
  }, []);

  return (
    <IFrameContext.Provider value={{ widgetBridge }}>
      {children}
    </IFrameContext.Provider>
  );
};

export default IframeProvider;
