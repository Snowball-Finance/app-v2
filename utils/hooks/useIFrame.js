import { IFrameContext } from "contexts/IFrameContext";
import React from "react";

const useIFrame = () => {
  const context = React.useContext(IFrameContext);

  if (!context) {
    throw new Error("useIframe must be used within a IFrameProvider");
  }
  return context;
};

export default useIFrame;
