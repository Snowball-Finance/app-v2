
import { memo } from 'react'
import ReactLottie from 'react-lottie'

import Lotties from './LottieList'

const defaultOptions = {
  loop: false,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  },
};

const dinamicLottie = ({ show, icon, size = 100 || size, ...rest }) => {
  if (!show)
    return null;
  return (
    <ReactLottie
      isPaused={false}
      isStopped={false}
      options={{...defaultOptions, animationData: Lotties[icon]}}
      style={{ width: size, height: size }}
      {...rest}
    />
    
  );
};

export default memo(dinamicLottie);